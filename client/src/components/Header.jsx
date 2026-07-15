import { NavLink, useNavigate } from 'react-router-dom';
import { C, FONT } from '../theme.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  ['/', 'HOME'],
  ['/catalogue', 'CATALOGUE'],
  ['/docs', 'DOCS'],
  ['/about', 'ABOUT'],
  ['/contact', 'CONTACT'],
  ['/account', 'ACCOUNT'],
];

export default function Header() {
  const nav = useNavigate();
  const { count } = useCart();
  const { isAdmin } = useAuth();

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', gap: 32, padding: '0 40px', height: 64, background: 'rgba(11,13,16,.85)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.faint}` }}>
      <button onClick={() => nav('/')} style={{ display: 'flex', alignItems: 'baseline', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        <span style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: C.text }}>BECO</span>
        <span style={{ fontFamily: FONT.mono, fontSize: 10, letterSpacing: 2, color: C.muted }}>BEARINGS · NL</span>
      </button>

      <nav className="nav-links" style={{ display: 'flex', gap: 24, marginLeft: 12 }}>
        {links.map(([to, label]) => (
          <NavLink key={to} to={to} end={to === '/'}
            style={({ isActive }) => ({ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', fontFamily: FONT.mono, fontSize: 11, letterSpacing: 2, color: isActive ? C.text : C.muted })}>
            {label}
          </NavLink>
        ))}
        {isAdmin && (
          <NavLink to="/admin"
            style={({ isActive }) => ({ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 2, color: isActive ? C.ember : C.ember, opacity: isActive ? 1 : 0.75 })}>
            ADMIN
          </NavLink>
        )}
      </nav>

      <div style={{ flex: 1 }} />

      <span className="hdr-temp" style={{ fontFamily: FONT.mono, fontSize: 11, color: C.muted, letterSpacing: 1, whiteSpace: 'nowrap' }}>
        −30 °C … <span style={{ color: C.emberSoft }}>+350 °C</span>
      </span>

      <button onClick={() => nav('/cart')} className="beco-hover"
        style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: `1px solid ${C.faint3}`, borderRadius: 999, padding: '8px 18px', cursor: 'pointer', color: C.text, fontFamily: FONT.mono, fontSize: 11, letterSpacing: 2 }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.ember; e.currentTarget.style.color = C.ember; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.faint3; e.currentTarget.style.color = C.text; }}>
        CART
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 20, height: 20, borderRadius: 999, background: C.ember, color: '#0b0d10', fontSize: 11, fontWeight: 500, padding: '0 5px' }}>{count}</span>
      </button>
    </header>
  );
}
