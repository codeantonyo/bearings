import { C, FONT } from '../theme.js';

export function Field({ label, hint, children }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>{label}</span>
      {children}
      {hint && <span style={{ display: 'block', fontSize: 12.5, color: C.textMute, marginTop: 5 }}>{hint}</span>}
    </label>
  );
}

export function TextInput(props) {
  return (
    <input {...props}
      style={{ width: '100%', boxSizing: 'border-box', background: '#fff', border: `1px solid ${C.borderStrong}`, borderRadius: 8, padding: '11px 13px', color: C.text, fontSize: 15, ...(props.style || {}) }} />
  );
}

export function PrimaryButton({ children, style, disabled, ...props }) {
  return (
    <button {...props} disabled={disabled} className="link-hover"
      style={{ background: disabled ? '#c4cbd3' : C.brand, color: '#fff', border: 'none', borderRadius: 8, padding: '12px 22px', fontSize: 15, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', ...style }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = C.brandDark; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.background = C.brand; }}>
      {children}
    </button>
  );
}

export function SecondaryButton({ children, style, ...props }) {
  return (
    <button {...props} className="link-hover"
      style={{ background: '#fff', border: `1px solid ${C.borderStrong}`, color: C.text, borderRadius: 8, padding: '11px 20px', fontSize: 15, fontWeight: 600, cursor: 'pointer', ...style }}
      onMouseEnter={(e) => { e.currentTarget.style.background = C.bgAlt; e.currentTarget.style.borderColor = C.textMute; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.borderStrong; }}>
      {children}
    </button>
  );
}

export function Eyebrow({ children }) {
  return <div className="eyebrow" style={{ color: C.brand, marginBottom: 12 }}>{children}</div>;
}

// Small temperature-class pill (coloured text on a faint tint).
export function TempBadge({ series, style }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${series.c}16`, color: series.c, borderRadius: 6, padding: '3px 9px', fontSize: 12.5, fontWeight: 600, ...style }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: series.c }} />
      {series.temp} °C
    </span>
  );
}

export function Alert({ tone = 'warn', children }) {
  const tones = {
    warn: { color: C.warn, bg: C.warnTint, border: '#f0dcae' },
    danger: { color: C.danger, bg: C.dangerTint, border: '#f2cabf' },
    ok: { color: C.success, bg: C.successTint, border: '#bfe4d3' },
    info: { color: C.textSoft, bg: C.bgAlt, border: C.border },
  };
  const t = tones[tone] || tones.warn;
  return (
    <div style={{ fontSize: 14, color: t.color, background: t.bg, border: `1px solid ${t.border}`, borderRadius: 8, padding: '11px 14px', lineHeight: 1.5 }}>
      {children}
    </div>
  );
}

export const partNo = { fontFamily: FONT.mono, letterSpacing: '.01em' };
