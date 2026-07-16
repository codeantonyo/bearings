import { useEffect, useMemo, useRef, useState } from 'react';
import { C } from '../theme.js';

// Searchable dropdown. Type to filter a (possibly large) option list, click or
// press Enter to choose. Falls back to accepting free text when `allowCustom`
// is set, so an unreachable API or a missing town never blocks checkout.
export default function Combobox({
  value, onChange, options = [], placeholder = 'Select…',
  disabled = false, loading = false, allowCustom = false, emptyText = 'No matches',
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [hi, setHi] = useState(0);
  const wrapRef = useRef(null);
  const listRef = useRef(null);

  const filtered = useMemo(() => {
    const qq = query.trim().toLowerCase();
    const base = !qq ? options : options.filter((o) => o.toLowerCase().includes(qq));
    return base.slice(0, 80);
  }, [query, options]);

  useEffect(() => {
    function onDoc(e) { if (wrapRef.current && !wrapRef.current.contains(e.target)) close(); }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => { setHi(0); }, [query, open]);

  function close() { setOpen(false); setQuery(''); }
  function commit(v) { onChange(v); close(); }
  function onBlurCommit() { if (allowCustom && query.trim()) onChange(query.trim()); }

  function onKeyDown(e) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) { setOpen(true); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setHi((i) => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[hi]) commit(filtered[hi]);
      else if (allowCustom && query.trim()) commit(query.trim());
    } else if (e.key === 'Escape') { close(); }
  }

  useEffect(() => {
    const el = listRef.current?.children?.[hi];
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [hi]);

  const shown = open ? query : (value || '');

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <input
        value={shown}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => !disabled && setOpen(true)}
        onBlur={onBlurCommit}
        onKeyDown={onKeyDown}
        disabled={disabled}
        placeholder={loading ? 'Loading…' : placeholder}
        style={{ width: '100%', boxSizing: 'border-box', background: disabled ? C.bgAlt : '#fff', border: `1px solid ${open ? C.brand : C.borderStrong}`, borderRadius: 8, padding: '11px 34px 11px 13px', color: value ? C.text : C.textMute, fontSize: 15, cursor: disabled ? 'not-allowed' : 'text' }}
      />
      <span style={{ position: 'absolute', right: 12, top: '50%', transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`, transition: 'transform .15s', color: C.textMute, fontSize: 11, pointerEvents: 'none' }}>▾</span>

      {open && !disabled && (
        <div ref={listRef}
          style={{ position: 'absolute', top: 'calc(100% + 5px)', left: 0, right: 0, zIndex: 60, maxHeight: 240, overflowY: 'auto', background: '#fff', border: `1px solid ${C.borderStrong}`, borderRadius: 8, boxShadow: C.shadowHover, animation: 'fade-in .12s ease' }}>
          {loading ? (
            <Note>Loading…</Note>
          ) : filtered.length === 0 ? (
            <Note>{allowCustom && query.trim() ? `Use “${query.trim()}”` : emptyText}</Note>
          ) : (
            filtered.map((o, i) => (
              <button key={o} type="button"
                onMouseDown={(e) => { e.preventDefault(); commit(o); }}
                onMouseEnter={() => setHi(i)}
                style={{ display: 'block', width: '100%', textAlign: 'left', background: i === hi ? C.bgAlt : '#fff', border: 'none', borderBottom: `1px solid ${C.border}`, padding: '10px 13px', color: o === value ? C.brand : C.text, fontSize: 14.5, cursor: 'pointer' }}>
                {o}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function Note({ children }) {
  return <div style={{ padding: '12px 13px', fontSize: 14, color: C.textMute }}>{children}</div>;
}
