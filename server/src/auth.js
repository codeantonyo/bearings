import jwt from 'jsonwebtoken';
import { config } from './config.js';
import { query } from './db.js';

export function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

export function publicUser(user) {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

// Attaches req.user if a valid Bearer token is present; otherwise leaves it null.
export async function authOptional(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  req.user = null;
  if (token) {
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      const { rows } = await query('SELECT id, email, name, role FROM users WHERE id = $1', [payload.id]);
      if (rows[0]) req.user = rows[0];
    } catch {
      /* invalid/expired token -> treated as anonymous */
    }
  }
  next();
}

export function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  next();
}

export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
}
