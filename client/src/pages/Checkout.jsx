import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, FONT, eur, MIN_ORDER } from '../theme.js';
import { useCart } from '../context/CartContext.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { api } from '../api.js';
import { fetchCountries, fetchCities } from '../locations.js';
import { Field, TextInput, PrimaryButton, GhostButton, Alert } from '../components/ui.jsx';
import Combobox from '../components/Combobox.jsx';

const empty = { firstName: '', lastName: '', email: '', company: '', address: '', city: '', zip: '', country: 'Netherlands' };

export default function Checkout() {
  const nav = useNavigate();
  const { user, login } = useAuth();
  const { cart, clear } = useCart();
  const { bySku } = useProducts();
  const { push } = useToast();

  const [authMode, setAuthMode] = useState('guest'); // guest | signin (only when logged out)
  const [form, setForm] = useState({ ...empty, email: user?.email || '' });
  const [placed, setPlaced] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  // Location data.
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    fetchCountries().then(setCountries).catch(() => setCountries([])).finally(() => setLoadingCountries(false));
  }, []);

  // Reload cities whenever the country changes.
  useEffect(() => {
    if (!form.country) { setCities([]); return; }
    let alive = true;
    setLoadingCities(true);
    fetchCities(form.country)
      .then((c) => { if (alive) setCities(c); })
      .catch(() => { if (alive) setCities([]); })
      .finally(() => { if (alive) setLoadingCities(false); });
    return () => { alive = false; };
  }, [form.country]);

  // Keep email in sync if the user signs in mid-checkout.
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
      push({ title: 'ORDER CREATED', subtitle: `${d.order.orderNum} · ${eur(d.order.subtotal)}`, color: C.green });
      window.scrollTo(0, 0);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  // ---- Card payment step (Stripe drop-in point) ---------------------------
  if (placed) {
    return (
      <main style={{ flex: 1, maxWidth: 640, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '48px 40px 72px' }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 2, color: C.green, marginBottom: 10 }}>✓ ORDER {placed.orderNum} CREATED</div>
        <h1 style={{ margin: '0 0 8px', fontSize: 32, fontWeight: 700, letterSpacing: -1 }}>Payment</h1>
        <p style={{ margin: '0 0 28px', fontFamily: FONT.mono, fontSize: 12, color: C.muted, lineHeight: 1.7 }}>
          {placed.count} items · total <span style={{ color: C.text }}>{eur(placed.subtotal)}</span>. Complete the card
          payment below to confirm your order.
        </p>
        <div style={{ background: C.panel, border: `1px solid ${C.faint}`, borderRadius: 12, padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 10, letterSpacing: 3, color: C.dim }}>CARD DETAILS · VISA / MASTERCARD</div>
            <div style={{ fontFamily: FONT.mono, fontSize: 10, letterSpacing: 1, color: C.dim }}>🔒 SECURE</div>
          </div>
          <Field label="CARD NUMBER"><TextInput placeholder="4242 4242 4242 4242" disabled /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="EXPIRY"><TextInput placeholder="MM / YY" disabled /></Field>
            <Field label="CVC"><TextInput placeholder="123" disabled /></Field>
          </div>
          <Alert tone="warn">
            CARD PAYMENT ACTIVATES ONCE THE STRIPE GATEWAY IS CONNECTED. Your order {placed.orderNum} is saved
            as <b>pending payment</b> — see it under <a href="/account" style={{ color: C.amber, textDecoration: 'underline' }}>My account</a>.
          </Alert>
          <PrimaryButton disabled style={{ padding: 16, width: '100%' }}>PAY {eur(placed.subtotal)} →</PrimaryButton>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <GhostButton onClick={() => nav('/account')}>VIEW IN ACCOUNT</GhostButton>
          <GhostButton onClick={() => nav('/catalogue')}>KEEP BROWSING →</GhostButton>
        </div>
      </main>
    );
  }

  if (rows.length === 0) {
    return (
      <main style={{ flex: 1, maxWidth: 640, margin: '0 auto', padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 12, color: C.dim, marginBottom: 18 }}>YOUR CART IS EMPTY</div>
        <PrimaryButton onClick={() => nav('/catalogue')} style={{ padding: '13px 26px', fontSize: 11 }}>BROWSE CATALOGUE →</PrimaryButton>
      </main>
    );
  }

  const showForm = user || authMode === 'guest';

  return (
    <main style={{ flex: 1, maxWidth: 1100, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '48px 40px 72px' }}>
      <h1 style={{ margin: '0 0 24px', fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>Checkout</h1>

      {/* account bar */}
      <AccountBar user={user} authMode={authMode} setAuthMode={setAuthMode} />

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'start', marginTop: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!user && authMode === 'signin' ? (
            <InlineSignIn login={login} onDone={() => setAuthMode('guest')} onGuest={() => setAuthMode('guest')} />
          ) : (
            <>
              <div style={{ fontFamily: FONT.mono, fontSize: 10, letterSpacing: 3, color: C.dim }}>SHIPPING DETAILS</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="FIRST NAME *"><TextInput value={form.firstName} onChange={set('firstName')} /></Field>
                <Field label="LAST NAME"><TextInput value={form.lastName} onChange={set('lastName')} /></Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="EMAIL *"><TextInput type="email" value={form.email} onChange={set('email')} /></Field>
                <Field label="COMPANY"><TextInput value={form.company} onChange={set('company')} /></Field>
              </div>
              <Field label="ADDRESS *"><TextInput value={form.address} onChange={set('address')} placeholder="Street and number" /></Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="COUNTRY">
                  <Combobox value={form.country} onChange={setField('country')} options={countries} loading={loadingCountries} placeholder="Select country" allowCustom />
                </Field>
                <Field label="CITY">
                  <Combobox value={form.city} onChange={setField('city')} options={cities} loading={loadingCities}
                    disabled={!form.country} placeholder={form.country ? 'Select city' : 'Pick a country first'}
                    emptyText="No cities found" allowCustom />
                </Field>
              </div>
              <Field label="ZIP / POSTAL CODE"><TextInput value={form.zip} onChange={set('zip')} style={{ maxWidth: 200 }} /></Field>
              {error && <Alert tone="error">{error}</Alert>}
              <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.dim, letterSpacing: 1, marginTop: 4 }}>* REQUIRED · PAYMENT: VISA / MASTERCARD — COLLECTED ON THE NEXT STEP</div>
            </>
          )}
        </div>

        {/* summary */}
        <div style={{ background: C.panel2, border: `1px solid ${C.faint}`, borderRadius: 12, padding: 26, display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 88 }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 10, letterSpacing: 3, color: C.dim }}>ORDER SUMMARY</div>
          {rows.map(({ p, qty }) => (
            <div key={p.sku} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontFamily: FONT.mono, fontSize: 11.5, borderBottom: '1px solid rgba(255,255,255,.06)', paddingBottom: 10 }}>
              <span style={{ color: C.muted }}>{qty} × {p.sku}</span>
              <span style={{ color: C.text, whiteSpace: 'nowrap' }}>{eur(p.price * qty)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT.mono, fontSize: 11.5 }}>
            <span style={{ color: C.muted }}>SHIPPING</span><span style={{ color: C.dim }}>CALCULATED AFTER ORDER</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: FONT.mono }}>
            <span style={{ fontSize: 11, color: C.muted }}>TOTAL</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: C.text }}>{eur(subtotal)}</span>
          </div>
          <PrimaryButton disabled={!valid || busy || !showForm} onClick={placeOrder} style={{ padding: 16, width: '100%' }}>
            {busy ? 'PLACING…' : 'CONTINUE TO PAYMENT →'}
          </PrimaryButton>
          <div style={{ fontFamily: FONT.mono, fontSize: 10, letterSpacing: 1, color: C.dim, textAlign: 'center' }}>GUARANTEED SAFE CHECKOUT</div>
        </div>
      </div>
    </main>
  );
}

