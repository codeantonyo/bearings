import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { C, FONT, eur, seriesOf } from '../theme.js';
import { useProducts } from '../context/ProductsContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { BearingBig } from '../components/BearingGraphics.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function Product() {
  const { sku } = useParams();
  const nav = useNavigate();
  const { products, bySku, loading } = useProducts();
  const { add } = useCart();
  const { push } = useToast();
  const [qty, setQty] = useState(1);

  const p = bySku[decodeURIComponent(sku)];

  if (loading) return <Center>Loading…</Center>;
  if (!p) return (
    <Center>
      <div style={{ fontFamily: FONT.mono, fontSize: 13, color: C.muted, marginBottom: 16 }}>Bearing not found.</div>
      <Link to="/catalogue">← Back to catalogue</Link>
    </Center>
  );

  const s = seriesOf(p.series);
  const specs = [
    ['Bore d', `${p.d} mm`],
    ['Outer Ø D', `${p.D} mm`],
    ['Width W', `${p.W} mm`],
    ['Weight', `${p.weight_g} g`],
    ['Limiting speed', `${p.rpm} rpm`],
    ['Static load @ 20 °C', `${p.c0.toFixed(2)} kN`],
    [`Static load @ ${s.temp} °C`, `${(p.c0 * 0.88).toFixed(2)} kN`],
    ['Operating range', s.range.toLowerCase()],
    ['SKU', p.sku.replace(/\s/g, '')],
  ];
  const related = products.filter((x) => x.sku !== p.sku && (x.series === p.series || x.model === p.model)).slice(0, 4);

  return (
    <main style={{ flex: 1, maxWidth: 1280, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '32px 40px 64px' }}>
      <div style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1, color: C.dim, marginBottom: 28 }}>
        <Link to="/" style={{ color: C.dim }}>HOME</Link> / <Link to="/catalogue" style={{ color: C.dim }}>CATALOGUE</Link> / <span style={{ color: C.muted }}>{p.sku}</span>
      </div>

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
        {/* render / photo */}
        <div style={{ background: C.panel2, border: `1px solid ${C.faint}`, borderRadius: 12, padding: 40, position: 'sticky', top: 88 }}>
          {p.image ? (
            <img src={p.image} alt={p.sku} style={{ width: '100%', borderRadius: 8, filter: `drop-shadow(0 0 34px ${s.c}44)` }} />
          ) : (
            <BearingBig color={s.c} dmm={`${p.d} mm`} Dmm={`${p.D} mm`} Wmm={`${p.W} mm`} />
          )}
        </div>

        {/* info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <span style={{ alignSelf: 'flex-start', fontFamily: FONT.mono, fontSize: 11, letterSpacing: 2, color: s.c, border: `1px solid ${s.c}55`, borderRadius: 999, padding: '6px 14px', textShadow: `0 0 12px ${s.c}55` }}>{s.temp} °C · {s.range}</span>
          <h1 style={{ margin: 0, fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>{p.sku}</h1>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
            <span style={{ fontSize: 32, fontWeight: 700 }}>{eur(p.price)}</span>
            <span style={{ fontFamily: FONT.mono, fontSize: 11, color: C.dim }}>{p.stock > 0 ? `${p.stock} IN STOCK` : 'BACKORDER'} · CAN BE BACKORDERED</span>
          </div>
          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7, color: C.muted }}>{s.desc}</p>
          <div style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1, color: C.muted, borderLeft: `2px solid ${s.c}`, paddingLeft: 14, lineHeight: 1.9 }}>{s.tech}</div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'stretch', marginTop: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${C.faint3}`, borderRadius: 6 }}>
              <QtyBtn onClick={() => setQty((q) => Math.max(1, q - 1))}>−</QtyBtn>
              <span style={{ fontFamily: FONT.mono, fontSize: 14, minWidth: 32, textAlign: 'center' }}>{qty}</span>
              <QtyBtn onClick={() => setQty((q) => q + 1)}>+</QtyBtn>
            </div>
            <button onClick={() => { add(p.sku, qty); push({ title: `ADDED TO CART · ×${qty}`, subtitle: p.sku, color: s.c, action: { label: 'VIEW CART →', to: '/cart' } }); }} className="beco-hover"
              style={{ flex: 1, background: C.ember, color: '#0b0d10', border: 'none', borderRadius: 6, padding: 16, fontFamily: FONT.mono, fontSize: 12, letterSpacing: 2, fontWeight: 500, cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.emberSoft)}
              onMouseLeave={(e) => (e.currentTarget.style.background = C.ember)}>
              ADD TO CART — {eur(p.price * qty)}
            </button>
          </div>
          <div style={{ fontFamily: FONT.mono, fontSize: 10, letterSpacing: 1, color: C.dim }}>GUARANTEED SAFE CHECKOUT · VISA / MASTERCARD · MIN ORDER 20 €</div>

          <div style={{ marginTop: 8 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 10, letterSpacing: 3, color: C.dim, marginBottom: 10 }}>TECHNICAL DATA</div>
            <div style={{ border: `1px solid ${C.faint}`, borderRadius: 8, overflow: 'hidden' }}>
              {specs.map(([k, v], i) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 16px', borderBottom: i < specs.length - 1 ? '1px solid rgba(255,255,255,.06)' : 'none', fontFamily: FONT.mono, fontSize: 12 }}>
                  <span style={{ color: C.muted }}>{k}</span><span style={{ color: C.text }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ marginTop: 64 }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 24, fontWeight: 700, letterSpacing: -0.5 }}>Related bearings</h2>
          <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {related.map((r) => <ProductCard key={r.sku} product={r} variant="related" />)}
          </div>
        </div>
      )}
    </main>
  );
}

function QtyBtn({ children, onClick }) {
  return (
    <button onClick={onClick} className="beco-hover"
      style={{ background: 'none', border: 'none', color: C.text, width: 42, height: 44, fontSize: 18, cursor: 'pointer' }}
      onMouseEnter={(e) => (e.currentTarget.style.color = C.ember)}
      onMouseLeave={(e) => (e.currentTarget.style.color = C.text)}>{children}</button>
  );
}

function Center({ children }) {
  return <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 80, textAlign: 'center' }}>{children}</main>;
}
