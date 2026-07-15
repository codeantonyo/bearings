import { C, FONT } from '../theme.js';

export default function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${C.faint}`, background: C.panel2 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 40px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', fontFamily: FONT.mono, fontSize: 11, color: C.dim }}>
        <span style={{ fontWeight: 700, letterSpacing: 3, color: C.muted, fontFamily: FONT.display }}>BECO</span>
        <span>© 2026 Bearings Netherlands</span>
        <span style={{ flex: 1 }} />
        <a href="https://wa.me/37360948118">+373 60 948 118</a>
        <a href="mailto:office@becobearings.com">office@becobearings.com</a>
        <span>−30 °C … +350 °C</span>
      </div>
    </footer>
  );
}
