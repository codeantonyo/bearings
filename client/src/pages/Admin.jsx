import { useEffect, useState } from 'react';
import { C, SERIES, eur } from '../theme.js';
import { api } from '../api.js';
import { useProducts } from '../context/ProductsContext.jsx';
import { Field, TextInput, PrimaryButton, SecondaryButton, Alert, Eyebrow } from '../components/ui.jsx';

export default function Admin() {
  const [tab, setTab] = useState('products');
  return (
    <main className="page-pad" style={{ flex: 1, maxWidth: 1240, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '28px 24px 56px' }}>
      <Eyebrow>Administration</Eyebrow>
      <h1 style={{ margin: '0 0 20px', fontSize: 28, fontWeight: 700, color: C.ink }}>Control panel</h1>
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, borderBottom: `1px solid ${C.border}` }}>
        <Tab active={tab === 'products'} onClick={() => setTab('products')}>Products</Tab>
        <Tab active={tab === 'orders'} onClick={() => setTab('orders')}>Orders</Tab>
      </div>
      {tab === 'products' ? <ProductsAdmin /> : <OrdersAdmin />}
    </main>
  );
}

function Tab({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      style={{ background: 'none', border: 'none', borderBottom: `2px solid ${active ? C.brand : 'transparent'}`, color: active ? C.brand : C.textSoft, padding: '10px 16px', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: -1 }}>
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

  if (loading) return <div style={{ color: C.textMute }}>Loading products…</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {error && <Alert tone="danger">{error}</Alert>}
      <AddProduct onAdded={afterChange} />
      <div style={{ fontSize: 13.5, color: C.textMute }}>{rows.length} products</div>
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', boxShadow: C.shadow }}>
        {rows.map((p, i) => <ProductRow key={p.id} product={p} onChange={afterChange} last={i === rows.length - 1} />)}
      </div>
    </div>
  );
}

function ProductRow({ product, onChange, last }) {
  const [price, setPrice] = useState(String(product.price));
  const [stock, setStock] = useState(String(product.stock));
  const [active, setActive] = useState(product.active);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const s = SERIES[product.series] || SERIES.s200;
  const dirty = String(product.price) !== price || String(product.stock) !== stock || product.active !== active;

  async function save() {
    setBusy(true); setMsg(null);
    try { await api.patch(`/admin/products/${product.id}`, { price: Number(price), stock: parseInt(stock, 10), active }); setMsg('Saved'); onChange(); }
    catch (e) { setMsg(e.message); } finally { setBusy(false); }
  }
  async function del() {
    if (!confirm(`Delete ${product.sku}? This cannot be undone.`)) return;
    setBusy(true);
    try { await api.del(`/admin/products/${product.id}`); onChange(); } catch (e) { setMsg(e.message); setBusy(false); }
  }
  async function upload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setMsg(null);
    try { const fd = new FormData(); fd.append('image', file); await api.upload(`/admin/products/${product.id}/image`, fd); setMsg('Photo updated'); onChange(); }
    catch (err) { setMsg(err.message); } finally { setBusy(false); }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '48px 1.5fr 110px 90px 96px auto', gap: 14, alignItems: 'center', padding: '12px 16px', borderBottom: last ? 'none' : `1px solid ${C.border}`, background: active ? '#fff' : C.bgAlt }}>
      <div style={{ width: 48, height: 48, borderRadius: 8, background: C.imageBg, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {product.image ? <img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ width: 12, height: 12, borderRadius: '50%', background: s.c }} />}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{product.sku}</div>
        <div style={{ fontSize: 12.5, color: C.textMute, marginTop: 2 }}>Ø {product.d}×{product.D}×{product.W} mm · {s.temp} °C</div>
      </div>
      <MiniField label="Price €"><input value={price} onChange={(e) => setPrice(e.target.value)} style={miniInput} /></MiniField>
      <MiniField label="Stock"><input value={stock} onChange={(e) => setStock(e.target.value)} style={miniInput} /></MiniField>
      <MiniField label="Visible">
        <button onClick={() => setActive((a) => !a)} style={{ ...miniInput, cursor: 'pointer', color: active ? C.success : C.textMute, fontWeight: 600, textAlign: 'center' }}>{active ? 'Yes' : 'Hidden'}</button>
      </MiniField>
      <div style={{ display: 'flex', gap: 7, alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        {msg && <span style={{ fontSize: 12, color: msg === 'Saved' || msg === 'Photo updated' ? C.success : C.danger }}>{msg}</span>}
        <label style={{ ...smallBtn, cursor: 'pointer' }}>Photo<input type="file" accept="image/*" onChange={upload} style={{ display: 'none' }} /></label>
        <button onClick={save} disabled={busy || !dirty} style={{ ...smallBtn, borderColor: dirty ? C.brand : C.border, color: dirty ? C.brand : C.textMute, cursor: dirty ? 'pointer' : 'default', fontWeight: 600 }}>Save</button>
        <button onClick={del} disabled={busy} style={{ ...smallBtn, borderColor: '#f0c9c1', color: C.danger }}>Delete</button>
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
      setOpen(false); onAdded();
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }

  if (!open) return <div><PrimaryButton onClick={() => setOpen(true)}>+ Add product</PrimaryButton></div>;

  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: C.shadow }}>
      <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.text }}>New product</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <Field label="Model *"><TextInput value={f.model} onChange={set('model')} placeholder="6204" /></Field>
        <Field label="Temperature class *">
          <select value={f.series} onChange={set('series')} style={{ width: '100%', boxSizing: 'border-box', background: '#fff', border: `1px solid ${C.borderStrong}`, borderRadius: 8, padding: '11px 12px', fontSize: 15 }}>
            {Object.values(SERIES).map((s) => <option key={s.key} value={s.key}>{s.temp} °C — {s.label}</option>)}
          </select>
        </Field>
        <Field label="Price € *"><TextInput value={f.price} onChange={set('price')} placeholder="4.50" /></Field>
        <Field label="Stock *"><TextInput value={f.stock} onChange={set('stock')} placeholder="0" /></Field>
        <Field label="Bore d (mm)"><TextInput value={f.d} onChange={set('d')} placeholder="20" /></Field>
        <Field label="Outer D (mm)"><TextInput value={f.D} onChange={set('D')} placeholder="47" /></Field>
        <Field label="Width W (mm)"><TextInput value={f.W} onChange={set('W')} placeholder="14" /></Field>
        <Field label="Weight (g)"><TextInput value={f.weight_g} onChange={set('weight_g')} placeholder="106" /></Field>
        <Field label="Limiting rpm"><TextInput value={f.rpm} onChange={set('rpm')} placeholder="4500" /></Field>
        <Field label="Static load c0 (kN)"><TextInput value={f.c0} onChange={set('c0')} placeholder="6.55" /></Field>
      </div>
      <div style={{ fontSize: 13, color: C.textMute }}>Part number will be: <b style={{ color: C.text }}>{`${f.model || '—'} ${SERIES[f.series].label}`}</b></div>
      {error && <Alert tone="danger">{error}</Alert>}
      <div style={{ display: 'flex', gap: 10 }}>
        <PrimaryButton onClick={create} disabled={busy}>{busy ? 'Creating…' : 'Create product'}</PrimaryButton>
        <SecondaryButton onClick={() => setOpen(false)}>Cancel</SecondaryButton>
      </div>
    </div>
  );
}

