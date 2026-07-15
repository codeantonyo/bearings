import { useEffect, useMemo, useRef, useState } from 'react';
import { C, FONT } from '../theme.js';

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
    const q = query.trim().toLowerCase();
    const base = !q ? options : options.filter((o) => o.toLowerCase().includes(q));
    return base.slice(0, 80);
  }, [query, options]);

  // Close on outside click.
  useEffect(() => {
    function onDoc(e) { if (wrapRef.current && !wrapRef.current.contains(e.target)) close(); }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => { setHi(0); }, [query, open]);

  function close() { setOpen(false); setQuery(''); }

  function commit(v) { onChange(v); close(); }

  function onBlurCommit() {
    // When free text is allowed, keep whatever was typed.
    if (allowCustom && query.trim()) onChange(query.trim());
  }

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
        style={{ width: '100%', boxSizing: 'border-box', background: disabled ? '#0e1116' : C.panel, border: `1px solid ${open ? C.ember : C.faint2}`, borderRadius: 8, padding: '12px 34px 12px 14px', color: value ? C.text : C.muted, fontFamily: FONT.mono, fontSize: 12, cursor: disabled ? 'not-allowed' : 'text' }}
      />
      <span style={{ position: 'absolute', right: 12, top: '50%', transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`, transition: 'transform .15s', color: C.dim, fontSize: 10, pointerEvents: 'none' }}>▾</span>

      {open && !disabled && (
        <div ref={listRef}
          style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 60, maxHeight: 240, overflowY: 'auto', background: C.panel, border: `1px solid ${C.faint3}`, borderRadius: 8, boxShadow: '0 16px 40px rgba(0,0,0,.55)', animation: 'fade-in .12s ease' }}>
          {loading ? (
            <Note>Loading…</Note>
          ) : filtered.length === 0 ? (
            <Note>{allowCustom && query.trim() ? `Use “${query.trim()}”` : emptyText}</Note>
          ) : (
            filtered.map((o, i) => (
              <button key={o} type="button"
                onMouseDown={(e) => { e.preventDefault(); commit(o); }}
                onMouseEnter={() => setHi(i)}
                style={{ display: 'block', width: '100%', textAlign: 'left', background: i === hi ? '#1a1f26' : 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,.04)', padding: '10px 14px', color: o === value ? C.ember : C.text, fontFamily: FONT.mono, fontSize: 12, cursor: 'pointer' }}>
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
  return <div style={{ padding: '12px 14px', fontFamily: FONT.mono, fontSize: 11, color: C.dim }}>{children}</div>;
}
