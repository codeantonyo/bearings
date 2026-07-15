import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

// Shape a DB row into the API product object the client consumes.
export function toProduct(row) {
  return {
    id: row.id,
    sku: row.sku,
    model: row.model,
    series: row.series,
    price: row.price,
    stock: row.stock,
    d: row.d,
    D: row.outer_d,
    W: row.width,
    weight_g: row.weight_g,
    rpm: row.rpm,
    c0: row.c0,
    image: row.image || null,
    active: !!row.active,
  };
}

// GET /api/products  -> all active products
router.get('/', (_req, res) => {
  const rows = db.prepare('SELECT * FROM products WHERE active = 1 ORDER BY series, model').all();
  res.json({ products: rows.map(toProduct) });
});

// GET /api/products/:sku
router.get('/:sku', (req, res) => {
  const row = db.prepare('SELECT * FROM products WHERE sku = ? AND active = 1').get(req.params.sku);
  if (!row) return res.status(404).json({ error: 'Product not found' });
  res.json({ product: toProduct(row) });
});

export default router;
