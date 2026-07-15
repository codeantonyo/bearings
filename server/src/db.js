import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'url';
import path from 'path';

// Uses Node's built-in SQLite (node:sqlite, Node 22.5+). No native build step
// is required — important on Windows machines without Visual Studio tools.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'beco.db');

export const db = new DatabaseSync(dbPath);
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

// Minimal transaction helper (node:sqlite has no db.transaction()).
export function transaction(fn) {
  db.exec('BEGIN');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name          TEXT NOT NULL DEFAULT '',
    role          TEXT NOT NULL DEFAULT 'customer',
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
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
    active     INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
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
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    sku      TEXT NOT NULL,
    name     TEXT NOT NULL,
    price    REAL NOT NULL,
    qty      INTEGER NOT NULL
  );
`);
