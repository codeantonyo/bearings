import { useNavigate } from 'react-router-dom';
import { C, FONT, eur, seriesOf } from '../theme.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { BearingMark } from './BearingGraphics.jsx';
import { TempBadge, partNo } from './ui.jsx';

export default function ProductCard({ product: p }) {
  const nav = useNavigate();
  const { add } = useCart();
  const { push } = useToast();
  const s = seriesOf(p.series);
  const open = () => nav(`/product/${encodeURIComponent(p.sku)}`);
  const onAdd = (e) => {
    e.stopPropagation();
    add(p.sku, 1);
    push({ title: 'Added to cart', subtitle: p.sku, action: { label: 'View cart', to: '/cart' } });
  };

  return (
    <div onClick={open} className="card-hover"
      style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column', boxShadow: C.shadow }}>
      {/* image well */}
      <div style={{ position: 'relative', background: C.imageBg, borderBottom: `1px solid ${C.border}`, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {p.image
          ? <img src={p.image} alt={p.sku} style={{ maxHeight: '82%', maxWidth: '82%', objectFit: 'contain' }} />
          : <BearingMark size={104} accent={s.c} />}
        <span style={{ position: 'absolute', top: 10, left: 10 }}><TempBadge series={s} /></span>
      </div>

      {/* body */}
      <div style={{ padding: '14px 15px 15px', display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.text, lineHeight: 1.3 }}>{p.sku}</div>
        <div style={{ ...partNo, fontSize: 12.5, color: C.textMute }}>Ø {p.d} × {p.D} × {p.W} mm</div>
        <div style={{ fontSize: 12.5, color: p.stock > 0 ? C.success : C.warn, fontWeight: 500, marginTop: 1 }}>
          {p.stock > 0 ? `In stock (${p.stock})` : 'Available on backorder'}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
          <span style={{ fontSize: 19, fontWeight: 700, color: C.text }}>{eur(p.price)}</span>
          <button onClick={onAdd} className="link-hover"
            style={{ background: C.brand, color: '#fff', border: 'none', borderRadius: 7, padding: '9px 14px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.brandDark)}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.brand)}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
