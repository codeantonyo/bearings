// Design tokens lifted directly from the Beco prototype.
export const C = {
  bg: '#0b0d10',
  panel: '#12151a',
  panel2: '#0d1014',
  text: '#e8e6e1',
  muted: '#8a8f96',
  dim: '#5a5f66',
  faint: 'rgba(255,255,255,.08)',
  faint2: 'rgba(255,255,255,.12)',
  faint3: 'rgba(255,255,255,.15)',
  faint4: 'rgba(255,255,255,.2)',
  ember: '#ff5c1f',
  emberSoft: '#ffe9cf',
  amber: '#ffb24d',
  green: '#7ddb8a',
};

export const FONT = {
  display: "'Space Grotesk', sans-serif",
  mono: "'IBM Plex Mono', monospace",
};

// Temperature classes — key, temp, label, range, heat-ramp color, technical
// blurb and full description. Mirrors SERIES in the prototype so the product
// pages read exactly as designed. The API returns only the series key.
export const SERIES = {
  s200: {
    key: 's200', temp: 200, label: 'BHTS ZZ C4 200', range: '−30 … +200 °C', c: '#e0512e',
    tech: 'ZZ STEEL SHIELDS · C4 CLEARANCE · STABILIZED RINGS · HT GREASE',
    desc: 'Built on standard deep-groove geometry with a dedicated stabilization treatment, C4 radial clearance, high-temperature grease and ZZ steel shields. Runs safely from −30 °C to +200 °C and shrugs off the occasional, unplanned overheating that standard bearings never survive. Identical to the BHTS 2RS C4 VT 200 — the ZZ shield simply saves cost over the Viton-sealed version.',
  },
  s280: {
    key: 's280', temp: 280, label: 'BHTS ZZ C4 280', range: '−30 … +280 °C', c: '#ff7a2f',
    tech: 'ZZ STEEL SHIELDS · C4 CLEARANCE · SOLID-FILM HT GREASE',
    desc: 'Every treatment of the 200 class — stabilized rings, C4 clearance, ZZ shields — pushed further with a solid-film high-temperature grease for continuous duty up to +280 °C. The workhorse class for steel, ceramic and papermaking lines.',
  },
  s330: {
    key: 's330', temp: 330, label: 'BHTS 330', range: 'UP TO +330 °C', c: '#ffb24d',
    tech: 'SOLID HT LUBRICANT · EXTENDED CLEARANCE · FULL STABILIZATION',
    desc: 'The furnace-side specialist. Solid high-temperature lubricant instead of grease, extended radial clearance and full ring stabilization for continuous operation at +330 °C — kiln cars, oven conveyors, bakery and ceramic tunnels.',
  },
  s350: {
    key: 's350', temp: 350, label: 'BHTS ZZ C4 350 PLUS', range: 'UP TO +350 °C', c: '#ffe9cf',
    tech: 'BECO PLUS · SPECIAL CAGE · SOLID LUBRICANT · MAX STABILIZATION',
    desc: 'The flagship BECO PLUS class. Special cage, solid lubricant and complete dimensional stabilization for continuous duty at +350 °C — the highest rating in the BECO range, for applications where nothing else survives.',
  },
};

export const seriesOf = (key) => SERIES[key] || SERIES.s200;

export const MIN_ORDER = 20;

export const eur = (n) => `${Number(n).toFixed(2)} €`;
