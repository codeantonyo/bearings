import { useNavigate } from 'react-router-dom';
import { C, FONT } from '../theme.js';
import { useProducts } from '../context/ProductsContext.jsx';
import { Eyebrow, PrimaryButton } from '../components/ui.jsx';

export default function About() {
  const nav = useNavigate();
  const { products } = useProducts();

  const rows = [
    ['MANUFACTURER', 'BECO ITALY'],
    ['EU BRANCH', 'NETHERLANDS · 2023'],
    ['RANGE', '−30 … +350 °C'],
    ['CATALOGUE', `${products.length} SKUs · 4 CLASSES`],
    ['MIN ORDER', '20 €'],
  ];

  return (
    <main style={{ flex: 1, maxWidth: 1100, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '48px 40px 72px' }}>
      <Eyebrow>ABOUT US</Eyebrow>
      <h1 style={{ margin: '0 0 40px', maxWidth: 760, fontSize: 44, fontWeight: 700, letterSpacing: -1, lineHeight: 1.1 }}>Decades of pushing the limits of what a bearing can survive.</h1>
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontSize: 15, lineHeight: 1.75, color: C.muted }}>
          <p style={{ margin: 0 }}>Beco Bearings is a manufacturer of premium extreme-temperature bearings and an industry leader in the field. Beco Italy has spent decades developing stabilization treatments, clearances and lubricants that keep bearings running where standard products fail without warning.</p>
          <p style={{ margin: 0 }}>Beco Netherlands is a new branch, opened in 2023 with the help of Beco Italy, created for one purpose: faster shipping times and better customer service. You order and pay directly on this site — no intermediaries, no delays.</p>
          <p style={{ margin: 0 }}>Every bearing in the catalogue is rated for continuous duty at its class temperature — from −30 °C cold starts to +350 °C furnace-side operation.</p>
        </div>
        <div style={{ background: C.panel, border: `1px solid ${C.faint}`, borderRadius: 12, padding: 28, display: 'flex', flexDirection: 'column', gap: 18, fontFamily: FONT.mono, fontSize: 12 }}>
          {rows.map(([k, v], i) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,.06)' : 'none', paddingBottom: i < rows.length - 1 ? 14 : 0 }}>
              <span style={{ color: C.dim }}>{k}</span><span style={{ color: C.text }}>{v}</span>
            </div>
          ))}
          <PrimaryButton onClick={() => nav('/catalogue')} style={{ marginTop: 8, padding: 14, fontSize: 11 }}>BROWSE CATALOGUE →</PrimaryButton>
        </div>
      </div>
    </main>
  );
}
