import { Link } from 'react-router-dom';
import { C } from '../theme.js';

const cols = [
  { title: 'Products', links: [['/catalogue', 'Full catalogue'], ['/catalogue?series=s200', '200 °C class'], ['/catalogue?series=s280', '280 °C class'], ['/catalogue?series=s350', '350 °C PLUS class']] },
  { title: 'Company', links: [['/about', 'About BECO'], ['/docs', 'Documentation'], ['/contact', 'Contact us']] },
  { title: 'Support', links: [['/account', 'My account'], ['/cart', 'Cart'], ['/contact', 'Request an offer']] },
];

export default function Footer() {
  return (
    <footer style={{ background: '#fff', borderTop: `1px solid ${C.border}`, marginTop: 8 }}>
      <div className="page-pad footer-grid" style={{ maxWidth: 1240, margin: '0 auto', padding: '44px 24px 32px', display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 40 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 9, marginBottom: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: 1, color: C.ink }}>BECO</span>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.14em', color: C.brand }}>BEARINGS</span>
          </div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: C.textSoft, maxWidth: 300 }}>
            Extreme-temperature ball bearings rated from −30 °C to +350 °C. Manufactured by Beco Italy,
            shipped fast from the Netherlands.
          </p>
          <div style={{ marginTop: 16, fontSize: 14, color: C.textSoft, lineHeight: 1.9 }}>
            <div><a href="https://wa.me/37360948118">+373 60 948 118</a></div>
            <div><a href="mailto:office@becobearings.com">office@becobearings.com</a></div>
          </div>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 14 }}>{col.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {col.links.map(([to, label]) => (
                <Link key={label} to={to} style={{ fontSize: 14, color: C.textSoft, textDecoration: 'none' }}>{label}</Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="page-pad" style={{ maxWidth: 1240, margin: '0 auto', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', fontSize: 13, color: C.textMute }}>
          <span>© 2026 BECO Bearings Netherlands. All rights reserved.</span>
          <span>VISA · Mastercard · Rated −30 °C … +350 °C</span>
        </div>
      </div>
    </footer>
  );
}
