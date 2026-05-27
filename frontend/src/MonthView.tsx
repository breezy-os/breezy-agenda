
import { useEffect, useMemo, useRef, useState } from "react";
import { END_YEAR, START_YEAR, useAgendaStore } from "./AgendaState";
import { formatYYYYMMDD, generateDateRange, getDayOfWeek, getMonthString, getNumDays } from "./utilities/DateUtils";
import { createRange } from "./utilities/NumberUtils";

export default function MonthView() {
  const chosenDate = useAgendaStore(state => state.chosenDate);
  const goals = useAgendaStore(state => state.goals);
  const deadlines = useAgendaStore(state => state.deadlines);
  const majorEvents = useAgendaStore(state => state.majorEvents);
  const { chooseDate, updateEditedItem } = useAgendaStore(state => state.actions);

  const monthRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const today = formatYYYYMMDD(new Date());

  const yearRange = useMemo(() => createRange(START_YEAR, END_YEAR), [START_YEAR, END_YEAR]);

  const goalsByMonth = useMemo(() => {
    return goals.reduce((acc, goal) => {
      const key = goal.dueDate.slice(0, 7);
      if (!acc[key]) acc[key] = [];
      acc[key].push(goal);
      return acc;
    }, {} as Record<string, typeof goals>);
  }, [goals]);

  const deadlinesByDate = useMemo(() => {
    return deadlines.reduce((acc, deadline) => {
      const key = deadline.dueDate;
      if (!acc[key]) acc[key] = [];
      acc[key].push(deadline);
      return acc;
    }, {} as Record<string, typeof deadlines>);
  }, [deadlines]);

  const eventsByDate = useMemo(() => {
    return majorEvents.reduce((acc, event) => {
      // Events can have a range of dates, so we might add the same one to multiple days here.
      const dates = generateDateRange(event.startDate, event.endDate);
      dates.forEach(date => {
        if (!acc[date]) acc[date] = [];
        acc[date].push(event);
      });
      return acc;
    }, {} as Record<string, typeof majorEvents>);
  }, [majorEvents]);

  const [alreadyLoaded, setAlreadyLoaded] = useState<boolean>(false);
  useEffect(() => {
    const chosenMonth = chosenDate.slice(0, 7);
    const el = monthRefs.current[chosenMonth];
    if (el) {
      el.scrollIntoView({ behavior: alreadyLoaded ? 'smooth' : 'instant', block: 'center' })
      setAlreadyLoaded(true);
    }
  }, [chosenDate]);

  return (
    <div className="monthView">
      {/* Render each year */}
      {yearRange.map(year => {
        const yearStr = ('0000' + year).slice(-4);
        const months = createRange(1, 12);
        return <div key={yearStr}>

          {/* Render each month */}
          {months.map(month => {
            const monthStr = ('00' + month).slice(-2);
            const monthKey = `${yearStr}-${monthStr}`;
            const days = createRange(1, getNumDays(month, year));
            return (
              <div key={monthKey} className="month" ref={(el) => { monthRefs.current[monthKey] = el; }}>
                <h2>{getMonthString(month)} {year}</h2>

                {goalsByMonth[monthKey] && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', margin: '0 20px' }}>
                    {goalsByMonth[monthKey].map(g => (
                      <div
                        key={g.id}
                        style={{ cursor: 'pointer' }}
                        className={g.isComplete ? "goal completed" : "goal"}
                        onClick={() => updateEditedItem({...g})}
                      >- {g.text}</div>
                    ))}
                  </div>
                )}

                {/* Render each day */}
                <div>
                  {days.map(day => {
                    const dayStr = ('00' + day).slice(-2);
                    const dayKey = `${yearStr}-${monthStr}-${dayStr}`;
                    const dayOfWeek = getDayOfWeek(new Date(dayKey).getUTCDay());
                    return (
                      <div
                        key={dayKey}
                        className="day"
                        onClick={() => chooseDate(dayKey)}
                      >
                        <span style={{
                          flex: '0 0 60px',
                          textAlign: 'right',
                          fontWeight: today === dayKey ? 'bold' : 'normal',
                          opacity: dayKey < today ? '0.4' : '1',
                        }}>{dayOfWeek} {day}</span>
                        <div style={{ flex: '1 1' }}>
                          {deadlinesByDate[dayKey]?.map(deadline => (
                            <div
                              key={deadline.id}
                              className={deadline.isComplete ? "deadline completed" : "deadline"}
                            >{deadline.text}</div>
                          ))}
                          {eventsByDate[dayKey]?.map(event => (
                            <div
                              key={event.id}
                              className={dayKey < today ? "majorEvent completed" : "majorEvent"}
                            >{event.text}</div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      })}
    </div>
  )
}
