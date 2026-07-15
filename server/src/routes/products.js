import { Router } from 'express';
import { query } from '../db.js';
import { ah } from '../util.js';

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

// GET /api/products -> all active products
router.get('/', ah(async (_req, res) => {
  const { rows } = await query('SELECT * FROM products WHERE active = true ORDER BY series, model');
  res.json({ products: rows.map(toProduct) });
}));

// GET /api/products/:sku
router.get('/:sku', ah(async (req, res) => {
  const { rows } = await query('SELECT * FROM products WHERE sku = $1 AND active = true', [req.params.sku]);
  if (!rows[0]) return res.status(404).json({ error: 'Product not found' });
  res.json({ product: toProduct(rows[0]) });
}));

export default router;
