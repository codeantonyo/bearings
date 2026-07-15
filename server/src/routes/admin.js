import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from '../db.js';
import { requireAdmin } from '../auth.js';
import { toProduct } from './products.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `product-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed.'));
  },
});

const router = Router();
router.use(requireAdmin);

// ---- Products -------------------------------------------------------------

// GET /api/admin/products -> all products (including inactive)
router.get('/products', (_req, res) => {
  const rows = db.prepare('SELECT * FROM products ORDER BY series, model').all();
  res.json({ products: rows.map(toProduct) });
});

function readProductBody(b) {
  return {
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
}

// POST /api/admin/products -> create
router.post('/products', (req, res) => {
  const p = readProductBody(req.body);
  if (!p.sku || !p.model || !p.series) return res.status(400).json({ error: 'SKU, model and series are required.' });
  if (!Number.isFinite(p.price) || p.price < 0) return res.status(400).json({ error: 'Price must be a positive number.' });
  if (!Number.isFinite(p.stock) || p.stock < 0) return res.status(400).json({ error: 'Stock must be a non-negative integer.' });

  const dup = db.prepare('SELECT id FROM products WHERE sku = ?').get(p.sku);
  if (dup) return res.status(409).json({ error: 'A product with this SKU already exists.' });

  const info = db.prepare(`
    INSERT INTO products (sku, model, series, price, stock, d, outer_d, width, weight_g, rpm, c0)
    VALUES (@sku, @model, @series, @price, @stock, @d, @outer_d, @width, @weight_g, @rpm, @c0)
  `).run(p);
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(info.lastInsertRowid));
  res.status(201).json({ product: toProduct(row) });
});

// PATCH /api/admin/products/:id -> update any provided fields
router.patch('/products/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Product not found' });

  const b = req.body || {};
  const map = { sku: 'sku', model: 'model', series: 'series', price: 'price', stock: 'stock',
    d: 'd', D: 'outer_d', W: 'width', weight_g: 'weight_g', rpm: 'rpm', c0: 'c0', active: 'active' };
  const sets = [];
  const vals = {};
  for (const [key, col] of Object.entries(map)) {
    if (b[key] === undefined) continue;
    let v = b[key];
    if (['price', 'd', 'D', 'W', 'weight_g', 'c0'].includes(key)) v = Number(v);
    if (['stock', 'rpm'].includes(key)) v = parseInt(v, 10);
    if (key === 'active') v = b[key] ? 1 : 0;
    if (key === 'sku') {
      v = String(v).trim();
      const dup = db.prepare('SELECT id FROM products WHERE sku = ? AND id != ?').get(v, row.id);
      if (dup) return res.status(409).json({ error: 'Another product already uses this SKU.' });
    }
    sets.push(`${col} = @${col}`);
    vals[col] = v;
  }
  if (sets.length === 0) return res.json({ product: toProduct(row) });

  vals.id = row.id;
  db.prepare(`UPDATE products SET ${sets.join(', ')} WHERE id = @id`).run(vals);
  const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(row.id);
  res.json({ product: toProduct(updated) });
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', (req, res) => {
  const info = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Product not found' });
  res.json({ ok: true });
});

// POST /api/admin/products/:id/image -> upload/replace product photo
router.post('/products/:id/image', upload.single('image'), (req, res) => {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Product not found' });
  if (!req.file) return res.status(400).json({ error: 'No image uploaded.' });

  // Remove the previous file if it lived in our uploads dir.
  if (row.image && row.image.startsWith('/uploads/')) {
    const old = path.join(uploadsDir, path.basename(row.image));
    fs.promises.unlink(old).catch(() => {});
  }
  const publicPath = `/uploads/${req.file.filename}`;
  db.prepare('UPDATE products SET image = ? WHERE id = ?').run(publicPath, row.id);
  const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(row.id);
  res.json({ product: toProduct(updated) });
});

// ---- Orders ---------------------------------------------------------------

// GET /api/admin/orders -> every order with its items
router.get('/orders', (_req, res) => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY id DESC').all();
  const itemStmt = db.prepare('SELECT sku, name, price, qty FROM order_items WHERE order_id = ?');
  res.json({
    orders: orders.map((o) => ({
      id: o.id,
      orderNum: o.order_num,
      email: o.email,
      name: `${o.first_name} ${o.last_name}`.trim(),
      company: o.company,
      address: [o.address, o.zip, o.city, o.country].filter(Boolean).join(', '),
      subtotal: o.subtotal,
      status: o.status,
      date: o.created_at,
      items: itemStmt.all(o.id),
    })),
  });
});

export default router;
