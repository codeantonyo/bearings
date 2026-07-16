import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { C, eur, MIN_ORDER } from '../theme.js';
import { useCart } from '../context/CartContext.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { api } from '../api.js';
import { fetchCountries, fetchCities } from '../locations.js';
import { Field, TextInput, PrimaryButton, SecondaryButton, Alert } from '../components/ui.jsx';
import Combobox from '../components/Combobox.jsx';

const empty = { firstName: '', lastName: '', email: '', company: '', address: '', city: '', zip: '', country: 'Netherlands' };

export default function Checkout() {
  const nav = useNavigate();
  const { user, login } = useAuth();
  const { cart, clear } = useCart();
  const { bySku } = useProducts();
  const { push } = useToast();

  const [authMode, setAuthMode] = useState('guest');
  const [form, setForm] = useState({ ...empty, email: user?.email || '' });
  const [placed, setPlaced] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => { fetchCountries().then(setCountries).catch(() => setCountries([])).finally(() => setLoadingCountries(false)); }, []);
  useEffect(() => {
    if (!form.country) { setCities([]); return; }
    let alive = true; setLoadingCities(true);
    fetchCities(form.country).then((c) => alive && setCities(c)).catch(() => alive && setCities([])).finally(() => alive && setLoadingCities(false));
    return () => { alive = false; };
  }, [form.country]);
  useEffect(() => { if (user?.email) setForm((f) => ({ ...f, email: f.email || user.email })); }, [user]);

  const rows = useMemo(() => Object.entries(cart).map(([sku, qty]) => ({ p: bySku[sku], qty })).filter((r) => r.p), [cart, bySku]);
  const subtotal = rows.reduce((a, r) => a + r.p.price * r.qty, 0);
  const valid = form.firstName.trim() && form.email.trim() && form.address.trim() && rows.length > 0 && subtotal >= MIN_ORDER;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setField = (k) => (v) => setForm((f) => ({ ...f, [k]: v, ...(k === 'country' ? { city: '' } : {}) }));

  async function placeOrder() {
    if (!valid || busy) return;
    setBusy(true); setError(null);
    try {
      const items = rows.map((r) => ({ sku: r.p.sku, qty: r.qty }));
      const d = await api.post('/orders', { ...form, items });
      setPlaced(d.order);
      clear();
      push({ title: 'Order created', subtitle: `${d.order.orderNum} · ${eur(d.order.subtotal)}` });
      window.scrollTo(0, 0);
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }

  // ----- Payment step (Stripe drop-in point) -----
  if (placed) {
    return (
      <main className="page-pad" style={{ flex: 1, maxWidth: 620, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '32px 24px 56px' }}>
        <div style={{ background: C.successTint, border: `1px solid #bfe4d3`, color: C.success, borderRadius: 10, padding: '12px 16px', fontSize: 14.5, fontWeight: 600, marginBottom: 20 }}>
          ✓ Order {placed.orderNum} created
        </div>
        <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 700, color: C.ink }}>Payment</h1>
        <p style={{ margin: '0 0 22px', fontSize: 15, color: C.textSoft }}>{placed.count} items · total <b style={{ color: C.text }}>{eur(placed.subtotal)}</b>. Complete the card payment below to confirm your order.</p>

        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 26, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: C.shadow }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Card details</span>
            <span style={{ fontSize: 13, color: C.textMute }}>🔒 Secure · Visa / Mastercard</span>
          </div>
          <Field label="Card number"><TextInput placeholder="4242 4242 4242 4242" disabled /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Expiry"><TextInput placeholder="MM / YY" disabled /></Field>
            <Field label="CVC"><TextInput placeholder="123" disabled /></Field>
          </div>
          <Alert tone="info">Card payment is activated once the Stripe gateway is connected. Your order {placed.orderNum} is saved as <b>pending payment</b> — view it under <Link to="/account">My account</Link>.</Alert>
          <PrimaryButton disabled style={{ width: '100%', padding: 14 }}>Pay {eur(placed.subtotal)}</PrimaryButton>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
          <SecondaryButton onClick={() => nav('/account')}>View in account</SecondaryButton>
          <SecondaryButton onClick={() => nav('/catalogue')}>Keep browsing</SecondaryButton>
        </div>
      </main>
    );
  }

  if (rows.length === 0) {
    return (
      <main style={{ flex: 1, maxWidth: 620, margin: '0 auto', padding: '72px 24px', textAlign: 'center' }}>
        <p style={{ color: C.textSoft, marginBottom: 16 }}>Your cart is empty.</p>
        <PrimaryButton onClick={() => nav('/catalogue')}>Browse the catalogue</PrimaryButton>
      </main>
    );
  }

  const showForm = user || authMode === 'guest';

  return (
    <main className="page-pad" style={{ flex: 1, maxWidth: 1100, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '28px 24px 56px' }}>
      <h1 style={{ margin: '0 0 20px', fontSize: 28, fontWeight: 700, color: C.ink }}>Checkout</h1>

      <AccountBar user={user} authMode={authMode} setAuthMode={setAuthMode} />

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32, alignItems: 'start', marginTop: 22 }}>
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 26, boxShadow: C.shadow }}>
          {!user && authMode === 'signin' ? (
            <InlineSignIn login={login} onGuest={() => setAuthMode('guest')} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.text }}>Shipping details</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="First name *"><TextInput value={form.firstName} onChange={set('firstName')} /></Field>
                <Field label="Last name"><TextInput value={form.lastName} onChange={set('lastName')} /></Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Email *"><TextInput type="email" value={form.email} onChange={set('email')} /></Field>
                <Field label="Company"><TextInput value={form.company} onChange={set('company')} /></Field>
              </div>
              <Field label="Address *"><TextInput value={form.address} onChange={set('address')} placeholder="Street and number" /></Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Country"><Combobox value={form.country} onChange={setField('country')} options={countries} loading={loadingCountries} placeholder="Select country" allowCustom /></Field>
                <Field label="City"><Combobox value={form.city} onChange={setField('city')} options={cities} loading={loadingCities} disabled={!form.country} placeholder={form.country ? 'Select city' : 'Pick a country first'} emptyText="No cities found" allowCustom /></Field>
              </div>
              <div style={{ maxWidth: 220 }}><Field label="ZIP / Postal code"><TextInput value={form.zip} onChange={set('zip')} /></Field></div>
              {error && <Alert tone="danger">{error}</Alert>}
              <div style={{ fontSize: 12.5, color: C.textMute }}>* Required. Payment (Visa / Mastercard) is collected on the next step.</div>
            </div>
          )}
        </div>

        {/* summary */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 22, position: 'sticky', top: 84, boxShadow: C.shadow }}>
          <h2 style={{ margin: '0 0 14px', fontSize: 17, fontWeight: 700, color: C.text }}>Order summary</h2>
          {rows.map(({ p, qty }) => (
            <div key={p.sku} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 14, borderBottom: `1px solid ${C.border}`, padding: '9px 0' }}>
              <span style={{ color: C.textSoft }}>{qty} × {p.sku}</span>
              <span style={{ color: C.text, fontWeight: 600, whiteSpace: 'nowrap' }}>{eur(p.price * qty)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: C.textMute, padding: '10px 0' }}>
            <span>Shipping</span><span>Calculated after order</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 6, marginBottom: 14 }}>
            <span style={{ fontSize: 14, color: C.textSoft }}>Total</span>
            <span style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{eur(subtotal)}</span>
          </div>
          <PrimaryButton disabled={!valid || busy || !showForm} onClick={placeOrder} style={{ width: '100%', padding: 14 }}>
            {busy ? 'Placing…' : 'Continue to payment'}
          </PrimaryButton>
          <div style={{ textAlign: 'center', fontSize: 12.5, color: C.textMute, marginTop: 12 }}>Secure checkout</div>
        </div>
      </div>
    </main>
  );
}

