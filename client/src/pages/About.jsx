import { useNavigate } from 'react-router-dom';
import { C } from '../theme.js';
import { useProducts } from '../context/ProductsContext.jsx';
import { Eyebrow, PrimaryButton } from '../components/ui.jsx';

export default function About() {
  const nav = useNavigate();
  const { products } = useProducts();

  const rows = [
    ['Manufacturer', 'Beco Italy'],
    ['EU branch', 'Netherlands · 2023'],
    ['Temperature range', '−30 … +350 °C'],
    ['Catalogue', `${products.length} products · 4 classes`],
    ['Minimum order', '€20'],
  ];

  return (
    <main className="page-pad" style={{ flex: 1, maxWidth: 1000, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '36px 24px 56px' }}>
      <Eyebrow>About us</Eyebrow>
      <h1 style={{ margin: '0 0 32px', maxWidth: 720, fontSize: 36, fontWeight: 700, color: C.ink, lineHeight: 1.15 }}>
        Decades of pushing the limits of what a bearing can survive
      </h1>
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 44, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, fontSize: 16, lineHeight: 1.75, color: C.textSoft }}>
          <p style={{ margin: 0 }}>Beco Bearings is a manufacturer of premium extreme-temperature bearings and an industry leader in the field. Beco Italy has spent decades developing stabilization treatments, clearances and lubricants that keep bearings running where standard products fail without warning.</p>
          <p style={{ margin: 0 }}>Beco Netherlands is a new branch, opened in 2023 with the help of Beco Italy, created for one purpose: faster shipping times and better customer service. You order and pay directly on this site — no intermediaries, no delays.</p>
          <p style={{ margin: 0 }}>Every bearing in the catalogue is rated for continuous duty at its class temperature — from −30 °C cold starts to +350 °C furnace-side operation.</p>
        </div>
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, boxShadow: C.shadow }}>
          {rows.map(([k, v], i) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : 'none', padding: '12px 0', fontSize: 14.5 }}>
              <span style={{ color: C.textMute }}>{k}</span><span style={{ color: C.text, fontWeight: 600 }}>{v}</span>
            </div>
          ))}
          <PrimaryButton onClick={() => nav('/catalogue')} style={{ width: '100%', marginTop: 16 }}>Browse the catalogue</PrimaryButton>
        </div>
      </div>
    </main>
  );
}
