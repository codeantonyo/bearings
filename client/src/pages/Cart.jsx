import { useNavigate } from 'react-router-dom';
import { C, FONT, eur, seriesOf, MIN_ORDER } from '../theme.js';
import { useCart } from '../context/CartContext.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { PrimaryButton, Alert } from '../components/ui.jsx';

export default function Cart() {
  const nav = useNavigate();
  const { cart, add, remove } = useCart();
  const { bySku } = useProducts();

  const rows = Object.entries(cart).map(([sku, qty]) => ({ p: bySku[sku], qty })).filter((r) => r.p);
  const subtotal = rows.reduce((a, r) => a + r.p.price * r.qty, 0);
  const belowMin = subtotal > 0 && subtotal < MIN_ORDER;

  return (
    <main style={{ flex: 1, maxWidth: 900, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '48px 40px 72px' }}>
      <h1 style={{ margin: '0 0 28px', fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>Cart</h1>

      {rows.length === 0 ? (
        <div style={{ border: `1px dashed ${C.faint3}`, borderRadius: 12, padding: 72, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 12, letterSpacing: 2, color: C.dim }}>NO PRODUCTS IN THE CART</span>
          <PrimaryButton onClick={() => nav('/catalogue')} style={{ padding: '13px 26px', fontSize: 11 }}>BROWSE CATALOGUE →</PrimaryButton>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {rows.map(({ p, qty }) => {
              const s = seriesOf(p.series);
              return (
                <div key={p.sku} style={{ display: 'flex', alignItems: 'center', gap: 18, background: C.panel, border: `1px solid ${C.faint}`, borderRadius: 10, padding: '16px 20px' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: s.c, boxShadow: `0 0 12px ${s.c}` }} />
                  <button onClick={() => nav(`/product/${encodeURIComponent(p.sku)}`)} className="beco-hover"
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', flex: 1 }}>
                    <div style={{ fontFamily: FONT.mono, fontSize: 13, color: C.text }}>{p.sku}</div>
                    <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.dim, marginTop: 3 }}>{p.d} × {p.D} × {p.W} mm · {eur(p.price)} each</div>
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${C.faint3}`, borderRadius: 6 }}>
                    <StepBtn onClick={() => add(p.sku, -1)}>−</StepBtn>
                    <span style={{ fontFamily: FONT.mono, fontSize: 13, minWidth: 26, textAlign: 'center' }}>{qty}</span>
                    <StepBtn onClick={() => add(p.sku, 1)}>+</StepBtn>
                  </div>
                  <span style={{ fontFamily: FONT.mono, fontSize: 14, fontWeight: 500, minWidth: 76, textAlign: 'right' }}>{eur(p.price * qty)}</span>
                  <button onClick={() => remove(p.sku)} className="beco-hover"
                    style={{ background: 'none', border: 'none', color: C.dim, fontSize: 16, cursor: 'pointer', padding: 4 }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = C.ember)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = C.dim)}>✕</button>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 24, background: C.panel2, border: `1px solid ${C.faint}`, borderRadius: 12, padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT.mono, fontSize: 13 }}>
              <span style={{ color: C.muted }}>SUBTOTAL</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: C.text }}>{eur(subtotal)}</span>
            </div>
            {belowMin && (
              <Alert tone="warn">⚠ MINIMUM ORDER IS 20 € — ADD {eur(MIN_ORDER - subtotal)} MORE, OR <a href="mailto:office@becobearings.com" style={{ color: C.amber, textDecoration: 'underline' }}>CONTACT US</a> FOR A SPECIFIC ORDER.</Alert>
            )}
            <PrimaryButton disabled={belowMin} onClick={() => !belowMin && nav('/checkout')} style={{ padding: 17, width: '100%' }}>PROCEED TO CHECKOUT →</PrimaryButton>
            <div style={{ fontFamily: FONT.mono, fontSize: 10, letterSpacing: 1, color: C.dim, textAlign: 'center' }}>GUARANTEED SAFE CHECKOUT · VISA / MASTERCARD</div>
          </div>
        </>
      )}
    </main>
  );
}

function StepBtn({ children, onClick }) {
  return (
    <button onClick={onClick} className="beco-hover"
      style={{ background: 'none', border: 'none', color: C.text, width: 34, height: 34, fontSize: 15, cursor: 'pointer' }}
      onMouseEnter={(e) => (e.currentTarget.style.color = C.ember)}
      onMouseLeave={(e) => (e.currentTarget.style.color = C.text)}>{children}</button>
  );
}
