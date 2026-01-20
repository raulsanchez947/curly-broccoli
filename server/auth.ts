import express from 'express';
import crypto from 'crypto';

interface User {
  username: string;
  passwordHash: string;
  created_at: string;
}

const users = new Map<string, User>();
const sessions = new Map<string, string>();

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function setupAuth(app: express.Express) {
  const router = express.Router();

  router.post('/api/signup', (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing username or password' });
    }
    if (users.has(username)) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const user: User = {
      username,
      passwordHash: hashPassword(password),
      created_at: new Date().toISOString()
    };

    users.set(username, user);

    const sessionId = crypto.randomUUID();
    sessions.set(sessionId, username);

    return res.json({ sessionId, username });
  });

  router.post('/api/login', (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing username or password' });
    }
    const user = users.get(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const sessionId = crypto.randomUUID();
    sessions.set(sessionId, username);

    return res.json({ sessionId, username });
  });

  router.get('/api/me', (req, res) => {
    const auth = req.headers.authorization || '';
    const token = auth.replace(/^Bearer\s*/, '') || (req.query.sessionId as string) || '';
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    const username = sessions.get(token);
    if (!username) return res.status(401).json({ error: 'Invalid session' });
    return res.json({ username });
  });

  app.use(router);
}

export function getUsernameForSession(sessionId: string | undefined) {
  if (!sessionId) return undefined;
  return sessions.get(sessionId);
}

export function _unsafe_clearAuthStores() {
  users.clear();
  sessions.clear();
}
