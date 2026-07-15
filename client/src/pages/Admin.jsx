import { useEffect, useState } from 'react';
import { C, FONT, SERIES, eur } from '../theme.js';
import { api } from '../api.js';
import { useProducts } from '../context/ProductsContext.jsx';
import { Field, TextInput, PrimaryButton, GhostButton, Alert, Eyebrow } from '../components/ui.jsx';

export default function Admin() {
  const [tab, setTab] = useState('products');
  return (
    <main style={{ flex: 1, maxWidth: 1280, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '40px 40px 72px' }}>
      <Eyebrow>ADMIN</Eyebrow>
      <h1 style={{ margin: '0 0 24px', fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>Control panel</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        <Tab active={tab === 'products'} onClick={() => setTab('products')}>PRODUCTS</Tab>
        <Tab active={tab === 'orders'} onClick={() => setTab('orders')}>ORDERS</Tab>
      </div>
      {tab === 'products' ? <ProductsAdmin /> : <OrdersAdmin />}
    </main>
  );
}

function Tab({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      style={{ background: active ? '#1a1f26' : 'none', border: `1px solid ${active ? C.ember : C.faint}`, color: active ? C.text : C.muted, borderRadius: 6, padding: '10px 20px', fontFamily: FONT.mono, fontSize: 11, letterSpacing: 2, cursor: 'pointer' }}>
      {children}
    </button>
  );
}

/* ---------------- Products ---------------- */

function ProductsAdmin() {
  const { refresh: refreshCatalog } = useProducts();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => api.get('/admin/products').then((d) => setRows(d.products)).catch((e) => setError(e.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const afterChange = () => { load(); refreshCatalog(); };

  if (loading) return <div style={{ fontFamily: FONT.mono, color: C.dim }}>Loading products…</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {error && <Alert tone="error">{error}</Alert>}
      <AddProduct onAdded={afterChange} />
      <div style={{ fontFamily: FONT.mono, fontSize: 10, letterSpacing: 3, color: C.dim }}>{rows.length} PRODUCTS</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map((p) => <ProductRow key={p.id} product={p} onChange={afterChange} />)}
      </div>
    </div>
  );
}

function ProductRow({ product, onChange }) {
  const [price, setPrice] = useState(String(product.price));
  const [stock, setStock] = useState(String(product.stock));
  const [active, setActive] = useState(product.active);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const s = SERIES[product.series] || SERIES.s200;

  const dirty = String(product.price) !== price || String(product.stock) !== stock || product.active !== active;

  async function save() {
    setBusy(true); setMsg(null);
    try {
      await api.patch(`/admin/products/${product.id}`, { price: Number(price), stock: parseInt(stock, 10), active });
      setMsg('saved');
      onChange();
    } catch (e) { setMsg(e.message); } finally { setBusy(false); }
  }

  async function del() {
    if (!confirm(`Delete ${product.sku}? This cannot be undone.`)) return;
    setBusy(true);
    try { await api.del(`/admin/products/${product.id}`); onChange(); }
    catch (e) { setMsg(e.message); setBusy(false); }
  }

  async function upload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setMsg(null);
    try {
      const fd = new FormData();
      fd.append('image', file);
      await api.upload(`/admin/products/${product.id}/image`, fd);
      setMsg('photo updated'); onChange();
    } catch (err) { setMsg(err.message); } finally { setBusy(false); }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '44px 1.4fr 90px 80px 90px auto', gap: 14, alignItems: 'center', background: C.panel, border: `1px solid ${active ? C.faint : 'rgba(255,120,80,.25)'}`, borderRadius: 10, padding: '12px 16px' }}>
      <div style={{ width: 44, height: 44, borderRadius: 6, background: C.panel2, border: `1px solid ${C.faint}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {product.image
          ? <img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ width: 12, height: 12, borderRadius: '50%', background: s.c, boxShadow: `0 0 8px ${s.c}` }} />}
      </div>
      <div>
        <div style={{ fontFamily: FONT.mono, fontSize: 12.5, color: C.text }}>{product.sku}</div>
        <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.dim, marginTop: 3 }}>{product.d}×{product.D}×{product.W} mm · {s.temp}°C</div>
      </div>
      <MiniField label="PRICE €"><input value={price} onChange={(e) => setPrice(e.target.value)} style={miniInput} /></MiniField>
      <MiniField label="STOCK"><input value={stock} onChange={(e) => setStock(e.target.value)} style={miniInput} /></MiniField>
      <MiniField label="VISIBLE">
        <button onClick={() => setActive((a) => !a)} style={{ ...miniInput, cursor: 'pointer', color: active ? C.green : C.dim, textAlign: 'center' }}>
          {active ? 'YES' : 'HIDDEN'}
        </button>
      </MiniField>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        {msg && <span style={{ fontFamily: FONT.mono, fontSize: 10, color: msg === 'saved' || msg === 'photo updated' ? C.green : '#ff7a6b' }}>{msg}</span>}
        <label style={{ ...smallBtn, cursor: 'pointer' }}>
          PHOTO
          <input type="file" accept="image/*" onChange={upload} style={{ display: 'none' }} />
        </label>
        <button onClick={save} disabled={busy || !dirty} style={{ ...smallBtn, borderColor: dirty ? C.ember : C.faint, color: dirty ? C.ember : C.dim, cursor: dirty ? 'pointer' : 'default' }}>SAVE</button>
        <button onClick={del} disabled={busy} style={{ ...smallBtn, borderColor: 'rgba(255,120,80,.4)', color: '#ff7a6b' }}>DEL</button>
      </div>
    </div>
  );
}

function AddProduct({ onAdded }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ model: '', series: 's200', price: '', stock: '0', d: '', D: '', W: '', weight_g: '', rpm: '', c0: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  async function create() {
    setError(null); setBusy(true);
    try {
      const s = SERIES[f.series];
      const sku = `${f.model.trim()} ${s.label}`.trim();
      await api.post('/admin/products', { ...f, sku, price: Number(f.price), stock: parseInt(f.stock, 10) });
      setF({ model: '', series: 's200', price: '', stock: '0', d: '', D: '', W: '', weight_g: '', rpm: '', c0: '' });
      setOpen(false);
      onAdded();
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }

  if (!open) {
    return <div><PrimaryButton onClick={() => setOpen(true)} style={{ padding: '12px 22px', fontSize: 11 }}>+ ADD PRODUCT</PrimaryButton></div>;
  }

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.faint}`, borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontFamily: FONT.mono, fontSize: 10, letterSpacing: 3, color: C.dim }}>NEW PRODUCT</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <Field label="MODEL *"><TextInput value={f.model} onChange={set('model')} placeholder="6204" /></Field>
        <Field label="TEMP CLASS *">
          <select value={f.series} onChange={set('series')} style={{ width: '100%', boxSizing: 'border-box', background: C.panel, border: `1px solid ${C.faint2}`, borderRadius: 8, padding: '12px 14px', color: C.text, fontFamily: FONT.mono, fontSize: 12 }}>
            {Object.values(SERIES).map((s) => <option key={s.key} value={s.key}>{s.temp}°C — {s.label}</option>)}
          </select>
        </Field>
        <Field label="PRICE € *"><TextInput value={f.price} onChange={set('price')} placeholder="4.50" /></Field>
        <Field label="STOCK *"><TextInput value={f.stock} onChange={set('stock')} placeholder="0" /></Field>
        <Field label="BORE d (mm)"><TextInput value={f.d} onChange={set('d')} placeholder="20" /></Field>
        <Field label="OUTER D (mm)"><TextInput value={f.D} onChange={set('D')} placeholder="47" /></Field>
        <Field label="WIDTH W (mm)"><TextInput value={f.W} onChange={set('W')} placeholder="14" /></Field>
        <Field label="WEIGHT (g)"><TextInput value={f.weight_g} onChange={set('weight_g')} placeholder="106" /></Field>
        <Field label="LIMIT RPM"><TextInput value={f.rpm} onChange={set('rpm')} placeholder="4500" /></Field>
        <Field label="STATIC LOAD c0 (kN)"><TextInput value={f.c0} onChange={set('c0')} placeholder="6.55" /></Field>
      </div>
      <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.dim }}>SKU will be: <span style={{ color: C.text }}>{`${f.model || '—'} ${SERIES[f.series].label}`}</span></div>
      {error && <Alert tone="error">{error}</Alert>}
      <div style={{ display: 'flex', gap: 10 }}>
        <PrimaryButton onClick={create} disabled={busy} style={{ padding: '13px 24px', fontSize: 11 }}>{busy ? 'CREATING…' : 'CREATE PRODUCT'}</PrimaryButton>
        <GhostButton onClick={() => setOpen(false)}>CANCEL</GhostButton>
      </div>
    </div>
  );
}

