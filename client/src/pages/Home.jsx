import { useNavigate } from 'react-router-dom';
import { C, FONT, SERIES } from '../theme.js';
import { useProducts } from '../context/ProductsContext.jsx';
import { BearingMark } from '../components/BearingGraphics.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { PrimaryButton, SecondaryButton, Eyebrow } from '../components/ui.jsx';

const FEATURED = ['6201 BHTS 330', '6200 BHTS ZZ C4 200', '6204 BHTS ZZ C4 350', '6206 BHTS ZZ C4 280'];
const INDUSTRIES = ['Air conveyors', 'Industrial fans', 'Packaging machinery', 'Steel industry', 'Ceramic industry', 'Papermaking'];

export default function Home() {
  const nav = useNavigate();
  const { products, bySku } = useProducts();
  const countFor = (key) => products.filter((p) => p.series === key).length;
  const featured = FEATURED.map((s) => bySku[s]).filter(Boolean);

  return (
    <main style={{ flex: 1 }}>
      {/* hero */}
      <section style={{ background: '#fff', borderBottom: `1px solid ${C.border}` }}>
        <div className="grid-hero page-pad" style={{ maxWidth: 1240, margin: '0 auto', padding: '56px 24px', display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 48, alignItems: 'center' }}>
          <div>
            <Eyebrow>High-temperature ball bearings</Eyebrow>
            <h1 className="hero-h1" style={{ margin: '0 0 18px', fontSize: 46, lineHeight: 1.1, fontWeight: 700, color: C.ink, letterSpacing: '-0.01em' }}>
              Bearings that keep running where standard ones fail
            </h1>
            <p style={{ margin: '0 0 26px', maxWidth: 480, fontSize: 17, lineHeight: 1.6, color: C.textSoft }}>
              Stabilized deep-groove ball bearings rated from −30 °C to +350 °C. Manufactured by Beco Italy,
              ordered directly and shipped fast from the Netherlands.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <PrimaryButton onClick={() => nav('/catalogue')}>Browse the catalogue</PrimaryButton>
              <SecondaryButton onClick={() => nav('/contact')}>Request an offer</SecondaryButton>
            </div>
            <div style={{ display: 'flex', gap: 36, marginTop: 34 }}>
              <Stat n={products.length || '—'} label="Products in stock" />
              <Stat n="4" label="Temperature classes" />
              <Stat n="EU" label="Shipped from NL" />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: C.imageBg, border: `1px solid ${C.border}`, borderRadius: 16, padding: 40, width: '100%', maxWidth: 380, display: 'flex', justifyContent: 'center' }}>
              <BearingMark size={260} accent={C.brand} />
            </div>
          </div>
        </div>
      </section>

      {/* trust strip */}
      <section style={{ background: '#fff', borderBottom: `1px solid ${C.border}` }}>
        <div className="page-pad" style={{ maxWidth: 1240, margin: '0 auto', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', fontSize: 14, color: C.textSoft }}>
          <span style={{ fontWeight: 600, color: C.text }}>Trusted in:</span>
          {INDUSTRIES.map((ind, i) => (
            <span key={ind} style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
              {i > 0 && <span style={{ color: C.borderStrong }}>•</span>}{ind}
            </span>
          ))}
        </div>
      </section>

      {/* temperature classes */}
      <section className="page-pad" style={{ maxWidth: 1240, margin: '0 auto', padding: '52px 24px 12px' }}>
        <h2 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 700, color: C.ink }}>Shop by temperature class</h2>
        <p style={{ margin: '0 0 26px', fontSize: 15.5, color: C.textSoft }}>Four continuous-duty ratings — pick the maximum temperature your application sees.</p>
        <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {Object.values(SERIES).map((s) => (
            <button key={s.key} onClick={() => nav(`/catalogue?series=${s.key}`)} className="card-hover"
              style={{ textAlign: 'left', background: '#fff', border: `1px solid ${C.border}`, borderTop: `3px solid ${s.c}`, borderRadius: 10, padding: '22px 20px', cursor: 'pointer', boxShadow: C.shadow }}>
              <div style={{ fontSize: 30, fontWeight: 700, color: C.ink }}>{s.temp} °C</div>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: C.text, marginTop: 8 }}>{s.label}</div>
              <div style={{ fontSize: 13.5, color: C.textMute, marginTop: 3 }}>{s.range}</div>
              <div style={{ fontSize: 13.5, color: C.brand, fontWeight: 600, marginTop: 14 }}>{countFor(s.key)} sizes →</div>
            </button>
          ))}
        </div>
      </section>

      {/* featured */}
      <section className="page-pad" style={{ maxWidth: 1240, margin: '0 auto', padding: '40px 24px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: C.ink }}>Best sellers</h2>
          <button onClick={() => nav('/catalogue')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14.5, fontWeight: 600, color: C.brand }}>View all →</button>
        </div>
        <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {featured.map((p) => <ProductCard key={p.sku} product={p} />)}
        </div>
      </section>

      {/* about band */}
      <section className="page-pad" style={{ maxWidth: 1240, margin: '0 auto', padding: '44px 24px 64px' }}>
        <div className="grid-2" style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: '34px 36px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 40, boxShadow: C.shadow }}>
          <div>
            <Eyebrow>About BECO</Eyebrow>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: C.textSoft }}>
              Beco Italy has spent decades developing the stabilization treatments, clearances and lubricants that keep
              bearings running at extreme temperatures. Beco Netherlands, opened in 2023, brings that catalogue closer —
              direct ordering, faster shipping and EU-local support.
            </p>
            <div style={{ marginTop: 18 }}>
              <SecondaryButton onClick={() => nav('/about')}>Learn more about us</SecondaryButton>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center' }}>
            <Row k="Manufacturer" v="Beco Italy" />
            <Row k="EU branch" v="Netherlands · 2023" />
            <Row k="Temperature range" v="−30 … +350 °C" />
            <Row k="Minimum order" v="€20" />
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ n, label }) {
  return (
    <div>
      <div style={{ fontSize: 28, fontWeight: 700, color: C.ink }}>{n}</div>
      <div style={{ fontSize: 13, color: C.textMute, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, borderBottom: `1px solid ${C.border}`, paddingBottom: 11, fontSize: 14.5 }}>
      <span style={{ color: C.textMute }}>{k}</span>
      <span style={{ color: C.text, fontWeight: 600 }}>{v}</span>
    </div>
  );
}
