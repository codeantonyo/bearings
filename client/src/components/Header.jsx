import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  const { pathname } = useLocation();
  const { count } = useCart();
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  // Close the drawer whenever the route changes.
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock body scroll + close on Escape while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [open]);

  const allLinks = isAdmin ? [...links, ['/admin', 'ADMIN']] : links;

  return (
    <>
      <header className="site-header" style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', gap: 32, padding: '0 40px', height: 64, background: 'rgba(11,13,16,.85)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.faint}` }}>
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
              style={({ isActive }) => ({ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 2, color: C.ember, opacity: isActive ? 1 : 0.75 })}>
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

        <button className="burger" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}
          style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: 42, height: 42, background: open ? '#1a1f26' : 'none', border: `1px solid ${open ? C.ember : C.faint3}`, borderRadius: 10, cursor: 'pointer', padding: 0, transition: 'border-color .2s, background .2s' }}>
          <BurgerIcon open={open} />
        </button>
      </header>

      {/* Backdrop */}
      <div className="mobile-only" onClick={() => setOpen(false)} aria-hidden={!open}
        style={{ position: 'fixed', inset: '64px 0 0 0', background: 'rgba(6,8,10,.55)', backdropFilter: 'blur(2px)', zIndex: 44, opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity .28s ease' }} />

      {/* Slide-in drawer */}
      <aside className="mobile-only" aria-hidden={!open}
        style={{ position: 'fixed', top: 64, right: 0, bottom: 0, width: 'min(320px, 84vw)', background: C.panel2, borderLeft: `1px solid ${C.faint}`, boxShadow: '-24px 0 60px rgba(0,0,0,.5)', zIndex: 45, transform: open ? 'translateX(0)' : 'translateX(105%)', transition: 'transform .32s cubic-bezier(.22,.9,.3,1)', display: 'flex', flexDirection: 'column', padding: '22px 22px 0' }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 10, letterSpacing: 3, color: C.dim, marginBottom: 6 }}>NAVIGATION</div>

        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          {allLinks.map(([to, label], i) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 14, padding: '15px 2px',
                borderBottom: `1px solid ${C.faint}`, textDecoration: 'none',
                fontFamily: FONT.mono, fontSize: 15, letterSpacing: 2,
                color: label === 'ADMIN' ? C.ember : (isActive ? C.text : C.muted),
                opacity: open ? 1 : 0,
                transform: open ? 'translateX(0)' : 'translateX(16px)',
                transition: `opacity .34s ${i * 45 + 90}ms ease, transform .34s ${i * 45 + 90}ms cubic-bezier(.22,.9,.3,1), color .2s`,
              })}>
              {({ isActive }) => (
                <>
                  <span style={{ fontSize: 10, color: isActive ? C.ember : C.dim, minWidth: 20 }}>0{i + 1}</span>
                  <span style={{ flex: 1 }}>{label}</span>
                  <span aria-hidden style={{ color: C.dim }}>→</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Cart shortcut */}
        <button onClick={() => { setOpen(false); nav('/cart'); }}
          style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.ember, color: '#0b0d10', border: 'none', borderRadius: 8, padding: '14px 16px', cursor: 'pointer', fontFamily: FONT.mono, fontSize: 12, letterSpacing: 2, fontWeight: 500 }}>
          VIEW CART
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 22, height: 22, borderRadius: 999, background: '#0b0d10', color: C.ember, fontSize: 11 }}>{count}</span>
        </button>

        <div style={{ flex: 1 }} />

        {/* Footer: rating + contact */}
        <div style={{ borderTop: `1px solid ${C.faint}`, padding: '18px 0 22px', display: 'flex', flexDirection: 'column', gap: 10, fontFamily: FONT.mono, fontSize: 11, color: C.muted }}>
          <div style={{ letterSpacing: 1 }}>−30 °C … <span style={{ color: C.emberSoft }}>+350 °C</span></div>
          <a href="https://wa.me/37360948118">+373 60 948 118</a>
          <a href="mailto:office@becobearings.com">office@becobearings.com</a>
        </div>
      </aside>
    </>
  );
}

// Three bars that morph into an X.
function BurgerIcon({ open }) {
  const bar = {
    position: 'absolute', left: 8, right: 8, height: 2, borderRadius: 2,
    background: open ? C.ember : C.text,
    transition: 'transform .3s cubic-bezier(.22,.9,.3,1), opacity .2s, background .2s',
  };
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: 24, height: 18 }}>
      <span style={{ ...bar, top: 2, transform: open ? 'translateY(6px) rotate(45deg)' : 'none' }} />
      <span style={{ ...bar, top: 8, opacity: open ? 0 : 1 }} />
      <span style={{ ...bar, top: 14, transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none' }} />
    </span>
  );
}