function AccountBar({ user, authMode, setAuthMode }) {
  const { logout } = useAuth();
  if (user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: C.successTint, border: `1px solid #bfe4d3`, borderRadius: 10, padding: '12px 16px', fontSize: 14 }}>
        <span style={{ color: C.success, fontWeight: 600 }}>Signed in as {user.email}</span>
        <span style={{ flex: 1 }} />
        <button onClick={logout} style={{ background: 'none', border: 'none', color: C.textSoft, cursor: 'pointer', fontSize: 13.5 }}>Sign out</button>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <ModeTab active={authMode === 'guest'} onClick={() => setAuthMode('guest')} title="Continue as guest" sub="No account needed" />
      <ModeTab active={authMode === 'signin'} onClick={() => setAuthMode('signin')} title="Sign in" sub="Faster · saves your orders" />
    </div>
  );
}

function ModeTab({ active, onClick, title, sub }) {
  return (
    <button onClick={onClick} className="link-hover"
      style={{ flex: 1, textAlign: 'left', background: active ? C.brandTint : '#fff', border: `1px solid ${active ? C.brand : C.border}`, borderRadius: 10, padding: '14px 18px', cursor: 'pointer' }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: active ? C.brand : C.text }}>{title}</div>
      <div style={{ fontSize: 13, color: C.textMute, marginTop: 3 }}>{sub}</div>
    </button>
  );
}

function InlineSignIn({ login, onGuest }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setErr(null); setBusy(true);
    try { await login(email, password); } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.text }}>Sign in to continue</h2>
      <Field label="Email"><TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" onKeyDown={(e) => e.key === 'Enter' && submit()} /></Field>
      <Field label="Password"><TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={(e) => e.key === 'Enter' && submit()} /></Field>
      {err && <Alert tone="danger">{err}</Alert>}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <PrimaryButton disabled={busy} onClick={submit}>{busy ? '…' : 'Sign in'}</PrimaryButton>
        <button onClick={onGuest} style={{ background: 'none', border: 'none', color: C.textSoft, cursor: 'pointer', fontSize: 14 }}>or continue as guest →</button>
      </div>
    </div>
  );
}
