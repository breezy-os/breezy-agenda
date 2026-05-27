
import { useAgendaStore, type AgendaDeadline, type AgendaEvent, type AgendaItem, type AgendaTask } from "./AgendaState";
import { formatDateForDay, formatYYYYMMDD } from "./utilities/DateUtils";

export type DayViewProps = {
  date: string;
  majorEvents: (AgendaItem & AgendaEvent)[];
  minorEvents: (AgendaItem & AgendaEvent)[];
  deadlines: (AgendaItem & AgendaDeadline)[];
  tasks: (AgendaItem & AgendaTask)[];
};

export default function DayView(props: DayViewProps) {
  const { beginItemCreation, updateEditedItem } = useAgendaStore(state => state.actions);
  const today = formatYYYYMMDD(new Date());
  const oddDayOfWeek = new Date(props.date).getUTCDay() % 2 === 1;

  const createLineItem = (item: AgendaItem, type: string) => {
    const isComplete = 'isComplete' in item ? item.isComplete : props.date < today;
    return <div
      key={item.id}
      style={{ cursor: 'pointer' }}
      className={isComplete ? `${type} completed` : type}
      onClick={() => updateEditedItem({...item})}
    >{item.text}</div>;
  };

  return (
    <div className="dayView" style={{
      height: oddDayOfWeek ? 'calc(100% / 3)' : 'calc(100% / 4)' ,
      padding: '10px',
    }}>
      <div className="card">
        <h4 style={{ background: 'var(--background)', flex: '0 0' }}>
          {props.date === today && '⭐'} {formatDateForDay(props.date)} {props.date === today && '⭐'}
        </h4>
        <div style={{
          flex: '1 1',
          minHeight: '0',
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: 'column',
          padding: '0px 10px 10px 10px',
          alignItems: 'start',
          lineHeight: '22px',
          background: 'repeating-linear-gradient(var(--background), var(--background) 21px, rgba(0,0,255,0.3) 22px)',
        }}>
          {props.deadlines?.map(d => createLineItem(d, 'deadline'))}
          {props.majorEvents?.map(e => createLineItem(e, 'majorEvent'))}
          {props.minorEvents?.map(e => createLineItem(e, 'minorEvent'))}
          {props.tasks?.map(t => createLineItem(t, 'task'))}
          <div className="addItemLink" onClick={() => beginItemCreation(props.date)}>Add item</div>
        </div>
      </div>
    </div>
  );
}
