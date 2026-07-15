import express from 'express';
import cors from 'cors';
import { config, dbEnvSeen, isServerless } from './config.js';
import { ensureReady } from './db.js';
import { authOptional } from './auth.js';
import { uploadsDir } from './blob.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';

export function createApp() {
  const app = express();
  app.use(cors());

  // Health + diagnostics — declared BEFORE the DB-init middleware so it always
  // responds, even when the database is misconfigured. `db` shows whether a
  // Postgres URL was resolved; `dbEnvSeen` lists which connection env-var NAMES
  // are present (never values) so a missing/renamed variable is easy to spot.
  app.get('/api/health', (_req, res) => res.json({
    ok: true,
    service: 'beco-bearings-api',
    db: config.databaseUrl ? 'postgres' : (isServerless ? 'MISCONFIGURED (no Postgres URL)' : 'pglite (local)'),
    dbEnvSeen: dbEnvSeen(),
    blob: config.blobToken ? 'configured' : 'not-configured',
  }));

  // Body parsing that is safe both locally and on Vercel. On Vercel the
  // platform may already populate req.body for JSON requests; re-running
  // express.json() would clobber it, so only parse when it hasn't been.
  // multipart/form-data is left untouched so multer can read the file stream.
  app.use((req, res, next) => {
    if (req.body !== undefined && req.body !== null) return next();
    express.json({ limit: '1mb' })(req, res, next);
  });

  // Lazily create tables + seed on the first request (per warm instance).
  app.use((req, res, next) => {
    ensureReady().then(() => next()).catch(next);
  });

  app.use(authOptional);

  // Local dev: serve uploaded photos. On Vercel, images are absolute Blob URLs.
  app.use('/uploads', express.static(uploadsDir));

  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/admin', adminRoutes);

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err.status || 400).json({ error: err.message || 'Something went wrong.' });
  });

  return app;
}
