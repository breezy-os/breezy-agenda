
import { useEffect, useMemo, useRef, useState } from "react";
import { END_YEAR, START_YEAR, useAgendaStore } from "./AgendaState";
import { formatUtcYYYYMMDD, generateDateRange, yyyymmdd } from "./utilities/DateUtils";
import DayView from "./DayView";

export default function WeekView() {
  const chosenDate = useAgendaStore(state => state.chosenDate);
  const majorEvents = useAgendaStore(state => state.majorEvents);
  const minorEvents = useAgendaStore(state => state.minorEvents);
  const deadlines = useAgendaStore(state => state.deadlines);
  const tasks = useAgendaStore(state => state.tasks);

  const weekRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const majorEventsByDate = useMemo(() => {
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

  const minorEventsByDate = useMemo(() => {
    return minorEvents.reduce((acc, event) => {
      // Events can have a range of dates, so we might add the same one to multiple days here.
      const dates = generateDateRange(event.startDate, event.endDate);
      dates.forEach(date => {
        if (!acc[date]) acc[date] = [];
        acc[date].push(event);
      });
      return acc;
    }, {} as Record<string, typeof minorEvents>);
  }, [minorEvents]);

  const deadlinesByDate = useMemo(() => {
    return deadlines.reduce((acc, deadline) => {
      const key = deadline.dueDate;
      if (!acc[key]) acc[key] = [];
      acc[key].push(deadline);
      return acc;
    }, {} as Record<string, typeof deadlines>);
  }, [deadlines]);

  const tasksByDate = useMemo(() => {
    return tasks.reduce((acc, task) => {
      const key = task.date;
      if (!acc[key]) acc[key] = [];
      acc[key].push(task);
      return acc;
    }, {} as Record<string, typeof tasks>);
  }, [tasks]);

  const [alreadyLoaded, setAlreadyLoaded] = useState<boolean>(false);
  useEffect(() => {
    // Start with the chosen date
    let date = new Date(chosenDate);
    // Go back to the first day of the week
    const padStart = (date.getUTCDay() + 7) % 7;
    date.setUTCDate(date.getUTCDate() - padStart);
    // Use that to build our week key
    const chosenWeek = `week-${formatUtcYYYYMMDD(date)}`;
    // ...and then scroll to it
    const el = weekRefs.current[chosenWeek];
    if (el) {
      el.scrollIntoView({ behavior: alreadyLoaded ? 'smooth' : 'instant', block: 'start' })
      setAlreadyLoaded(true);
    }
  }, [chosenDate]);

  const weeks = useMemo(() => {
    let startDate = new Date(yyyymmdd(START_YEAR, 1, 1));
    let endDate = new Date(yyyymmdd(END_YEAR, 12, 31));

    // Figure out how many days to pad the start and end
    const padStart = (startDate.getUTCDay() + 7) % 7;
    const padEnd = (6 - endDate.getUTCDay());
    startDate.setUTCDate(startDate.getUTCDate() - padStart);
    endDate.setUTCDate(endDate.getUTCDate() + padEnd);
    // Create an array of dates
    const dates = generateDateRange(formatUtcYYYYMMDD(startDate), formatUtcYYYYMMDD(endDate));

    let currYear = dates[6].slice(0,4); // Year of the last day in the initial week.
    let weekCount = 1;
    const weeks = [];
    for (let d = 0; d < dates.length; d += 7) {
      const year = dates[d+6].slice(0, 4);
      if (year != currYear) {
        currYear = year;
        weekCount = 1;
      }
      weeks.push({
        year: currYear,
        weekNum: weekCount++,
        dates: dates.slice(d, d+7),
      });
    }

    return weeks;
  }, [START_YEAR, END_YEAR]);

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      {weeks.map(week => {
        // Keyed by the first day of the week
        const weekKey = `week-${week.dates[0]}`;
        return (
          <div
            key={weekKey}
            ref={(el) => { weekRefs.current[weekKey] = el; }}
            style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '20px' }}
          >
            <h3>Week {week.weekNum}</h3>
            <div style={{ flex: '1 1', minHeight: '0', display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: '1 1', height: '100%' }}>
                {[0,2,4,6].map(i => {
                  const day = week.dates[i];
                  return <DayView
                    key={day}
                    date={day}
                    majorEvents={majorEventsByDate[day]}
                    minorEvents={minorEventsByDate[day]}
                    deadlines={deadlinesByDate[day]}
                    tasks={tasksByDate[day]}
                   />
                })}
              </div>
              <div style={{ flex: '1 1', height: 'calc(100% * 0.75)' }}>
                {[1,3,5].map(i => {
                  const day = week.dates[i];
                  return <DayView
                    key={day}
                    date={day}
                    majorEvents={majorEventsByDate[day]}
                    minorEvents={minorEventsByDate[day]}
                    deadlines={deadlinesByDate[day]}
                    tasks={tasksByDate[day]}
                   />
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  )
}
