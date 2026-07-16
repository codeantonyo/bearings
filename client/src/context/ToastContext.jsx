import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { C } from '../theme.js';

const ToastCtx = createContext(null);
export const useToast = () => useContext(ToastCtx);

let counter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const remove = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const push = useCallback((toast) => {
    const id = ++counter;
    const duration = toast.duration ?? 3200;
    setToasts((t) => [...t.slice(-3), { id, duration, ...toast }]);
    setTimeout(() => remove(id), duration);
    return id;
  }, [remove]);

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <Viewport toasts={toasts} remove={remove} />
    </ToastCtx.Provider>
  );
}

function Viewport({ toasts, remove }) {
  const nav = useNavigate();
  return (
    <div style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 200, display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none' }}>
      {toasts.map((t) => (
        <div key={t.id}
          style={{ pointerEvents: 'auto', minWidth: 280, maxWidth: 360, background: '#fff', border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.success}`, borderRadius: 10, padding: '13px 15px', boxShadow: C.shadowHover, animation: 'toast-in .26s cubic-bezier(.2,.9,.3,1)', display: 'flex', alignItems: 'flex-start', gap: 11 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.success} strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }} aria-hidden>
            <circle cx="12" cy="12" r="10" /><path d="m8 12 3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14.5, fontWeight: 600, color: C.text }}>{t.title}</div>
            {t.subtitle && <div style={{ fontSize: 13.5, color: C.textSoft, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.subtitle}</div>}
            {t.action && (
              <button onClick={() => { nav(t.action.to); remove(t.id); }}
                style={{ marginTop: 7, background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13.5, fontWeight: 600, color: C.brand }}>
                {t.action.label} →
              </button>
            )}
          </div>
          <button onClick={() => remove(t.id)} aria-label="Dismiss"
            style={{ background: 'none', border: 'none', color: C.textMute, cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 2 }}>×</button>
        </div>
      ))}
    </div>
  );
}
