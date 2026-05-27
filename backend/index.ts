
import express from 'express';
import session from 'express-session';
import path from 'path';
import fs from 'fs';

import * as DATA from './data-persistence.ts';


// ============
// Server Setup
// ------------

const app = express();
app.use(session({
  secret: "Change me for your production environment.",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 72 * 60 * 60 * 1000, // 72 hours (3 days)
    httpOnly: true,
    secure: false,
    sameSite: 'strict'
  }
}));
app.use(express.json());

app.use(express.static(path.join(import.meta.dirname, 'dist')))


const dataPath = path.resolve(DATA.DATA_DIR);
if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath);
}


// ==================
// Session Management
// ------------------

export const cachedData: Record<string, DATA.AgendaData> = {};

function requireAuth(req: any, res: any, next: any) {
  if (req.session.username) return next();
  return res.status(401).send('Login Required');
};

function credentialsAreInvalid(username: string, password: string) {
  return !username || username.trim() === '' || username.includes('.') || !password || password.trim() === '';
}

app.get('/api/session', async (req, res, next) => {
  const username = (req.session as any).username;
  return res.send((username && cachedData[username])
    ? { data: cachedData[username] }
    : { data: null });
});

app.post('/api/login', async (req, res) => {
  // Make sure the credentials are valid
  const { username, password } = req.body;
  if (credentialsAreInvalid(username, password)) {
    return res.status(400).send('Bad request');
  }
  // Try to log in by loading the data file
  try {
    const data = DATA.loadDataFile(username, password);
    cachedData[username] = data;
    req.session.regenerate(() => { // Prevent session fixation
      (req.session as any).username = username;
      res.status(200).send(data);
    });
    return;
  } catch (err) {
    console.error(err);
    return res.status(401).send('Login failed');
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Logout failed');
    }
    return res.status(200).send('Logout successful');
  });
});

app.post('/api/create-account', async (req, res) => {
  // Make sure the credentials are valid
  const { username, password } = req.body;
  if (credentialsAreInvalid(username, password)) {
    return res.status(400).send('Bad request');
  }
  // Try to create the file
  try {
    DATA.createDataFile(username, password);
    return res.status(200).send();
  } catch (err) {
    return res.status(400).send('Bad request');
  }
});


// =====================
// Application Endpoints
// ---------------------

app.put('/api/item', requireAuth, async (req, res) => {
  const username = (req.session as any).username;
  if (!username) {
    return res.status(503).send('Unexpected session issues.');
  }
  const item = req.body as any;
  cachedData[username].items[item.id] = item;
  DATA.persistDataFile(username, "password", cachedData[username]);
  return res.status(200).send();
});

app.delete('/api/item', requireAuth, async (req, res) => {
  const username = (req.session as any).username;
  if (!username) {
    return res.status(503).send('Unexpected session issues.');
  }
  const itemId = req.body.itemId as string;
  delete cachedData[username].items[itemId];
  DATA.persistDataFile(username, "password", cachedData[username]);
  return res.status(200).send();
});


// ============
// Kick it off!
// ------------

app.listen(3000, () => {
  console.log("Listening on 3000");
});
