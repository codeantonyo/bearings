import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { C, FONT, SERIES } from '../theme.js';
import { useProducts } from '../context/ProductsContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

const BORES = [
  ['all', 'ALL', () => true],
  ['small', '≤ 12', (p) => p.d <= 12],
  ['mid', '15 – 20', (p) => p.d >= 15 && p.d <= 20],
  ['big', '≥ 25', (p) => p.d >= 25],
];

export default function Catalogue() {
  const { products, loading } = useProducts();
  const [params, setParams] = useSearchParams();
  const [series, setSeries] = useState(params.get('series') || 'all');
  const [bore, setBore] = useState('all');
  const [q, setQ] = useState('');

  // Keep the URL in sync so the class is shareable / survives refresh.
  useEffect(() => {
    const p = new URLSearchParams();
    if (series !== 'all') p.set('series', series);
    setParams(p, { replace: true });
  }, [series, setParams]);

  const boreTest = BORES.find(([k]) => k === bore)[2];
  const query = q.trim().toLowerCase();

  const filtered = useMemo(() => products.filter((p) =>
    (series === 'all' || p.series === series) &&
    boreTest(p) &&
    (!query || p.sku.toLowerCase().includes(query))
  ), [products, series, bore, query]);

  const seriesPills = [{ key: 'all', label: 'ALL CLASSES', c: C.muted }]
    .concat(Object.values(SERIES).map((s) => ({ key: s.key, label: `${s.temp} °C — ${s.label}`, c: s.c })))
    .map((s) => ({ ...s, n: s.key === 'all' ? products.length : products.filter((p) => p.series === s.key).length }));

  return (
    <main className="shop-layout" style={{ flex: 1, maxWidth: 1280, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: 40, display: 'grid', gridTemplateColumns: '250px 1fr', gap: 36, alignItems: 'start' }}>
      {/* filter rail */}
      <aside style={{ position: 'sticky', top: 88, display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div>
          <RailLabel>TEMPERATURE CLASS</RailLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {seriesPills.map((s) => {
              const active = series === s.key;
              return (
                <button key={s.key} onClick={() => setSeries(s.key)} className="beco-hover"
                  style={{ display: 'flex', alignItems: 'center', gap: 12, background: active ? '#1a1f26' : C.panel, border: `1px solid ${active ? s.c : C.faint}`, borderRadius: 8, padding: '11px 14px', cursor: 'pointer', textAlign: 'left' }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = s.c)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = active ? s.c : C.faint)}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: s.c, boxShadow: `0 0 10px ${s.c}` }} />
                  <span style={{ flex: 1, fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1, color: C.text }}>{s.label}</span>
                  <span style={{ fontFamily: FONT.mono, fontSize: 10, color: C.dim }}>{s.n}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <RailLabel>BORE Ø (MM)</RailLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {BORES.map(([key, label]) => {
              const active = bore === key;
              return (
                <button key={key} onClick={() => setBore(key)} className="beco-hover"
                  style={{ background: active ? C.ember : C.panel, border: `1px solid ${active ? C.ember : C.faint2}`, color: active ? '#0b0d10' : C.muted, borderRadius: 999, padding: '8px 12px', fontFamily: FONT.mono, fontSize: 10.5, cursor: 'pointer', whiteSpace: 'nowrap' }}>{label}</button>
              );
            })}
          </div>
        </div>

        <div>
          <RailLabel>SEARCH</RailLabel>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. 6204"
            style={{ width: '100%', boxSizing: 'border-box', background: C.panel, border: `1px solid ${C.faint2}`, borderRadius: 8, padding: '11px 14px', color: C.text, fontFamily: FONT.mono, fontSize: 12 }} />
        </div>
      </aside>

      {/* grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>Catalogue</h1>
          <span style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1, color: C.dim }}>{filtered.length} RESULTS</span>
        </div>
        {loading ? (
          <div style={{ fontFamily: FONT.mono, fontSize: 12, color: C.dim, padding: 40 }}>Loading catalogue…</div>
        ) : filtered.length === 0 ? (
          <div style={{ border: `1px dashed ${C.faint3}`, borderRadius: 10, padding: 60, textAlign: 'center', fontFamily: FONT.mono, fontSize: 12, color: C.dim }}>
            No bearings match — clear a filter or <a href="mailto:office@becobearings.com">ask for a personalized offer</a>.
          </div>
        ) : (
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {filtered.map((p) => <ProductCard key={p.sku} product={p} variant="shop" />)}
          </div>
        )}
      </div>
    </main>
  );
}

function RailLabel({ children }) {
  return <div style={{ fontFamily: FONT.mono, fontSize: 10, letterSpacing: 3, color: C.dim, marginBottom: 12 }}>{children}</div>;
}
