import { useState } from "react";

import * as REST from './rest-calls.ts';
import { useAgendaStore } from "./AgendaState.tsx";

export default function LogIn() {
  const { logIn } = useAgendaStore(state => state.actions);

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const tryCreateAccount = async () => {
    try {
      await REST.createAccount(username, password);
      // Show "success" message with an "ok, now log in for reals"
      // (Ensures user's credentials are correct before they create a bunch of things.)
      setUsername('');
      setPassword('');
    } catch (err) {
      // TODO: Show on screen
      console.error(err);
    }
  }

  const tryLogIn = async () => {
    try {
      const response = await REST.logIn(username, password);
      logIn(Object.values(response.items));
    } catch (err) {
      // TODO: Show on screen
      console.error(err);
    }
  }

  return (
    <div className="loginForm">
      <h1>Breezy Agenda</h1>
      <p className="notice">Log in below, or create an account by entering your desired credentials and clicking "Create Account".</p>

      <div style={{ margin: '20px', textAlign: 'center' }}>
        <div>
          <label>
            <span style={{ display: 'inline-block', width: '100px', textAlign: 'left' }}>Username:</span>
            <input type="text" onChange={(t) => setUsername(t.target.value)} value={username} />
          </label>
        </div>
        <div style={{ marginTop: '5px' }}>
          <label>
            <span style={{ display: 'inline-block', width: '100px', textAlign: 'left' }}>Password:</span>
            <input type="password" onChange={(t) => setPassword(t.target.value)} value={password} />
          </label>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'end',
        gap: '4px',
      }}>
        <button className="ghost" onClick={() => tryCreateAccount()}>Create Account</button>
        <button className="inset" onClick={() => tryLogIn()}>Log in</button>
      </div>
    </div>
  );
}