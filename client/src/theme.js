// Light, professional B2B palette. Neutral greys + slate text, with BECO
// orange kept only as a restrained accent for primary actions and links.
export const C = {
  // surfaces
  bg: '#ffffff',
  bgAlt: '#f4f6f8',        // page / section background
  surface: '#ffffff',      // cards
  imageBg: '#f5f7fa',      // product image wells

  // text
  text: '#1b2634',         // primary (dark slate, not pure black)
  textSoft: '#4d5966',     // secondary
  textMute: '#77828f',     // tertiary / captions

  // lines
  border: '#e3e7ec',
  borderStrong: '#d2d8e0',

  // brand accent
  brand: '#dd5321',        // BECO orange, slightly deepened for contrast
  brandDark: '#b8410f',    // hover / active
  brandTint: '#fdefe8',    // faint orange background

  // dark accents (utility bar, footer)
  ink: '#16212e',
  inkSoft: '#26313f',

  // status
  success: '#12805a',
  successTint: '#e7f4ee',
  warn: '#9a6a12',
  warnTint: '#fbf1dd',
  danger: '#c23c2b',
  dangerTint: '#fbe9e6',

  // shadows
  shadow: '0 1px 2px rgba(16,24,40,.05), 0 1px 3px rgba(16,24,40,.08)',
  shadowHover: '0 6px 18px rgba(16,24,40,.12)',
};

export const FONT = {
  sans: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace",
};

// Temperature classes. Colours are muted, readable badge tones (used as small
// pills/dots — no glow). Descriptions preserve BECO's authentic catalogue copy.
export const SERIES = {
  s200: {
    key: 's200', temp: 200, label: 'BHTS ZZ C4 200', range: '−30 … +200 °C', c: '#c2410c',
    tech: 'ZZ steel shields · C4 clearance · stabilized rings · HT grease',
    desc: 'Built on standard deep-groove geometry with a dedicated stabilization treatment, C4 radial clearance, high-temperature grease and ZZ steel shields. Runs safely from −30 °C to +200 °C and shrugs off the occasional, unplanned overheating that standard bearings never survive. Identical to the BHTS 2RS C4 VT 200 — the ZZ shield simply saves cost over the Viton-sealed version.',
  },
  s280: {
    key: 's280', temp: 280, label: 'BHTS ZZ C4 280', range: '−30 … +280 °C', c: '#ea580c',
    tech: 'ZZ steel shields · C4 clearance · solid-film HT grease',
    desc: 'Every treatment of the 200 class — stabilized rings, C4 clearance, ZZ shields — pushed further with a solid-film high-temperature grease for continuous duty up to +280 °C. The workhorse class for steel, ceramic and papermaking lines.',
  },
  s330: {
    key: 's330', temp: 330, label: 'BHTS 330', range: 'up to +330 °C', c: '#c2860a',
    tech: 'Solid HT lubricant · extended clearance · full stabilization',
    desc: 'The furnace-side specialist. Solid high-temperature lubricant instead of grease, extended radial clearance and full ring stabilization for continuous operation at +330 °C — kiln cars, oven conveyors, bakery and ceramic tunnels.',
  },
  s350: {
    key: 's350', temp: 350, label: 'BHTS ZZ C4 350 PLUS', range: 'up to +350 °C', c: '#a1560a',
    tech: 'BECO PLUS · special cage · solid lubricant · max stabilization',
    desc: 'The flagship BECO PLUS class. Special cage, solid lubricant and complete dimensional stabilization for continuous duty at +350 °C — the highest rating in the BECO range, for applications where nothing else survives.',
  },
};

export const seriesOf = (key) => SERIES[key] || SERIES.s200;

export const MIN_ORDER = 20;

export const eur = (n) => `€${Number(n).toFixed(2)}`;

// Faint tinted background for a temperature badge, from its accent colour.
export const tint = (hex, alpha = '1f') => `${hex}${alpha}`;
