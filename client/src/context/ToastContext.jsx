import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, FONT } from '../theme.js';

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
    <div style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 200, display: 'flex', flexDirection: 'column', gap: 12, pointerEvents: 'none' }}>
      {toasts.map((t) => (
        <div key={t.id} className="beco-hover"
          style={{ pointerEvents: 'auto', minWidth: 280, maxWidth: 340, background: C.panel, border: `1px solid ${t.color || C.faint3}`, borderRadius: 10, padding: '14px 16px', boxShadow: '0 12px 40px rgba(0,0,0,.5)', animation: 'toast-in .28s cubic-bezier(.2,.9,.3,1)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <span style={{ marginTop: 4, width: 10, height: 10, borderRadius: '50%', flexShrink: 0, background: t.color || C.ember, boxShadow: `0 0 10px ${t.color || C.ember}` }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 2, color: t.color || C.ember }}>{t.title}</div>
              {t.subtitle && <div style={{ fontFamily: FONT.mono, fontSize: 12, color: C.text, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.subtitle}</div>}
              {t.action && (
                <button onClick={() => { nav(t.action.to); remove(t.id); }}
                  style={{ marginTop: 8, background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: FONT.mono, fontSize: 10, letterSpacing: 1, color: C.ember }}>
                  {t.action.label}
                </button>
              )}
            </div>
            <button onClick={() => remove(t.id)} aria-label="Dismiss"
              style={{ background: 'none', border: 'none', color: C.dim, cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 2 }}>✕</button>
          </div>
          <div style={{ position: 'absolute', left: 0, bottom: 0, height: 2, width: '100%', background: t.color || C.ember, transformOrigin: 'left', animation: `toast-bar ${t.duration}ms linear forwards`, opacity: 0.5 }} />
        </div>
      ))}
    </div>
  );
}