function AccountBar({ user, authMode, setAuthMode }) {
  const { logout } = useAuth();
  if (user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: C.panel, border: `1px solid ${C.faint}`, borderRadius: 10, padding: '12px 18px', fontFamily: FONT.mono, fontSize: 11 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.green, boxShadow: `0 0 8px ${C.green}` }} />
        <span style={{ color: C.muted }}>SIGNED IN AS <span style={{ color: C.text }}>{user.email}</span></span>
        <span style={{ flex: 1 }} />
        <button onClick={logout} style={{ background: 'none', border: 'none', color: C.dim, cursor: 'pointer', fontFamily: FONT.mono, fontSize: 10, letterSpacing: 1 }}>SIGN OUT</button>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <ModeTab active={authMode === 'guest'} onClick={() => setAuthMode('guest')} title="CONTINUE AS GUEST" sub="No account needed" />
      <ModeTab active={authMode === 'signin'} onClick={() => setAuthMode('signin')} title="SIGN IN" sub="Faster · saves your orders" />
    </div>
  );
}

function ModeTab({ active, onClick, title, sub }) {
  return (
    <button onClick={onClick}
      style={{ flex: 1, textAlign: 'left', background: active ? '#1a1f26' : C.panel, border: `1px solid ${active ? C.ember : C.faint}`, borderRadius: 10, padding: '14px 18px', cursor: 'pointer' }}>
      <div style={{ fontFamily: FONT.mono, fontSize: 12, letterSpacing: 1, color: active ? C.ember : C.text }}>{title}</div>
      <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.dim, marginTop: 4 }}>{sub}</div>
    </button>
  );
}

function InlineSignIn({ login, onDone, onGuest }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setErr(null); setBusy(true);
    try { await login(email, password); onDone(); }
    catch (e) { setErr(e.message); } finally { setBusy(false); }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontFamily: FONT.mono, fontSize: 10, letterSpacing: 3, color: C.dim }}>SIGN IN TO CONTINUE</div>
      <Field label="EMAIL"><TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" onKeyDown={(e) => e.key === 'Enter' && submit()} /></Field>
      <Field label="PASSWORD"><TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={(e) => e.key === 'Enter' && submit()} /></Field>
      {err && <Alert tone="error">{err}</Alert>}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <PrimaryButton disabled={busy} onClick={submit} style={{ padding: '13px 24px', fontSize: 11 }}>{busy ? '…' : 'SIGN IN →'}</PrimaryButton>
        <button onClick={onGuest} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1 }}>or continue as guest →</button>
      </div>
    </div>
  );
}