/* ---------------- Orders ---------------- */

function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => { api.get('/admin/orders').then((d) => setOrders(d.orders)).catch((e) => setError(e.message)).finally(() => setLoading(false)); }, []);

  if (loading) return <div style={{ color: C.textMute }}>Loading orders…</div>;
  if (error) return <Alert tone="danger">{error}</Alert>;
  if (orders.length === 0) return <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10, padding: 44, textAlign: 'center', color: C.textMute }}>No orders yet.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {orders.map((o) => (
        <div key={o.id} style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, boxShadow: C.shadow }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{o.orderNum}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: statusColor(o.status) }}>{statusLabel(o.status)}</div>
          </div>
          <div style={{ fontSize: 13.5, color: C.textMute, marginTop: 6 }}>{o.name || '—'} · {o.email}{o.company ? ` · ${o.company}` : ''}{o.address ? ` · ${o.address}` : ''}</div>
          <div style={{ marginTop: 12, borderTop: `1px solid ${C.border}`, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {o.items.map((it, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: C.textSoft }}>{it.qty} × {it.sku}</span>
                <span style={{ color: C.text, fontWeight: 500 }}>{eur(it.price * it.qty)}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <span style={{ fontSize: 13, color: C.textMute }}>{fmtDate(o.date)}</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{eur(o.subtotal)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

const miniInput = { width: '100%', boxSizing: 'border-box', background: '#fff', border: `1px solid ${C.borderStrong}`, borderRadius: 7, padding: '8px 10px', color: C.text, fontSize: 14 };
const smallBtn = { background: '#fff', border: `1px solid ${C.borderStrong}`, color: C.textSoft, borderRadius: 7, padding: '7px 12px', fontSize: 13, cursor: 'pointer' };

function MiniField({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: C.textMute, marginBottom: 5 }}>{label}</div>
      {children}
    </div>
  );
}

function statusColor(s) { return s === 'paid' ? C.success : s === 'pending_payment' ? C.warn : C.textMute; }
function statusLabel(s) { return s === 'pending_payment' ? 'Pending payment' : s.charAt(0).toUpperCase() + s.slice(1); }
function fmtDate(s) { const d = new Date(s); return isNaN(d) ? s : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
