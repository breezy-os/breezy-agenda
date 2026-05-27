import { useEffect } from "react";

import * as REST from './rest-calls';
import { useAgendaStore } from "./AgendaState";
import LogIn from "./LogIn";
import MainView from "./MainView";

export default function App() {
  const isLoggedIn = useAgendaStore(state => state.isLoggedIn);
  const { logIn, logOut } = useAgendaStore(state => state.actions);

  // When the app first loads, check to see if the user is already logged in.
  useEffect(() => { 
    REST.checkSession().then((r) => { 
      (r.data === null) ? logOut() : logIn(Object.values(r.data.items));
    });
  }, []);

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
