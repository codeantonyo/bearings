import { useNavigate } from 'react-router-dom';
import { C, FONT, eur, seriesOf } from '../theme.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { BearingIcon } from './BearingGraphics.jsx';

// Product thumbnail: uploaded photo when present, otherwise the generated
// bearing SVG (until real photos are added via the admin panel).
function Thumb({ p, s, size }) {
  if (p.image) {
    return (
      <img
        src={p.image}
        alt={p.sku}
        style={{ width: size, height: size, objectFit: 'contain', alignSelf: 'center', filter: `drop-shadow(0 0 12px ${s.c}44)` }}
      />
    );
  }
  return <BearingIcon color={s.c} size={size} />;
}

export default function ProductCard({ product: p, variant = 'shop' }) {
  const nav = useNavigate();
  const { add } = useCart();
  const { push } = useToast();
  const s = seriesOf(p.series);
  const open = () => nav(`/product/${encodeURIComponent(p.sku)}`);
  const onAdd = (e) => {
    e.stopPropagation();
    add(p.sku, 1);
    push({ title: 'ADDED TO CART', subtitle: p.sku, color: s.c, action: { label: 'VIEW CART →', to: '/cart' } });
  };

  const dims = `${p.d} × ${p.D} × ${p.W} mm`;

  if (variant === 'related') {
    return (
      <div onClick={open} className="beco-hover"
        style={{ background: C.panel, border: `1px solid ${C.faint}`, borderRadius: 10, padding: 18, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8 }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = s.c)}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.faint)}>
        <div style={{ fontFamily: FONT.mono, fontSize: 12, color: C.text }}>{p.sku}</div>
        <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.dim }}>{dims}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>{eur(p.price)}</span>
          <AddBtn color={s.c} onClick={onAdd} small />
        </div>
      </div>
    );
  }

  const isShop = variant === 'shop';
  return (
    <div onClick={open} className="beco-hover"
      style={{ background: C.panel, border: `1px solid ${C.faint}`, borderRadius: 10, padding: isShop ? 20 : 22, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: isShop ? 10 : 12 }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = s.c)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.faint)}>
      {isShop && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 10, letterSpacing: 1, color: s.c, border: `1px solid ${s.c}55`, borderRadius: 999, padding: '4px 10px' }}>{s.temp} °C</span>
          <span style={{ fontFamily: FONT.mono, fontSize: 10, color: p.stock > 0 ? C.dim : C.amber }}>
            {p.stock > 0 ? `${p.stock} IN STOCK` : 'BACKORDER'}
          </span>
        </div>
      )}
      <Thumb p={p} s={s} size={isShop ? 96 : 110} />
      <div style={{ fontFamily: FONT.mono, fontSize: 13, color: C.text, letterSpacing: 0.5 }}>{p.sku}</div>
      <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.dim }}>{dims}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
        <span style={{ fontSize: isShop ? 17 : 18, fontWeight: 700 }}>{eur(p.price)}</span>
        <AddBtn color={s.c} onClick={onAdd} />
      </div>
    </div>
  );
}

function AddBtn({ color, onClick, small }) {
  return (
    <button onClick={onClick} className="beco-hover"
      style={{ background: 'none', border: `1px solid ${color}`, color, borderRadius: 6, padding: small ? '5px 11px' : '7px 14px', fontFamily: FONT.mono, fontSize: 10, letterSpacing: 1, cursor: 'pointer' }}
      onMouseEnter={(e) => { e.currentTarget.style.background = color; e.currentTarget.style.color = '#0b0d10'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = color; }}>
      + ADD
    </button>
  );
}
