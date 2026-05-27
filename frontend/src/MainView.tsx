
import { useAgendaStore } from "./AgendaState";
import EditItem from "./EditItem.tsx";
import MonthView from "./MonthView.tsx";
import * as REST from './rest-calls.ts';
import WeekView from "./WeekView.tsx";

export default function MainView() {
  const { logOut } = useAgendaStore(state => state.actions);

  const tryLogOut = async () => {
    try {
      await REST.logOut();
      logOut();
    } catch (err) {
      // TODO: Show on screen
      console.error(err);
    }
  }

  return (
    <>
      <div style={{ display: 'flex', height: '100%', alignItems: 'stretch' }}>
        <div style={{ flex: '1 1 300px' }}><MonthView /></div>
        <div style={{ flex: '4 1 600px' }}><WeekView /></div>
      </div>

      <div style={{
        position: 'fixed',
        bottom: '26px',
        right: '85px',
      }}>
        <button onClick={tryLogOut}>Close Book</button>
      </div>
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
      }}>
        <EditItem />
      </div>
    </>
  )
}
