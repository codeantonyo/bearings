import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { C, FONT } from '../theme.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  ['/', 'Home'],
  ['/catalogue', 'Catalogue'],
  ['/docs', 'Documentation'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

function CartGlyph({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
  );
}

export default function Header() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { count } = useCart();
  const { user, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [open]);

  const search = (e) => {
    e.preventDefault();
    nav(q.trim() ? `/catalogue?q=${encodeURIComponent(q.trim())}` : '/catalogue');
  };

  const navItems = [...links, ['/account', user ? 'My account' : 'Sign in']];
  const drawerItems = isAdmin ? [...navItems, ['/admin', 'Admin panel']] : navItems;

  return (
    <>
      {/* utility bar */}
      <div style={{ background: C.ink, color: '#cfd6de' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px', height: 38, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
          <span>Free EU shipping from the Netherlands <span className="util-left-extra">· Minimum order €20 · EU-local support</span></span>
          <span className="util-right" style={{ display: 'flex', gap: 20 }}>
            <a href="https://wa.me/37360948118" style={{ color: '#eef1f4' }}>+373 60 948 118</a>
            <a href="mailto:office@becobearings.com" style={{ color: '#eef1f4' }}>office@becobearings.com</a>
          </span>
        </div>
      </div>

      {/* main header */}
      <header className="site-header" style={{ position: 'sticky', top: 0, zIndex: 50, background: '#fff', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', gap: 24 }}>
          <button onClick={() => nav('/')} aria-label="BECO Bearings home"
            style={{ display: 'flex', alignItems: 'baseline', gap: 9, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <span style={{ fontWeight: 700, fontSize: 23, letterSpacing: 1, color: C.ink }}>BECO</span>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.14em', color: C.brand }}>BEARINGS</span>
          </button>

          <form onSubmit={search} className="header-search" style={{ flex: 1, maxWidth: 440, position: 'relative' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={C.textMute} strokeWidth="2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} aria-hidden>
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" strokeLinecap="round" />
            </svg>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search part number (e.g. 6204)"
              aria-label="Search catalogue"
              style={{ width: '100%', boxSizing: 'border-box', background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px 10px 36px', fontSize: 14.5 }} />
          </form>

          <div style={{ flex: 1 }} className="header-search-spacer" />

          <nav className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'}
                style={({ isActive }) => ({ fontSize: 14.5, fontWeight: 500, color: isActive ? C.brand : C.textSoft })}>
                {label}
              </NavLink>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <NavLink to="/account" className="nav-links"
              style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: 7, fontSize: 14.5, fontWeight: 500, color: isActive ? C.brand : C.textSoft })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" strokeLinecap="round" /></svg>
              {user ? 'Account' : 'Sign in'}
            </NavLink>

            <button onClick={() => nav('/cart')} className="link-hover"
              style={{ display: 'flex', alignItems: 'center', gap: 9, background: C.brand, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', cursor: 'pointer', fontSize: 14.5, fontWeight: 600 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.brandDark)}
              onMouseLeave={(e) => (e.currentTarget.style.background = C.brand)}>
              <CartGlyph color="#fff" />
              Cart
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 20, height: 20, borderRadius: 999, background: '#fff', color: C.brand, fontSize: 12, fontWeight: 700, padding: '0 5px' }}>{count}</span>
            </button>

            <button className="burger" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}
              style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: 42, height: 42, background: '#fff', border: `1px solid ${C.borderStrong}`, borderRadius: 8, cursor: 'pointer', padding: 0 }}>
              <BurgerIcon open={open} />
            </button>
          </div>
        </div>
      </header>

      {/* backdrop */}
      <div className="mobile-only" onClick={() => setOpen(false)} aria-hidden={!open}
        style={{ position: 'fixed', inset: 0, background: 'rgba(20,28,38,.4)', zIndex: 60, opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity .25s ease' }} />

      {/* drawer */}
      <aside className="mobile-only" aria-hidden={!open}
        style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(330px, 86vw)', background: '#fff', boxShadow: '-16px 0 40px rgba(16,24,40,.18)', zIndex: 61, transform: open ? 'translateX(0)' : 'translateX(102%)', transition: 'transform .3s cubic-bezier(.22,.9,.3,1)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontWeight: 700, fontSize: 18, color: C.ink }}>Menu</span>
          <button onClick={() => setOpen(false)} aria-label="Close menu" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: C.textSoft, lineHeight: 1 }}>×</button>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', padding: '6px 0', overflowY: 'auto' }}>
          {drawerItems.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}
              style={({ isActive }) => ({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', fontSize: 16, fontWeight: 500, color: label === 'Admin panel' ? C.brand : (isActive ? C.brand : C.text), borderBottom: `1px solid ${C.border}`, textDecoration: 'none' })}>
              {label}
              <span aria-hidden style={{ color: C.textMute }}>›</span>
            </NavLink>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: C.textSoft, background: C.bgAlt, borderTop: `1px solid ${C.border}` }}>
          <div>Rated −30 °C … +350 °C</div>
          <a href="https://wa.me/37360948118">+373 60 948 118</a>
          <a href="mailto:office@becobearings.com">office@becobearings.com</a>
        </div>
      </aside>
    </>
  );
}

function BurgerIcon({ open }) {
  const bar = { position: 'absolute', left: 9, right: 9, height: 2, borderRadius: 2, background: C.ink, transition: 'transform .28s cubic-bezier(.22,.9,.3,1), opacity .2s' };
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: 24, height: 16 }}>
      <span style={{ ...bar, top: 1, transform: open ? 'translateY(6px) rotate(45deg)' : 'none' }} />
      <span style={{ ...bar, top: 7, opacity: open ? 0 : 1 }} />
      <span style={{ ...bar, top: 13, transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none' }} />
    </span>
  );
}