/* ---------------- Orders ---------------- */

function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/admin/orders').then((d) => setOrders(d.orders)).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ fontFamily: FONT.mono, color: C.dim }}>Loading orders…</div>;
  if (error) return <Alert tone="error">{error}</Alert>;
  if (orders.length === 0) return <div style={{ fontFamily: FONT.mono, fontSize: 12, color: C.dim, border: `1px dashed ${C.faint3}`, borderRadius: 10, padding: 48, textAlign: 'center' }}>NO ORDERS YET</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {orders.map((o) => (
        <div key={o.id} style={{ background: C.panel, border: `1px solid ${C.faint}`, borderRadius: 10, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 13, color: C.text }}>{o.orderNum}</div>
            <div style={{ fontFamily: FONT.mono, fontSize: 11, color: statusColor(o.status) }}>{o.status.replace('_', ' ').toUpperCase()}</div>
          </div>
          <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.dim, marginTop: 6 }}>
            {o.name || '—'} · {o.email}{o.company ? ` · ${o.company}` : ''}{o.address ? ` · ${o.address}` : ''}
          </div>
          <div style={{ marginTop: 12, borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {o.items.map((it, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT.mono, fontSize: 11.5 }}>
                <span style={{ color: C.muted }}>{it.qty} × {it.sku}</span>
                <span style={{ color: C.text }}>{eur(it.price * it.qty)}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontFamily: FONT.mono }}>
            <span style={{ fontSize: 10, color: C.dim, letterSpacing: 1 }}>{fmtDate(o.date)}</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{eur(o.subtotal)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- helpers ---------------- */

const miniInput = { width: '100%', boxSizing: 'border-box', background: C.panel2, border: `1px solid ${C.faint2}`, borderRadius: 6, padding: '8px 10px', color: C.text, fontFamily: FONT.mono, fontSize: 12 };
const smallBtn = { background: 'none', border: `1px solid ${C.faint2}`, color: C.muted, borderRadius: 6, padding: '7px 12px', fontFamily: FONT.mono, fontSize: 10, letterSpacing: 1 };

function MiniField({ label, children }) {
  return (
    <div>
      <div style={{ fontFamily: FONT.mono, fontSize: 9, letterSpacing: 1, color: C.dim, marginBottom: 5 }}>{label}</div>
      {children}
    </div>
  );
}

function statusColor(s) { return s === 'paid' ? '#7ddb8a' : s === 'pending_payment' ? '#ffb24d' : '#8a8f96'; }
function fmtDate(s) {
  const d = new Date(s);
  if (isNaN(d)) return s;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
}
