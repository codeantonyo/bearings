import { Router } from 'express';
import multer from 'multer';
import { query } from '../db.js';
import { requireAdmin } from '../auth.js';
import { toProduct } from './products.js';
import { saveImage, removeImage } from '../blob.js';
import { ah } from '../util.js';

// In-memory storage: the buffer is forwarded to Vercel Blob (or written to disk
// locally). Works in serverless where there is no persistent filesystem.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed.'));
  },
});

const router = Router();
router.use(requireAdmin);

// ---- Products -------------------------------------------------------------

router.get('/products', ah(async (_req, res) => {
  const { rows } = await query('SELECT * FROM products ORDER BY series, model');
  res.json({ products: rows.map(toProduct) });
}));

router.post('/products', ah(async (req, res) => {
  const b = req.body || {};
  const p = {
    sku: String(b.sku || '').trim(),
    model: String(b.model || '').trim(),
    series: String(b.series || '').trim(),
    price: Number(b.price),
    stock: parseInt(b.stock, 10),
    d: Number(b.d) || 0,
    outer_d: Number(b.D) || 0,
    width: Number(b.W) || 0,
    weight_g: Number(b.weight_g) || 0,
    rpm: parseInt(b.rpm, 10) || 0,
    c0: Number(b.c0) || 0,
  };
  if (!p.sku || !p.model || !p.series) return res.status(400).json({ error: 'SKU, model and series are required.' });
  if (!Number.isFinite(p.price) || p.price < 0) return res.status(400).json({ error: 'Price must be a positive number.' });
  if (!Number.isFinite(p.stock) || p.stock < 0) return res.status(400).json({ error: 'Stock must be a non-negative integer.' });

  const dup = await query('SELECT id FROM products WHERE sku = $1', [p.sku]);
  if (dup.rows[0]) return res.status(409).json({ error: 'A product with this SKU already exists.' });

  const { rows } = await query(
    `INSERT INTO products (sku, model, series, price, stock, d, outer_d, width, weight_g, rpm, c0)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
    [p.sku, p.model, p.series, p.price, p.stock, p.d, p.outer_d, p.width, p.weight_g, p.rpm, p.c0]
  );
  res.status(201).json({ product: toProduct(rows[0]) });
}));

router.patch('/products/:id', ah(async (req, res) => {
  const cur = await query('SELECT * FROM products WHERE id = $1', [req.params.id]);
  const row = cur.rows[0];
  if (!row) return res.status(404).json({ error: 'Product not found' });

  const b = req.body || {};
  // map: request key -> { col, cast }
  const map = {
    sku: ['sku', String], model: ['model', String], series: ['series', String],
    price: ['price', Number], stock: ['stock', (v) => parseInt(v, 10)],
    d: ['d', Number], D: ['outer_d', Number], W: ['width', Number],
    weight_g: ['weight_g', Number], rpm: ['rpm', (v) => parseInt(v, 10)],
    c0: ['c0', Number], active: ['active', (v) => !!v],
  };

  const sets = [];
  const vals = [];
  for (const [key, [col, cast]] of Object.entries(map)) {
    if (b[key] === undefined) continue;
    let v = cast(b[key]);
    if (key === 'sku') {
      v = String(v).trim();
      const dup = await query('SELECT id FROM products WHERE sku = $1 AND id <> $2', [v, row.id]);
      if (dup.rows[0]) return res.status(409).json({ error: 'Another product already uses this SKU.' });
    }
    vals.push(v);
    sets.push(`${col} = $${vals.length}`);
  }
  if (sets.length === 0) return res.json({ product: toProduct(row) });

  vals.push(row.id);
  const { rows } = await query(`UPDATE products SET ${sets.join(', ')} WHERE id = $${vals.length} RETURNING *`, vals);
  res.json({ product: toProduct(rows[0]) });
}));

router.delete('/products/:id', ah(async (req, res) => {
  const cur = await query('SELECT image FROM products WHERE id = $1', [req.params.id]);
  if (!cur.rows[0]) return res.status(404).json({ error: 'Product not found' });
  await query('DELETE FROM products WHERE id = $1', [req.params.id]);
  await removeImage(cur.rows[0].image);
  res.json({ ok: true });
}));

router.post('/products/:id/image', upload.single('image'), ah(async (req, res) => {
  const cur = await query('SELECT * FROM products WHERE id = $1', [req.params.id]);
  const row = cur.rows[0];
  if (!row) return res.status(404).json({ error: 'Product not found' });
  if (!req.file) return res.status(400).json({ error: 'No image uploaded.' });

  const url = await saveImage(req.file);
  await removeImage(row.image); // clean up the previous photo
  const { rows } = await query('UPDATE products SET image = $1 WHERE id = $2 RETURNING *', [url, row.id]);
  res.json({ product: toProduct(rows[0]) });
}));

// ---- Orders ---------------------------------------------------------------

router.get('/orders', ah(async (_req, res) => {
  const { rows: orders } = await query('SELECT * FROM orders ORDER BY id DESC');
  const result = [];
  for (const o of orders) {
    const { rows: items } = await query('SELECT sku, name, price, qty FROM order_items WHERE order_id = $1', [o.id]);
    result.push({
      id: o.id,
      orderNum: o.order_num,
      email: o.email,
      name: `${o.first_name} ${o.last_name}`.trim(),
      company: o.company,
      address: [o.address, o.zip, o.city, o.country].filter(Boolean).join(', '),
      subtotal: o.subtotal,
      status: o.status,
      date: o.created_at,
      items,
    });
  }
  res.json({ orders: result });
}));

export default router;
