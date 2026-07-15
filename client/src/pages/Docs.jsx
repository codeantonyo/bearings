import { C, FONT, SERIES } from '../theme.js';
import { useProducts } from '../context/ProductsContext.jsx';
import { Eyebrow } from '../components/ui.jsx';

export default function Docs() {
  const { products } = useProducts();
  const countFor = (key) => products.filter((p) => p.series === key).length;

  const list = Object.values(SERIES).map((s) => ({
    title: `${s.label} — Datasheet`,
    tag: `PDF · SERIES DATASHEET · ${s.temp} °C`,
    desc: `Dimensions, static/dynamic load ratings, limiting speeds and clearance specifications for all ${countFor(s.key)} sizes of the ${s.label} class.`,
    c: s.c,
    mail: `mailto:office@becobearings.com?subject=${encodeURIComponent('Datasheet request: ' + s.label)}`,
  })).concat([
    { title: 'Mounting & handling guidelines', tag: 'PDF · TECHNICAL GUIDE', desc: 'Correct fitting, shaft/housing tolerances and running-in procedure for high-temperature bearings.', c: C.muted, mail: `mailto:office@becobearings.com?subject=${encodeURIComponent('Document request: Mounting & handling guidelines')}` },
    { title: 'Lubricant & grease reference', tag: 'PDF · TECHNICAL GUIDE', desc: 'Grease and solid-lubricant specifications per temperature class, with relubrication intervals.', c: C.muted, mail: `mailto:office@becobearings.com?subject=${encodeURIComponent('Document request: Lubricant & grease reference')}` },
  ]);

  return (
    <main style={{ flex: 1, maxWidth: 1100, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '48px 40px 72px' }}>
      <Eyebrow>TECHNICAL DOCUMENTATION</Eyebrow>
      <h1 style={{ margin: '0 0 12px', fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>Docs &amp; datasheets</h1>
      <p style={{ margin: '0 0 36px', maxWidth: 560, fontSize: 15, lineHeight: 1.7, color: C.muted }}>Series datasheets with dimensions, load ratings and limiting speeds. Request any document by email — we reply within one working day.</p>
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
        {list.map((d) => (
          <div key={d.title} className="beco-hover" style={{ background: C.panel, border: `1px solid ${C.faint}`, borderRadius: 10, padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = d.c)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.faint)}>
            <div style={{ height: 3, width: 56, borderRadius: 2, background: d.c, boxShadow: `0 0 10px ${d.c}66` }} />
            <div style={{ fontFamily: FONT.mono, fontSize: 10, letterSpacing: 2, color: C.dim, marginTop: 6 }}>{d.tag}</div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>{d.title}</div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: C.muted }}>{d.desc}</div>
            <a href={d.mail} className="beco-hover" style={{ alignSelf: 'flex-start', marginTop: 6, border: `1px solid ${d.c}`, color: d.c, borderRadius: 6, padding: '9px 16px', fontFamily: FONT.mono, fontSize: 10, letterSpacing: 2 }}
              onMouseEnter={(e) => { e.currentTarget.style.background = d.c; e.currentTarget.style.color = '#0b0d10'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = d.c; }}>REQUEST PDF →</a>
          </div>
        ))}
      </div>
    </main>
  );
}
