// Reference data extracted verbatim from the Beco design prototype.
// Used only to seed the products table on first run. After that, the
// admin panel is the source of truth (prices, stock, new products).

// Temperature classes (series). Colors form a blackbody heat ramp.
export const SERIES = {
  s200: { key: 's200', temp: 200, label: 'BHTS ZZ C4 200', suffix: 'BHTS ZZ C4 200', range: '−30 … +200 °C', color: '#e0512e' },
  s280: { key: 's280', temp: 280, label: 'BHTS ZZ C4 280', suffix: 'BHTS ZZ C4 280', range: '−30 … +280 °C', color: '#ff7a2f' },
  s330: { key: 's330', temp: 330, label: 'BHTS 330', suffix: 'BHTS 330', range: 'UP TO +330 °C', color: '#ffb24d' },
  s350: { key: 's350', temp: 350, label: 'BHTS ZZ C4 350 PLUS', suffix: 'BHTS ZZ C4 350', range: 'UP TO +350 °C', color: '#ffe9cf' },
};

// Bearing model dimensions: d=bore, D=outer, W=width (mm), g=weight (g),
// rpm=limiting speed, c0=static load rating (kN).
export const MODELS = {
  '6000': { d: 10, D: 26, W: 8, g: 19, rpm: 8000, c0: 1.96 },
  '6001': { d: 12, D: 28, W: 8, g: 22, rpm: 7500, c0: 2.36 },
  '6008': { d: 40, D: 68, W: 15, g: 190, rpm: 3400, c0: 11.6 },
  '6200': { d: 10, D: 30, W: 9, g: 30, rpm: 5800, c0: 2.6 },
  '6201': { d: 12, D: 32, W: 10, g: 37, rpm: 5600, c0: 3.1 },
  '6202': { d: 15, D: 35, W: 11, g: 45, rpm: 5300, c0: 3.75 },
  '6203': { d: 17, D: 40, W: 12, g: 65, rpm: 5000, c0: 4.75 },
  '6204': { d: 20, D: 47, W: 14, g: 106, rpm: 4500, c0: 6.55 },
  '6205': { d: 25, D: 52, W: 15, g: 128, rpm: 4200, c0: 7.8 },
  '6206': { d: 30, D: 62, W: 16, g: 200, rpm: 3800, c0: 11.2 },
  '6301': { d: 12, D: 37, W: 12, g: 60, rpm: 5300, c0: 5.4 },
  '6302': { d: 15, D: 42, W: 13, g: 82, rpm: 4800, c0: 6.9 },
  '6303': { d: 17, D: 47, W: 14, g: 115, rpm: 4500, c0: 8.7 },
  '6304': { d: 20, D: 52, W: 15, g: 145, rpm: 4200, c0: 7.8 },
};

// [seriesKey, model, price(EUR)] tuples.
export const CATALOG = [
  ['s200', '6000', 3.10], ['s200', '6001', 3.20], ['s200', '6008', 7.02], ['s200', '6200', 2.68], ['s200', '6201', 2.86], ['s200', '6202', 2.95], ['s200', '6203', 3.10], ['s200', '6204', 3.60], ['s200', '6205', 3.90], ['s200', '6206', 4.16], ['s200', '6303', 3.47],
  ['s280', '6200', 3.75], ['s280', '6201', 4.00], ['s280', '6202', 4.15], ['s280', '6203', 4.35], ['s280', '6204', 5.05], ['s280', '6205', 5.45], ['s280', '6206', 5.85], ['s280', '6302', 4.90], ['s280', '6303', 4.85],
  ['s330', '6201', 2.40], ['s330', '6202', 2.60], ['s330', '6203', 2.75], ['s330', '6204', 3.20], ['s330', '6301', 2.40], ['s330', '6302', 2.90],
  ['s350', '6200', 5.90], ['s350', '6201', 6.30], ['s350', '6202', 6.55], ['s350', '6203', 6.85], ['s350', '6204', 7.95], ['s350', '6205', 8.60], ['s350', '6304', 9.45],
];

// Deterministic pseudo-stock, matching the prototype's hash so seeded
// stock numbers look identical to the design mock.
export function seedStockFor(sku) {
  let h = 0;
  for (let i = 0; i < sku.length; i++) h = (h * 31 + sku.charCodeAt(i)) >>> 0;
  return 8 + (h % 60);
}
