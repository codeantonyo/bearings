import { Link, useNavigate } from 'react-router-dom';
import { C, eur, seriesOf, MIN_ORDER } from '../theme.js';
import { useCart } from '../context/CartContext.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { BearingMark } from '../components/BearingGraphics.jsx';
import { PrimaryButton, Alert, partNo } from '../components/ui.jsx';

export default function Cart() {
  const nav = useNavigate();
  const { cart, add, remove } = useCart();
  const { bySku } = useProducts();

  const rows = Object.entries(cart).map(([sku, qty]) => ({ p: bySku[sku], qty })).filter((r) => r.p);
  const subtotal = rows.reduce((a, r) => a + r.p.price * r.qty, 0);
  const belowMin = subtotal > 0 && subtotal < MIN_ORDER;

  return (
    <main className="page-pad" style={{ flex: 1, maxWidth: 1100, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '28px 24px 56px' }}>
      <h1 style={{ margin: '0 0 22px', fontSize: 28, fontWeight: 700, color: C.ink }}>Shopping cart</h1>

      {rows.length === 0 ? (
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 56, textAlign: 'center', boxShadow: C.shadow }}>
          <p style={{ margin: '0 0 18px', color: C.textSoft }}>Your cart is empty.</p>
          <PrimaryButton onClick={() => nav('/catalogue')}>Browse the catalogue</PrimaryButton>
        </div>
      ) : (
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 28, alignItems: 'start' }}>
          {/* items */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', boxShadow: C.shadow }}>
            {rows.map(({ p, qty }, i) => {
              const s = seriesOf(p.series);
              return (
                <div key={p.sku} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <Link to={`/product/${encodeURIComponent(p.sku)}`} style={{ width: 68, height: 68, background: C.imageBg, border: `1px solid ${C.border}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {p.image ? <img src={p.image} alt="" style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} /> : <BearingMark size={54} accent={s.c} />}
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={`/product/${encodeURIComponent(p.sku)}`} style={{ fontSize: 15, fontWeight: 600, color: C.text, textDecoration: 'none' }}>{p.sku}</Link>
                    <div style={{ ...partNo, fontSize: 12.5, color: C.textMute, marginTop: 3 }}>Ø {p.d} × {p.D} × {p.W} mm · {eur(p.price)} each</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${C.borderStrong}`, borderRadius: 8 }}>
                    <StepBtn onClick={() => add(p.sku, -1)} label="Decrease">−</StepBtn>
                    <span style={{ fontSize: 14.5, fontWeight: 600, minWidth: 30, textAlign: 'center' }}>{qty}</span>
                    <StepBtn onClick={() => add(p.sku, 1)} label="Increase">+</StepBtn>
                  </div>
                  <span style={{ fontSize: 15.5, fontWeight: 700, minWidth: 76, textAlign: 'right', color: C.text }}>{eur(p.price * qty)}</span>
                  <button onClick={() => remove(p.sku)} aria-label="Remove item" className="link-hover"
                    style={{ background: 'none', border: 'none', color: C.textMute, cursor: 'pointer', padding: 6, fontSize: 18, lineHeight: 1 }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = C.danger)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = C.textMute)}>×</button>
                </div>
              );
            })}
          </div>

          {/* summary */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 22, position: 'sticky', top: 84, boxShadow: C.shadow }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 17, fontWeight: 700, color: C.text }}>Order summary</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, marginBottom: 6 }}>
              <span style={{ color: C.textSoft }}>Subtotal</span>
              <span style={{ fontWeight: 700, color: C.text }}>{eur(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: C.textMute, marginBottom: 16 }}>
              <span>Shipping</span><span>Calculated at next step</span>
            </div>
            {belowMin && (
              <div style={{ marginBottom: 14 }}>
                <Alert tone="warn">Minimum order is €20. Add {eur(MIN_ORDER - subtotal)} more, or <Link to="/contact" style={{ color: C.warn, textDecoration: 'underline' }}>contact us</Link> for a specific order.</Alert>
              </div>
            )}
            <PrimaryButton disabled={belowMin} onClick={() => !belowMin && nav('/checkout')} style={{ width: '100%', padding: 14 }}>
              Proceed to checkout
            </PrimaryButton>
            <div style={{ textAlign: 'center', fontSize: 12.5, color: C.textMute, marginTop: 12 }}>Secure checkout · Visa / Mastercard</div>
          </div>
        </div>
      )}
    </main>
  );
}

function StepBtn({ children, onClick, label }) {
  return (
    <button onClick={onClick} aria-label={label} className="link-hover"
      style={{ background: 'none', border: 'none', color: C.text, width: 34, height: 36, fontSize: 16, cursor: 'pointer' }}
      onMouseEnter={(e) => (e.currentTarget.style.color = C.brand)}
      onMouseLeave={(e) => (e.currentTarget.style.color = C.text)}>{children}</button>
  );
}
