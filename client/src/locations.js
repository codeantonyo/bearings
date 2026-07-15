// Country + city data from the free, key-less countriesnow.space API.
// Cities depend on the selected country. Results are cached in-memory for the
// session so switching back and forth is instant.

const BASE = 'https://countriesnow.space/api/v0.1';

let countriesCache = null;
const citiesCache = new Map();

export async function fetchCountries() {
  if (countriesCache) return countriesCache;
  const res = await fetch(`${BASE}/countries/iso`);
  if (!res.ok) throw new Error('Could not load countries');
  const json = await res.json();
  countriesCache = (json.data || []).map((c) => c.name).sort((a, b) => a.localeCompare(b));
  return countriesCache;
}

export async function fetchCities(country) {
  if (!country) return [];
  if (citiesCache.has(country)) return citiesCache.get(country);
  const res = await fetch(`${BASE}/countries/cities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ country }),
  });
  if (!res.ok) throw new Error('Could not load cities');
  const json = await res.json();
  // De-dupe + sort; some entries repeat in the source data.
  const cities = [...new Set(json.data || [])].sort((a, b) => a.localeCompare(b));
  citiesCache.set(country, cities);
  return cities;
}
