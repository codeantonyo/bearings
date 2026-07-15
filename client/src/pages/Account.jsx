import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { C, FONT, eur } from '../theme.js';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api.js';
import { Field, TextInput, PrimaryButton, GhostButton, Alert } from '../components/ui.jsx';

export default function Account() {
  const { user, ready, login, signup, logout, isAdmin } = useAuth();
  if (!ready) return <main style={{ flex: 1, padding: 80, textAlign: 'center', fontFamily: FONT.mono, color: C.dim }}>…</main>;
  return (
    <main style={{ flex: 1, maxWidth: 1100, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '48px 40px 72px' }}>
      {user ? <LoggedIn user={user} logout={logout} isAdmin={isAdmin} /> : <AuthForm login={login} signup={signup} />}
    </main>
  );
}

function AuthForm({ login, signup }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError(null);
    setBusy(true);
    try {
      if (mode === 'login') await login(email, password);
      else await signup(email, password, name);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '24px auto 0', background: C.panel, border: `1px solid ${C.faint}`, borderRadius: 12, padding: 36, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>{mode === 'login' ? 'Sign in' : 'Create account'}</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
        <Tab active={mode === 'login'} onClick={() => { setMode('login'); setError(null); }}>SIGN IN</Tab>
        <Tab active={mode === 'signup'} onClick={() => { setMode('signup'); setError(null); }}>SIGN UP</Tab>
      </div>

      {mode === 'signup' && (
        <Field label="NAME"><TextInput dark value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Engineer" /></Field>
      )}
      <Field label="EMAIL">
        <TextInput dark type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com"
          onKeyDown={(e) => e.key === 'Enter' && submit()} />
      </Field>
      <Field label="PASSWORD">
        <TextInput dark type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
          onKeyDown={(e) => e.key === 'Enter' && submit()} />
      </Field>

      {error && <Alert tone="error">{error}</Alert>}

      <PrimaryButton disabled={busy} onClick={submit} style={{ padding: 15, width: '100%' }}>
        {busy ? '…' : mode === 'login' ? 'SIGN IN →' : 'CREATE ACCOUNT →'}
      </PrimaryButton>
      <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.dim, textAlign: 'center', letterSpacing: 1 }}>
        {mode === 'login' ? 'NEW HERE? SWITCH TO SIGN UP.' : 'PASSWORD MUST BE AT LEAST 6 CHARACTERS.'}
      </div>
    </div>
  );
}

function Tab({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      style={{ flex: 1, background: active ? '#1a1f26' : 'none', border: `1px solid ${active ? C.ember : C.faint}`, color: active ? C.text : C.muted, borderRadius: 6, padding: '9px 0', fontFamily: FONT.mono, fontSize: 10, letterSpacing: 2, cursor: 'pointer' }}>
      {children}
    </button>
  );
}

function LoggedIn({ user, logout, isAdmin }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/mine').then((d) => setOrders(d.orders)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28, gap: 16, flexWrap: 'wrap' }}>
        <h1 style={{ margin: 0, fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>My account</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          {isAdmin && <Link to="/admin"><GhostButton style={{ borderColor: C.ember, color: C.ember }}>ADMIN PANEL</GhostButton></Link>}
          <GhostButton onClick={logout}>SIGN OUT</GhostButton>
        </div>
      </div>

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
        <div style={{ background: C.panel, border: `1px solid ${C.faint}`, borderRadius: 12, padding: 26 }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 10, letterSpacing: 3, color: C.dim, marginBottom: 16 }}>ORDERS</div>
          {loading ? (
            <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.dim }}>Loading…</div>
          ) : orders.length === 0 ? (
            <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.dim, border: `1px dashed ${C.faint3}`, borderRadius: 8, padding: 26, textAlign: 'center' }}>NO ORDERS YET</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {orders.map((o) => (
                <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1px solid ${C.faint}`, borderRadius: 8, padding: '16px 18px', fontFamily: FONT.mono, fontSize: 12 }}>
                  <div>
                    <div style={{ color: C.text }}>{o.orderNum}</div>
                    <div style={{ color: C.dim, fontSize: 10, marginTop: 4 }}>{fmtDate(o.date)} · {o.items.reduce((a, i) => a + i.qty, 0)} ITEMS</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: C.text, fontWeight: 500 }}>{eur(o.subtotal)}</div>
                    <div style={{ color: statusColor(o.status), fontSize: 10, letterSpacing: 1, marginTop: 4 }}>{o.status.replace('_', ' ').toUpperCase()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: C.panel, border: `1px solid ${C.faint}`, borderRadius: 12, padding: 26, fontFamily: FONT.mono, fontSize: 12, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: C.dim, marginBottom: 2 }}>ACCOUNT DETAILS</div>
          <Row k="NAME" v={user.name || '—'} />
          <Row k="EMAIL" v={user.email} />
          <Row k="ROLE" v={user.role.toUpperCase()} last />
        </div>
      </div>
    </>
  );
}

function Row({ k, v, last }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: last ? 'none' : '1px solid rgba(255,255,255,.06)', paddingBottom: last ? 0 : 12 }}>
      <span style={{ color: C.dim }}>{k}</span><span style={{ color: C.text }}>{v}</span>
    </div>
  );
}

function statusColor(s) { return s === 'paid' ? '#7ddb8a' : s === 'pending_payment' ? '#ffb24d' : '#8a8f96'; }
function fmtDate(s) {
  const d = new Date((s || '').replace(' ', 'T') + 'Z');
  if (isNaN(d)) return s;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
}
