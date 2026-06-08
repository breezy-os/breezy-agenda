import { useEffect, useState } from "react";

import * as REST from './rest-calls';
import { useAgendaStore } from "./AgendaState";
import LogIn from "./LogIn";
import MainView from "./MainView";

export default function App() {
  const isLoggedIn = useAgendaStore(state => state.isLoggedIn);
  const { logIn, logOut, beginItemCreation, clearEditedItem } = useAgendaStore(state => state.actions);

  // When the app first loads, check to see if the user is already logged in.
  useEffect(() => { 
    REST.checkSession().then((r) => { 
      (r.data === null) ? logOut() : logIn(Object.values(r.data.items));
    });
  }, []);

  // When the app first loads, register some global hotkeys
  const [hotkeysRegistered, setHotkeysRegistered] = useState(false);
  if (!hotkeysRegistered) {
    setHotkeysRegistered(true);
    window.addEventListener('keydown', (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') { clearEditedItem(); }
    });
    window.addEventListener('keypress', (ev: KeyboardEvent) => {
      if      (ev.key === 't') { beginItemCreation(undefined, 'task'); }
      else if (ev.key === 'd') { beginItemCreation(undefined, 'deadline'); }
      else if (ev.key === 'g') { beginItemCreation(undefined, 'goal'); }
      else if (ev.key === 'E') { beginItemCreation(undefined, 'majorEvent'); }
      else if (ev.key === 'e') { beginItemCreation(undefined, 'minorEvent'); }

      if (ev.target && 'tagName' in ev.target && ev.target.tagName !== 'INPUT' && ev.target.tagName !== 'BUTTON') {
        ev.preventDefault();
      }
    });
  }

  return (
    <>
      {isLoggedIn === null ? (
        <p>Loading...</p>
      ) : !isLoggedIn ? (
        <LogIn />
      ) : (
        <MainView />
      )}
    </>
  )
}
