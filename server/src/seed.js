import bcrypt from 'bcryptjs';
import { query } from './db.js';
import { config } from './config.js';
import { SERIES, MODELS, CATALOG, seedStockFor } from './catalog-data.js';

// Seed products from the design catalogue. Idempotent: ON CONFLICT skips rows
// that already exist, so admin edits are never overwritten and it's safe to
// run on every serverless cold start.
export async function seedProducts() {
  const rows = CATALOG.map(([seriesKey, model, price]) => {
    const s = SERIES[seriesKey];
    const m = MODELS[model];
    const sku = `${model} ${s.suffix}`;
    return { sku, model, series: seriesKey, price, stock: seedStockFor(sku), d: m.d, D: m.D, W: m.W, g: m.g, rpm: m.rpm, c0: m.c0 };
  });

  let inserted = 0;
  for (const r of rows) {
    const res = await query(
      `INSERT INTO products (sku, model, series, price, stock, d, outer_d, width, weight_g, rpm, c0)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (sku) DO NOTHING`,
      [r.sku, r.model, r.series, r.price, r.stock, r.d, r.D, r.W, r.g, r.rpm, r.c0]
    );
    inserted += res.rowCount || 0;
  }
  if (inserted > 0) console.log(`[seed] inserted ${inserted} products`);
  return inserted;
}

// Ensure the single admin account exists.
export async function seedAdmin() {
  const hash = bcrypt.hashSync(config.adminPassword, 10);
  const res = await query(
    `INSERT INTO users (email, password_hash, name, role)
     VALUES ($1,$2,$3,'admin')
     ON CONFLICT (email) DO NOTHING`,
    [config.adminEmail, hash, 'Administrator']
  );
  if (res.rowCount > 0) console.log(`[seed] created admin account: ${config.adminEmail}`);
  return res.rowCount || 0;
}

// Allow running standalone against the configured database: `npm run seed`.
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('seed.js')) {
  const { ensureReady } = await import('./db.js');
  await ensureReady();
  console.log('[seed] done');
  process.exit(0);
}
