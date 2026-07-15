import { Router } from 'express';
import { query, withTx } from '../db.js';
import { requireAuth } from '../auth.js';
import { ah } from '../util.js';

const router = Router();

const MIN_ORDER = 20; // EUR, per Beco policy

function genOrderNum() {
  return 'NL-' + (10000 + Math.floor(Math.random() * 89999));
}

// POST /api/orders
// Creates an order in `pending_payment` state — the last step BEFORE the card
// payment gateway. Prices/stock are validated server-side; client prices are
// ignored on purpose.
router.post('/', ah(async (req, res) => {
  const b = req.body || {};
  const items = Array.isArray(b.items) ? b.items : [];
  if (items.length === 0) return res.status(400).json({ error: 'Your cart is empty.' });

  const first = String(b.firstName || '').trim();
  const email = String(b.email || '').trim();
  const address = String(b.address || '').trim();
  if (!first || !email || !address) {
    return res.status(400).json({ error: 'First name, email and address are required.' });
  }

  // Resolve each line against the live catalogue.
  const lines = [];
  for (const it of items) {
    const qty = Math.max(1, parseInt(it.qty, 10) || 0);
    const { rows } = await query('SELECT * FROM products WHERE sku = $1 AND active = true', [it.sku]);
    const row = rows[0];
    if (!row) return res.status(400).json({ error: `Product no longer available: ${it.sku}` });
    if (row.stock < qty) return res.status(409).json({ error: `Only ${row.stock} of ${row.sku} left in stock.` });
    lines.push({ sku: row.sku, name: row.sku, price: row.price, qty });
  }

  const subtotal = lines.reduce((a, l) => a + l.price * l.qty, 0);
  if (subtotal < MIN_ORDER) return res.status(400).json({ error: `Minimum order is ${MIN_ORDER} €.` });

  const orderNum = genOrderNum();
  const orderId = await withTx(async (q) => {
    const { rows } = await q(
      `INSERT INTO orders (order_num, user_id, email, first_name, last_name, company, address, city, zip, country, subtotal, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'pending_payment') RETURNING id`,
      [orderNum, req.user ? req.user.id : null, email, first, String(b.lastName || '').trim(),
       String(b.company || '').trim(), address, String(b.city || '').trim(), String(b.zip || '').trim(),
       String(b.country || '').trim(), subtotal]
    );
    const id = rows[0].id;
    for (const l of lines) {
      await q('INSERT INTO order_items (order_id, sku, name, price, qty) VALUES ($1,$2,$3,$4,$5)', [id, l.sku, l.name, l.price, l.qty]);
    }
    return id;
  });

  res.status(201).json({
    order: {
      id: orderId,
      orderNum,
      subtotal,
      count: lines.reduce((a, l) => a + l.qty, 0),
      email,
      status: 'pending_payment',
      items: lines,
    },
    // ---- PAYMENT GATEWAY INTEGRATION POINT (Stripe) -------------------------
    // Next step: create a Stripe PaymentIntent for `subtotal` here and return
    // its client_secret. See server/PAYMENTS.md.
    payment: { provider: 'stripe', status: 'not_configured', amount: Math.round(subtotal * 100), currency: 'eur' },
  });
}));

// GET /api/orders/mine  -> the signed-in user's orders (newest first)
router.get('/mine', requireAuth, ah(async (req, res) => {
  const { rows: orders } = await query('SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC', [req.user.id]);
  const result = [];
  for (const o of orders) {
    const { rows: items } = await query('SELECT sku, name, price, qty FROM order_items WHERE order_id = $1', [o.id]);
    result.push({ id: o.id, orderNum: o.order_num, subtotal: o.subtotal, status: o.status, date: o.created_at, items });
  }
  res.json({ orders: result });
}));

export default router;
