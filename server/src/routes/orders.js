import { Router } from 'express';
import { db, transaction } from '../db.js';
import { requireAuth } from '../auth.js';

const router = Router();

const MIN_ORDER = 20; // EUR, per Beco policy

function genOrderNum() {
  return 'NL-' + (10000 + Math.floor(Math.random() * 89999));
}

// POST /api/orders
// Creates an order in `pending_payment` state. This is the last step BEFORE
// the card payment gateway. Prices and stock are validated server-side; the
// client-supplied prices are ignored on purpose.
router.post('/', (req, res) => {
  const b = req.body || {};
  const items = Array.isArray(b.items) ? b.items : [];
  if (items.length === 0) return res.status(400).json({ error: 'Your cart is empty.' });

  const first = String(b.firstName || '').trim();
  const email = String(b.email || '').trim();
  const address = String(b.address || '').trim();
  if (!first || !email || !address) {
    return res.status(400).json({ error: 'First name, email and address are required.' });
  }

  // Resolve each line against the live catalog.
  const lines = [];
  for (const it of items) {
    const qty = Math.max(1, parseInt(it.qty, 10) || 0);
    const row = db.prepare('SELECT * FROM products WHERE sku = ? AND active = 1').get(it.sku);
    if (!row) return res.status(400).json({ error: `Product no longer available: ${it.sku}` });
    if (row.stock < qty) {
      return res.status(409).json({ error: `Only ${row.stock} of ${row.sku} left in stock.` });
    }
    lines.push({ sku: row.sku, name: row.sku, price: row.price, qty });
  }

  const subtotal = lines.reduce((a, l) => a + l.price * l.qty, 0);
  if (subtotal < MIN_ORDER) {
    return res.status(400).json({ error: `Minimum order is ${MIN_ORDER} €.` });
  }

  const orderNum = genOrderNum();
  const orderId = Number(transaction(() => {
    const info = db.prepare(`
      INSERT INTO orders (order_num, user_id, email, first_name, last_name, company, address, city, zip, country, subtotal, status)
      VALUES (@order_num, @user_id, @email, @first_name, @last_name, @company, @address, @city, @zip, @country, @subtotal, 'pending_payment')
    `).run({
      order_num: orderNum,
      user_id: req.user ? req.user.id : null,
      email,
      first_name: first,
      last_name: String(b.lastName || '').trim(),
      company: String(b.company || '').trim(),
      address,
      city: String(b.city || '').trim(),
      zip: String(b.zip || '').trim(),
      country: String(b.country || '').trim(),
      subtotal,
    });
    const newId = info.lastInsertRowid;
    const itemStmt = db.prepare('INSERT INTO order_items (order_id, sku, name, price, qty) VALUES (?, ?, ?, ?, ?)');
    for (const l of lines) itemStmt.run(newId, l.sku, l.name, l.price, l.qty);
    return newId;
  }));

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
    // Next step (out of current scope): create a Stripe PaymentIntent for
    // `subtotal` here and return its client_secret. The client would then
    // mount Stripe Elements and confirm the card payment, after which a
    // webhook (or /orders/:num/confirm) flips status to 'paid' and decrements
    // stock. See server/PAYMENTS.md.
    payment: {
      provider: 'stripe',
      status: 'not_configured',
      amount: Math.round(subtotal * 100), // cents, ready for Stripe
      currency: 'eur',
    },
  });
});

// GET /api/orders/mine  -> the signed-in user's orders (newest first)
router.get('/mine', requireAuth, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC').all(req.user.id);
  const itemStmt = db.prepare('SELECT sku, name, price, qty FROM order_items WHERE order_id = ?');
  res.json({
    orders: orders.map((o) => ({
      id: o.id,
      orderNum: o.order_num,
      subtotal: o.subtotal,
      status: o.status,
      date: o.created_at,
      items: itemStmt.all(o.id),
    })),
  });
});

export default router;
