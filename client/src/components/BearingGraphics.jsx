// Clean, static technical illustration of a ball bearing — a neutral catalogue
// placeholder shown until real product photos are uploaded. No animation, no
// glow: it reads as a professional line drawing on a light background.

function Balls({ r, ball, fill = '#d6dce4', stroke = '#b7c0cb' }) {
  const pts = [
    [r, 0], [r * 0.707, r * 0.707], [0, r], [-r * 0.707, r * 0.707],
    [-r, 0], [-r * 0.707, -r * 0.707], [0, -r], [r * 0.707, -r * 0.707],
  ];
  return pts.map(([x, y], i) => (
    <circle key={i} cx={(60 + x).toFixed(1)} cy={(60 + y).toFixed(1)} r={ball} fill={fill} stroke={stroke} strokeWidth="1" />
  ));
}

export function BearingMark({ size = 96, accent = '#c8d0da' }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Ball bearing" style={{ display: 'block' }}>
      <circle cx="60" cy="60" r="52" fill="#ffffff" stroke="#cad2dc" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="52" fill="none" stroke={accent} strokeWidth="2" opacity="0.85" />
      <circle cx="60" cy="60" r="41" fill="#eef2f6" stroke="#cad2dc" strokeWidth="1.25" />
      <Balls r={32} ball={7} />
      <circle cx="60" cy="60" r="23" fill="#ffffff" stroke="#cad2dc" strokeWidth="1.25" />
      <circle cx="60" cy="60" r="14" fill="#e8edf2" stroke="#cad2dc" strokeWidth="1.25" />
    </svg>
  );
}

// Larger version with dimension callouts for the product page.
export function BearingTechnical({ accent = '#c8d0da', dmm, Dmm, Wmm }) {
  return (
    <svg viewBox="0 0 320 300" width="100%" role="img" aria-label="Bearing dimensions" style={{ display: 'block' }}>
      <g transform="translate(160,140)">
        <circle r="115" fill="#ffffff" stroke="#cad2dc" strokeWidth="1.5" />
        <circle r="115" fill="none" stroke={accent} strokeWidth="2.5" opacity="0.85" />
        <circle r="90" fill="#eef2f6" stroke="#cad2dc" strokeWidth="1.25" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
          const rad = (a * Math.PI) / 180;
          return <circle key={a} cx={(70 * Math.cos(rad)).toFixed(1)} cy={(70 * Math.sin(rad)).toFixed(1)} r="15" fill="#d6dce4" stroke="#b7c0cb" strokeWidth="1" />;
        })}
        <circle r="48" fill="#ffffff" stroke="#cad2dc" strokeWidth="1.25" />
        <circle r="30" fill="#e8edf2" stroke="#cad2dc" strokeWidth="1.25" />
      </g>
      <g fontFamily="'IBM Plex Mono', monospace" fontSize="11" fill="#77828f">
        <line x1="45" y1="280" x2="275" y2="280" stroke="#c4ccd6" strokeWidth="1" />
        <line x1="45" y1="274" x2="45" y2="286" stroke="#c4ccd6" strokeWidth="1" />
        <line x1="275" y1="274" x2="275" y2="286" stroke="#c4ccd6" strokeWidth="1" />
        <text x="160" y="296" textAnchor="middle">D = {Dmm}</text>
        <text x="160" y="145" textAnchor="middle" fill="#4d5966">d = {dmm}</text>
        <text x="300" y="40" textAnchor="end">W = {Wmm}</text>
      </g>
    </svg>
  );
}
