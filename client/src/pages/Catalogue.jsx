import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { C, SERIES } from '../theme.js';
import { useProducts } from '../context/ProductsContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

const BORES = [
  ['all', 'All', () => true],
  ['small', '≤ 12 mm', (p) => p.d <= 12],
  ['mid', '15 – 20 mm', (p) => p.d >= 15 && p.d <= 20],
  ['big', '≥ 25 mm', (p) => p.d >= 25],
];

export default function Catalogue() {
  const { products, loading } = useProducts();
  const [params, setParams] = useSearchParams();
  const [series, setSeries] = useState(params.get('series') || 'all');
  const [bore, setBore] = useState('all');
  const [q, setQ] = useState(params.get('q') || '');

  // Keep series/q in the URL so it's shareable and survives refresh.
  useEffect(() => {
    const p = new URLSearchParams();
    if (series !== 'all') p.set('series', series);
    if (q.trim()) p.set('q', q.trim());
    setParams(p, { replace: true });
  }, [series, q, setParams]);

  // Adopt the ?q that the header search sets on navigation.
  useEffect(() => { setQ(params.get('q') || ''); /* eslint-disable-next-line */ }, [params.get('q')]);

  const boreTest = BORES.find(([k]) => k === bore)[2];
  const query = q.trim().toLowerCase();
  const filtered = useMemo(() => products.filter((p) =>
    (series === 'all' || p.series === series) && boreTest(p) && (!query || p.sku.toLowerCase().includes(query))
  ), [products, series, bore, query]);

  const classes = [{ key: 'all', label: 'All classes', c: C.textMute }].concat(Object.values(SERIES).map((s) => ({ key: s.key, label: `${s.temp} °C — ${s.label}`, c: s.c })));
  const countClass = (k) => (k === 'all' ? products.length : products.filter((p) => p.series === k).length);

  return (
    <main className="page-pad" style={{ flex: 1, maxWidth: 1240, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '24px 24px 56px' }}>
      <nav style={{ fontSize: 13.5, color: C.textMute, marginBottom: 14 }}>
        <Link to="/" style={{ color: C.textMute }}>Home</Link> <span style={{ color: C.borderStrong }}>/</span> <span style={{ color: C.textSoft }}>Catalogue</span>
      </nav>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 700, color: C.ink }}>Bearing catalogue</h1>
        <span style={{ fontSize: 14, color: C.textMute }}>{filtered.length} product{filtered.length === 1 ? '' : 's'}</span>
      </div>

      <div className="shop-layout" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 28, alignItems: 'start' }}>
        {/* filters */}
        <aside style={{ position: 'sticky', top: 84, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, boxShadow: C.shadow }}>
          <FilterGroup label="Temperature class">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {classes.map((s) => {
                const active = series === s.key;
                return (
                  <button key={s.key} onClick={() => setSeries(s.key)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, background: active ? C.brandTint : 'none', border: 'none', borderRadius: 7, padding: '9px 10px', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                    <span style={{ width: 9, height: 9, borderRadius: '50%', background: s.c, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 14, color: active ? C.brand : C.textSoft, fontWeight: active ? 600 : 400 }}>{s.label}</span>
                    <span style={{ fontSize: 12.5, color: C.textMute }}>{countClass(s.key)}</span>
                  </button>
                );
              })}
            </div>
          </FilterGroup>

          <FilterGroup label="Bore diameter">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {BORES.map(([key, label]) => {
                const active = bore === key;
                return (
                  <button key={key} onClick={() => setBore(key)} className="link-hover"
                    style={{ background: active ? C.brand : '#fff', border: `1px solid ${active ? C.brand : C.borderStrong}`, color: active ? '#fff' : C.textSoft, borderRadius: 999, padding: '7px 13px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>{label}</button>
                );
              })}
            </div>
          </FilterGroup>

          <FilterGroup label="Search" last>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. 6204"
              style={{ width: '100%', boxSizing: 'border-box', background: '#fff', border: `1px solid ${C.borderStrong}`, borderRadius: 8, padding: '10px 12px', fontSize: 14.5 }} />
          </FilterGroup>
        </aside>

        {/* grid */}
        <div>
          {loading ? (
            <div style={{ padding: 40, color: C.textMute }}>Loading catalogue…</div>
          ) : filtered.length === 0 ? (
            <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10, padding: 56, textAlign: 'center', color: C.textSoft }}>
              No bearings match your filters. <Link to="/contact">Ask for a personalized offer</Link>.
            </div>
          ) : (
            <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
              {filtered.map((p) => <ProductCard key={p.sku} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function FilterGroup({ label, children, last }) {
  return (
    <div style={{ marginBottom: last ? 0 : 22, paddingBottom: last ? 0 : 22, borderBottom: last ? 'none' : `1px solid ${C.border}` }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12 }}>{label}</div>
      {children}
    </div>
  );
}
