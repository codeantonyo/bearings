import { C, FONT } from '../theme.js';

export function Field({ label, children }) {
  return (
    <div>
      <div style={{ fontFamily: FONT.mono, fontSize: 10, letterSpacing: 2, color: C.dim, marginBottom: 7 }}>{label}</div>
      {children}
    </div>
  );
}

export function TextInput({ dark, ...props }) {
  return (
    <input {...props}
      style={{ width: '100%', boxSizing: 'border-box', background: dark ? C.panel2 : C.panel, border: `1px solid ${C.faint2}`, borderRadius: 8, padding: '12px 14px', color: C.text, fontFamily: FONT.mono, fontSize: 12, ...(props.style || {}) }} />
  );
}

export function PrimaryButton({ children, style, disabled, ...props }) {
  return (
    <button {...props} disabled={disabled} className="beco-hover"
      style={{ background: disabled ? C.dim : C.ember, color: '#0b0d10', border: 'none', borderRadius: 6, padding: '15px 28px', fontFamily: FONT.mono, fontSize: 12, letterSpacing: 2, fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer', ...style }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = C.emberSoft; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.background = C.ember; }}>
      {children}
    </button>
  );
}

export function GhostButton({ children, style, ...props }) {
  return (
    <button {...props} className="beco-hover"
      style={{ background: 'none', border: `1px solid ${C.faint4}`, color: C.text, borderRadius: 6, padding: '11px 22px', fontFamily: FONT.mono, fontSize: 10, letterSpacing: 2, cursor: 'pointer', ...style }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.ember; e.currentTarget.style.color = C.ember; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.faint4; e.currentTarget.style.color = C.text; }}>
      {children}
    </button>
  );
}

export function Eyebrow({ children, color = C.ember }) {
  return <div style={{ fontFamily: FONT.mono, fontSize: 12, letterSpacing: 3, color, marginBottom: 14 }}>{children}</div>;
}

export function Alert({ tone = 'warn', children }) {
  const tones = {
    warn: { color: C.amber, border: 'rgba(255,178,77,.35)' },
    error: { color: '#ff7a6b', border: 'rgba(255,122,107,.4)' },
    ok: { color: C.green, border: 'rgba(125,219,138,.35)' },
  };
  const t = tones[tone] || tones.warn;
  return (
    <div style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1, color: t.color, border: `1px solid ${t.border}`, borderRadius: 8, padding: '12px 16px' }}>
      {children}
    </div>
  );
}
