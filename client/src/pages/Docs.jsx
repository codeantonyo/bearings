import { C, SERIES } from '../theme.js';
import { useProducts } from '../context/ProductsContext.jsx';
import { Eyebrow } from '../components/ui.jsx';

export default function Docs() {
  const { products } = useProducts();
  const countFor = (key) => products.filter((p) => p.series === key).length;

  const list = Object.values(SERIES).map((s) => ({
    title: `${s.label} — Datasheet`,
    tag: `Series datasheet · ${s.temp} °C`,
    desc: `Dimensions, static/dynamic load ratings, limiting speeds and clearance specifications for all ${countFor(s.key)} sizes of the ${s.label} class.`,
    c: s.c,
    mail: `mailto:office@becobearings.com?subject=${encodeURIComponent('Datasheet request: ' + s.label)}`,
  })).concat([
    { title: 'Mounting & handling guidelines', tag: 'Technical guide', desc: 'Correct fitting, shaft/housing tolerances and running-in procedure for high-temperature bearings.', c: C.textMute, mail: `mailto:office@becobearings.com?subject=${encodeURIComponent('Document request: Mounting & handling guidelines')}` },
    { title: 'Lubricant & grease reference', tag: 'Technical guide', desc: 'Grease and solid-lubricant specifications per temperature class, with relubrication intervals.', c: C.textMute, mail: `mailto:office@becobearings.com?subject=${encodeURIComponent('Document request: Lubricant & grease reference')}` },
  ]);

  return (
    <main className="page-pad" style={{ flex: 1, maxWidth: 1000, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '36px 24px 56px' }}>
      <Eyebrow>Technical documentation</Eyebrow>
      <h1 style={{ margin: '0 0 10px', fontSize: 32, fontWeight: 700, color: C.ink }}>Datasheets & guides</h1>
      <p style={{ margin: '0 0 32px', maxWidth: 560, fontSize: 16, lineHeight: 1.65, color: C.textSoft }}>
        Series datasheets with dimensions, load ratings and limiting speeds. Request any document by email — we reply within one working day.
      </p>
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
        {list.map((d) => (
          <div key={d.title} className="card-hover" style={{ background: '#fff', border: `1px solid ${C.border}`, borderTop: `3px solid ${d.c}`, borderRadius: 10, padding: 22, display: 'flex', flexDirection: 'column', gap: 8, boxShadow: C.shadow }}>
            <div className="eyebrow" style={{ color: C.textMute }}>{d.tag}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.ink }}>{d.title}</div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: C.textSoft }}>{d.desc}</div>
            <a href={d.mail} style={{ marginTop: 8, alignSelf: 'flex-start', fontSize: 14, fontWeight: 600, color: C.brand }}>Request PDF →</a>
          </div>
        ))}
      </div>
    </main>
  );
}
