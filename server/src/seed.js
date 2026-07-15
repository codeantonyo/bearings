import bcrypt from 'bcryptjs';
import { db, transaction } from './db.js';
import { config } from './config.js';
import { SERIES, MODELS, CATALOG, seedStockFor } from './catalog-data.js';

// Seed products from the design catalog — only if the table is empty, so
// admin edits are never overwritten on restart.
export function seedProducts() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM products').get().n;
  if (count > 0) return { inserted: 0, skipped: true };

  const insert = db.prepare(`
    INSERT INTO products (sku, model, series, price, stock, d, outer_d, width, weight_g, rpm, c0)
    VALUES (@sku, @model, @series, @price, @stock, @d, @outer_d, @width, @weight_g, @rpm, @c0)
  `);

  const insertMany = (rows) => transaction(() => {
    for (const r of rows) insert.run(r);
  });

  const rows = CATALOG.map(([seriesKey, model, price]) => {
    const s = SERIES[seriesKey];
    const m = MODELS[model];
    const sku = `${model} ${s.suffix}`;
    return {
      sku, model, series: seriesKey, price,
      stock: seedStockFor(sku),
      d: m.d, outer_d: m.D, width: m.W, weight_g: m.g, rpm: m.rpm, c0: m.c0,
    };
  });

  insertMany(rows);
  return { inserted: rows.length, skipped: false };
}

// Ensure the single admin account exists.
export function seedAdmin() {
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(config.adminEmail);
  if (existing) return { created: false };
  const hash = bcrypt.hashSync(config.adminPassword, 10);
  db.prepare('INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)')
    .run(config.adminEmail, hash, 'Administrator', 'admin');
  return { created: true };
}

export function runSeed() {
  const p = seedProducts();
  const a = seedAdmin();
  if (!p.skipped) console.log(`[seed] inserted ${p.inserted} products`);
  if (a.created) console.log(`[seed] created admin account: ${config.adminEmail}`);
}

// Allow running standalone: `npm run seed`
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeed();
  console.log('[seed] done');
}
