// SVG gradients defined once at the app root and referenced by url(#id).
export function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
      <defs>
        <radialGradient id="mgrad">
          <stop offset="0%" stopColor="#14171b" />
          <stop offset="55%" stopColor="#272c33" />
          <stop offset="80%" stopColor="#4c545e" />
          <stop offset="93%" stopColor="#1d2126" />
          <stop offset="100%" stopColor="#0f1114" />
        </radialGradient>
        <radialGradient id="bgrad" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#c3c8d0" />
          <stop offset="55%" stopColor="#6a717a" />
          <stop offset="100%" stopColor="#23262b" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// The 8 rolling balls at radius r around the origin.
function Balls({ r, ball }) {
  const pts = [
    [r, 0], [r * 0.707, r * 0.707], [0, r], [-r * 0.707, r * 0.707],
    [-r, 0], [-r * 0.707, -r * 0.707], [0, -r], [r * 0.707, -r * 0.707],
  ];
  return pts.map(([x, y], i) => (
    <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={ball} fill="url(#bgrad)" />
  ));
}

// Compact bearing icon used on product cards.
export function BearingIcon({ color, glowPx = 12, size = 110 }) {
  return (
    <svg viewBox="0 0 120 120" style={{ width: size, alignSelf: 'center', filter: `drop-shadow(0 0 ${glowPx}px ${color}66)` }}>
      <circle cx="60" cy="60" r="56" fill="url(#mgrad)" />
      <circle cx="60" cy="60" r="42" fill="#12151a" />
      <circle cx="60" cy="60" r="34" fill="url(#mgrad)" />
      <circle cx="60" cy="60" r="22" fill="#0b0d10" />
      <g transform="translate(60,60)"><Balls r={38} ball={6} /></g>
      <circle cx="60" cy="60" r="56" fill="none" stroke={color} strokeWidth="1.5" opacity="0.85" />
    </svg>
  );
}

// Large, animated, dimensioned render on the product detail page.
export function BearingBig({ color, glowPx = 34, dmm, Dmm, Wmm }) {
  return (
    <svg viewBox="0 0 400 400" style={{ width: '100%', filter: `drop-shadow(0 0 ${glowPx}px ${color}55)` }}>
      <g transform="translate(200,190)">
        <circle r="140" fill="url(#mgrad)" />
        <circle r="104" fill="#0d1014" />
        <circle r="86" fill="url(#mgrad)" />
        <circle r="56" fill="#0b0d10" />
        <g style={{ animation: 'spin 20s linear infinite', transformOrigin: '0 0' }}>
          <Balls r={95} ball={15} />
        </g>
        <circle r="140" fill="none" stroke={color} strokeWidth="1.5" opacity="0.9" />
        <circle r="56" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="1" />
      </g>
      <g fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="#8a8f96">
        <line x1="60" y1="368" x2="340" y2="368" stroke="#5a5f66" strokeWidth="1" />
        <line x1="60" y1="362" x2="60" y2="374" stroke="#5a5f66" strokeWidth="1" />
        <line x1="340" y1="362" x2="340" y2="374" stroke="#5a5f66" strokeWidth="1" />
        <text x="200" y="360" textAnchor="middle">D = {Dmm}</text>
        <line x1="144" y1="190" x2="256" y2="190" stroke="#5a5f66" strokeWidth="1" strokeDasharray="3 4" />
        <text x="200" y="180" textAnchor="middle" fill="#e8e6e1">d = {dmm}</text>
        <text x="368" y="60" textAnchor="end">W = {Wmm}</text>
      </g>
    </svg>
  );
}

// The exploded three-ring hero illustration on the home page.
export function BearingHero() {
  return (
    <svg viewBox="0 0 620 560" style={{ width: '100%', maxWidth: 600, filter: 'drop-shadow(0 0 30px rgba(255,92,31,.25))' }}>
      <g transform="translate(210,180)">
        <circle r="150" fill="url(#mgrad)" />
        <circle r="110" fill="#0b0d10" />
        <circle r="150" fill="none" stroke="#ff5c1f" strokeWidth="1.5" opacity="0.8" />
        <circle r="110" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="1" />
      </g>
      <g transform="translate(300,285)">
        <g style={{ animation: 'spin 26s linear infinite', transformOrigin: '0 0' }}>
          <circle r="95" fill="none" stroke="#8a8f96" strokeWidth="1" strokeDasharray="4 7" />
          <Balls r={95} ball={16} />
        </g>
      </g>
      <g transform="translate(390,390)">
        <circle r="78" fill="url(#mgrad)" />
        <circle r="46" fill="#0b0d10" />
        <circle r="78" fill="none" stroke="#ff5c1f" strokeWidth="1.5" opacity="0.6" />
        <circle r="46" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="1" />
      </g>
      <g fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="#8a8f96" letterSpacing="1">
        <line x1="404" y1="70" x2="330" y2="118" stroke="#5a5f66" strokeWidth="1" />
        <text x="410" y="68">OUTER RACE — 100Cr6</text>
        <line x1="454" y1="244" x2="400" y2="272" stroke="#5a5f66" strokeWidth="1" />
        <text x="460" y="242">CAGE — C4 CLEARANCE</text>
        <line x1="440" y1="500" x2="440" y2="452" stroke="#5a5f66" strokeWidth="1" />
        <text x="440" y="518" textAnchor="middle">INNER RACE — ZZ SEAT</text>
      </g>
    </svg>
  );
}
