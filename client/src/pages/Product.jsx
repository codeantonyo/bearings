import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { C, FONT, eur, seriesOf } from '../theme.js';
import { useProducts } from '../context/ProductsContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { BearingTechnical } from '../components/BearingGraphics.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { TempBadge, partNo } from '../components/ui.jsx';

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
      <div style={{ color: C.textSoft, marginBottom: 14 }}>This bearing could not be found.</div>
      <Link to="/catalogue">← Back to catalogue</Link>
    </Center>
  );

  const s = seriesOf(p.series);
  const specs = [
    ['Bore Ø (d)', `${p.d} mm`],
    ['Outer Ø (D)', `${p.D} mm`],
    ['Width (W)', `${p.W} mm`],
    ['Weight', `${p.weight_g} g`],
    ['Limiting speed', `${p.rpm} rpm`],
    ['Static load rating @ 20 °C', `${p.c0.toFixed(2)} kN`],
    [`Static load rating @ ${s.temp} °C`, `${(p.c0 * 0.88).toFixed(2)} kN`],
    ['Operating range', s.range],
    ['Part number', p.sku.replace(/\s/g, '')],
  ];
  const related = products.filter((x) => x.sku !== p.sku && (x.series === p.series || x.model === p.model)).slice(0, 4);

  function addToCart() {
    add(p.sku, qty);
    push({ title: `Added to cart (×${qty})`, subtitle: p.sku, action: { label: 'View cart', to: '/cart' } });
  }

  return (
    <main className="page-pad" style={{ flex: 1, maxWidth: 1240, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '24px 24px 56px' }}>
      <nav style={{ fontSize: 13.5, color: C.textMute, marginBottom: 22 }}>
        <Link to="/" style={{ color: C.textMute }}>Home</Link> <span style={{ color: C.borderStrong }}>/</span> <Link to="/catalogue" style={{ color: C.textMute }}>Catalogue</Link> <span style={{ color: C.borderStrong }}>/</span> <span style={{ color: C.textSoft }}>{p.sku}</span>
      </nav>

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 44, alignItems: 'start' }}>
        {/* image */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 32, position: 'sticky', top: 84, boxShadow: C.shadow }}>
          <div style={{ background: C.imageBg, borderRadius: 10, padding: 24, display: 'flex', justifyContent: 'center' }}>
            {p.image
              ? <img src={p.image} alt={p.sku} style={{ maxWidth: '100%', maxHeight: 340, objectFit: 'contain' }} />
              : <BearingTechnical accent={s.c} dmm={`${p.d} mm`} Dmm={`${p.D} mm`} Wmm={`${p.W} mm`} />}
          </div>
        </div>

        {/* details */}
        <div>
          <TempBadge series={s} style={{ fontSize: 13, padding: '4px 11px' }} />
          <h1 style={{ margin: '12px 0 6px', fontSize: 30, fontWeight: 700, color: C.ink }}>{p.sku}</h1>
          <div style={{ fontSize: 14, color: C.textMute, marginBottom: 18 }}>{s.temp} °C class · {s.range}</div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 6 }}>
            <span style={{ fontSize: 32, fontWeight: 700, color: C.ink }}>{eur(p.price)}</span>
            <span style={{ fontSize: 14, color: p.stock > 0 ? C.success : C.warn, fontWeight: 600 }}>
              {p.stock > 0 ? `In stock (${p.stock})` : 'Available on backorder'}
            </span>
          </div>
          <div style={{ fontSize: 13.5, color: C.textMute, marginBottom: 20 }}>Price excl. VAT · can be backordered</div>

          <p style={{ margin: '0 0 22px', fontSize: 15.5, lineHeight: 1.7, color: C.textSoft }}>{s.desc}</p>

          {/* add to cart */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'stretch', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${C.borderStrong}`, borderRadius: 8, background: '#fff' }}>
              <QtyBtn onClick={() => setQty((q) => Math.max(1, q - 1))} label="Decrease quantity">−</QtyBtn>
              <span style={{ fontSize: 16, fontWeight: 600, minWidth: 40, textAlign: 'center' }}>{qty}</span>
              <QtyBtn onClick={() => setQty((q) => q + 1)} label="Increase quantity">+</QtyBtn>
            </div>
            <button onClick={addToCart} className="link-hover"
              style={{ flex: 1, background: C.brand, color: '#fff', border: 'none', borderRadius: 8, padding: '14px', fontSize: 15.5, fontWeight: 600, cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.brandDark)}
              onMouseLeave={(e) => (e.currentTarget.style.background = C.brand)}>
              Add to cart — {eur(p.price * qty)}
            </button>
          </div>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 13, color: C.textMute, marginBottom: 28 }}>
            <span>✓ Secure checkout</span><span>✓ Visa / Mastercard</span><span>✓ Min. order €20</span>
          </div>

          {/* specs */}
          <h2 style={{ margin: '0 0 12px', fontSize: 17, fontWeight: 700, color: C.text }}>Technical specifications</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
            <tbody>
              {specs.map(([k, v], i) => (
                <tr key={k} style={{ background: i % 2 ? C.bgAlt : '#fff' }}>
                  <td style={{ padding: '11px 14px', fontSize: 14, color: C.textSoft, borderBottom: `1px solid ${C.border}` }}>{k}</td>
                  <td style={{ padding: '11px 14px', fontSize: 14, color: C.text, fontWeight: 500, textAlign: 'right', borderBottom: `1px solid ${C.border}`, ...(k === 'Part number' ? partNo : {}) }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ marginTop: 52 }}>
          <h2 style={{ margin: '0 0 18px', fontSize: 22, fontWeight: 700, color: C.ink }}>Related bearings</h2>
          <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
            {related.map((r) => <ProductCard key={r.sku} product={r} />)}
          </div>
        </div>
      )}
    </main>
  );
}

function QtyBtn({ children, onClick, label }) {
  return (
    <button onClick={onClick} aria-label={label} className="link-hover"
      style={{ background: 'none', border: 'none', color: C.text, width: 42, height: 46, fontSize: 20, cursor: 'pointer' }}
      onMouseEnter={(e) => (e.currentTarget.style.color = C.brand)}
      onMouseLeave={(e) => (e.currentTarget.style.color = C.text)}>{children}</button>
  );
}

function Center({ children }) {
  return <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 80, textAlign: 'center' }}>{children}</main>;
}
