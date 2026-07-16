import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { C, eur } from '../theme.js';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api.js';
import { Field, TextInput, PrimaryButton, SecondaryButton, Alert } from '../components/ui.jsx';

export default function Account() {
  const { user, ready, login, signup, logout, isAdmin } = useAuth();
  if (!ready) return <main style={{ flex: 1, padding: 72, textAlign: 'center', color: C.textMute }}>Loading…</main>;
  return (
    <main className="page-pad" style={{ flex: 1, maxWidth: 1100, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '28px 24px 56px' }}>
      {user ? <LoggedIn user={user} logout={logout} isAdmin={isAdmin} /> : <AuthForm login={login} signup={signup} />}
    </main>
  );
}

function AuthForm({ login, signup }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError(null); setBusy(true);
    try {
      if (mode === 'login') await login(email, password);
      else await signup(email, password, name);
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }

  return (
    <div style={{ maxWidth: 440, margin: '16px auto 0', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 32, boxShadow: C.shadow }}>
      <h1 style={{ margin: '0 0 18px', fontSize: 24, fontWeight: 700, color: C.ink }}>{mode === 'login' ? 'Sign in to your account' : 'Create an account'}</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: C.bgAlt, padding: 4, borderRadius: 9 }}>
        <Tab active={mode === 'login'} onClick={() => { setMode('login'); setError(null); }}>Sign in</Tab>
        <Tab active={mode === 'signup'} onClick={() => { setMode('signup'); setError(null); }}>Create account</Tab>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        {mode === 'signup' && <Field label="Name"><TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Engineer" /></Field>}
        <Field label="Email"><TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" onKeyDown={(e) => e.key === 'Enter' && submit()} /></Field>
        <Field label="Password" hint={mode === 'signup' ? 'At least 6 characters.' : undefined}>
          <TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={(e) => e.key === 'Enter' && submit()} />
        </Field>
        {error && <Alert tone="danger">{error}</Alert>}
        <PrimaryButton disabled={busy} onClick={submit} style={{ width: '100%', padding: 13 }}>
          {busy ? '…' : mode === 'login' ? 'Sign in' : 'Create account'}
        </PrimaryButton>
      </div>
    </div>
  );
}

function Tab({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      style={{ flex: 1, background: active ? '#fff' : 'none', border: active ? `1px solid ${C.border}` : '1px solid transparent', color: active ? C.text : C.textMute, borderRadius: 7, padding: '9px 0', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: active ? C.shadow : 'none' }}>
      {children}
    </button>
  );
}

function LoggedIn({ user, logout, isAdmin }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/orders/mine').then((d) => setOrders(d.orders)).catch(() => {}).finally(() => setLoading(false)); }, []);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: C.ink }}>My account</h1>
          <div style={{ fontSize: 14.5, color: C.textMute, marginTop: 3 }}>{user.email}</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {isAdmin && <Link to="/admin"><PrimaryButton>Admin panel</PrimaryButton></Link>}
          <SecondaryButton onClick={logout}>Sign out</SecondaryButton>
        </div>
      </div>

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 22, alignItems: 'start' }}>
        <Panel title="Order history">
          {loading ? (
            <div style={{ color: C.textMute, fontSize: 14 }}>Loading…</div>
          ) : orders.length === 0 ? (
            <div style={{ color: C.textMute, fontSize: 14, textAlign: 'center', padding: '20px 0' }}>No orders yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {orders.map((o) => (
                <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1px solid ${C.border}`, borderRadius: 8, padding: '14px 16px' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: C.text }}>{o.orderNum}</div>
                    <div style={{ fontSize: 13, color: C.textMute, marginTop: 3 }}>{fmtDate(o.date)} · {o.items.reduce((a, i) => a + i.qty, 0)} items</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: C.text }}>{eur(o.subtotal)}</div>
                    <div style={{ fontSize: 12.5, color: statusColor(o.status), fontWeight: 600, marginTop: 3 }}>{statusLabel(o.status)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Account details">
          <Row k="Name" v={user.name || '—'} />
          <Row k="Email" v={user.email} />
          <Row k="Account type" v={user.role === 'admin' ? 'Administrator' : 'Customer'} last />
        </Panel>
      </div>
    </>
  );
}

function Panel({ title, children }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 22, boxShadow: C.shadow }}>
      <h2 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 700, color: C.text }}>{title}</h2>
      {children}
    </div>
  );
}

function Row({ k, v, last }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: last ? 'none' : `1px solid ${C.border}`, padding: '10px 0', fontSize: 14.5 }}>
      <span style={{ color: C.textMute }}>{k}</span><span style={{ color: C.text, fontWeight: 500 }}>{v}</span>
    </div>
  );
}

function statusColor(s) { return s === 'paid' ? C.success : s === 'pending_payment' ? C.warn : C.textMute; }
function statusLabel(s) { return s === 'pending_payment' ? 'Pending payment' : s.charAt(0).toUpperCase() + s.slice(1); }
function fmtDate(s) {
  const d = new Date(s);
  if (isNaN(d)) return s;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
