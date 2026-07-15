import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';

// Data layer that speaks Postgres in production (Neon / Vercel Postgres via the
// `pg` driver) and runs an in-process PGlite Postgres for local development —
// so the SAME SQL runs in both places. All queries use $1, $2 placeholders.

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let backendPromise = null;

async function initBackend() {
  if (backendPromise) return backendPromise;
  backendPromise = (async () => {
    if (config.databaseUrl) {
      const pg = (await import('pg')).default;
      const pool = new pg.Pool({
        connectionString: config.databaseUrl,
        ssl: { rejectUnauthorized: false }, // hosted Postgres (Neon) requires SSL
        max: 3,
      });
      return {
        kind: 'pg',
        query: (text, params) => pool.query(text, params),
        withTx: async (fn) => {
          const client = await pool.connect();
          try {
            await client.query('BEGIN');
            const r = await fn((t, p) => client.query(t, p));
            await client.query('COMMIT');
            return r;
          } catch (e) {
            await client.query('ROLLBACK');
            throw e;
          } finally {
            client.release();
          }
        },
      };
    }

    // Local dev: PGlite (pure JS/WASM, no native build, persists to disk).
    const { PGlite } = await import('@electric-sql/pglite');
    const lite = new PGlite(path.join(__dirname, '..', '.pgdata'));
    await lite.waitReady;
    return {
      kind: 'pglite',
      query: (text, params) => lite.query(text, params),
      withTx: (fn) => lite.transaction((tx) => fn((t, p) => tx.query(t, p))),
    };
  })();
  return backendPromise;
}

export async function query(text, params) {
  const b = await initBackend();
  return b.query(text, params);
}

export async function withTx(fn) {
  const b = await initBackend();
  return b.withTx(fn);
}

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name          TEXT NOT NULL DEFAULT '',
    role          TEXT NOT NULL DEFAULT 'customer',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE TABLE IF NOT EXISTS products (
    id         SERIAL PRIMARY KEY,
    sku        TEXT NOT NULL UNIQUE,
    model      TEXT NOT NULL,
    series     TEXT NOT NULL,
    price      REAL NOT NULL,
    stock      INTEGER NOT NULL DEFAULT 0,
    d          REAL NOT NULL DEFAULT 0,
    outer_d    REAL NOT NULL DEFAULT 0,
    width      REAL NOT NULL DEFAULT 0,
    weight_g   REAL NOT NULL DEFAULT 0,
    rpm        INTEGER NOT NULL DEFAULT 0,
    c0         REAL NOT NULL DEFAULT 0,
    image      TEXT,
    active     BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE TABLE IF NOT EXISTS orders (
    id         SERIAL PRIMARY KEY,
    order_num  TEXT NOT NULL UNIQUE,
    user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
    email      TEXT NOT NULL,
    first_name TEXT NOT NULL DEFAULT '',
    last_name  TEXT NOT NULL DEFAULT '',
    company    TEXT NOT NULL DEFAULT '',
    address    TEXT NOT NULL DEFAULT '',
    city       TEXT NOT NULL DEFAULT '',
    zip        TEXT NOT NULL DEFAULT '',
    country    TEXT NOT NULL DEFAULT '',
    subtotal   REAL NOT NULL DEFAULT 0,
    status     TEXT NOT NULL DEFAULT 'pending_payment',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE TABLE IF NOT EXISTS order_items (
    id       SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    sku      TEXT NOT NULL,
    name     TEXT NOT NULL,
    price    REAL NOT NULL,
    qty      INTEGER NOT NULL
  );
`;

let readyPromise = null;

// Idempotent: creates tables then seeds catalogue + admin if missing. Safe to
// call on every serverless cold start; memoized per warm instance.
export function ensureReady() {
  if (readyPromise) return readyPromise;
  readyPromise = (async () => {
    const b = await initBackend();
    // Split on ';' so both pg and PGlite run the statements one by one.
    for (const stmt of SCHEMA.split(';')) {
      const s = stmt.trim();
      if (s) await b.query(s);
    }
    const { seedProducts, seedAdmin } = await import('./seed.js');
    await seedProducts();
    await seedAdmin();
  })();
  return readyPromise;
}
