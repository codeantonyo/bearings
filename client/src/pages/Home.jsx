import { useNavigate } from 'react-router-dom';
import { C, FONT, SERIES } from '../theme.js';
import { useProducts } from '../context/ProductsContext.jsx';
import { BearingHero } from '../components/BearingGraphics.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { PrimaryButton } from '../components/ui.jsx';

const FEATURED = ['6201 BHTS 330', '6200 BHTS ZZ C4 200', '6204 BHTS ZZ C4 350', '6206 BHTS ZZ C4 280'];
const INDUSTRIES = ['Air conveyors', 'Industrial fans', 'Packaging machinery', 'Steel industry', 'Ceramic industry', 'Papermaking industry'];

export default function Home() {
  const nav = useNavigate();
  const { products, bySku } = useProducts();

  const countFor = (key) => products.filter((p) => p.series === key).length;
  const featured = FEATURED.map((s) => bySku[s]).filter(Boolean);

  return (
    <main style={{ flex: 1 }}>
      {/* hero */}
      <section className="grid-hero" style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 40, alignItems: 'center', padding: '72px 40px 56px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 12, letterSpacing: 3, color: C.ember }}>HIGH TEMPERATURE BALL BEARINGS</div>
          <h1 className="hero-h1" style={{ margin: 0, fontSize: 72, lineHeight: 1.02, fontWeight: 700, letterSpacing: -2 }}>Built for<br />the heat.</h1>
          <p style={{ margin: 0, maxWidth: 440, fontSize: 17, lineHeight: 1.6, color: C.muted }}>Stabilized deep-groove ball bearings rated from −30 °C to +350 °C. Manufactured by Beco Italy, shipped fast from the Netherlands.</p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <PrimaryButton onClick={() => nav('/catalogue')}>BROWSE CATALOGUE →</PrimaryButton>
            <a href="mailto:office@becobearings.com" className="beco-hover"
              style={{ display: 'inline-flex', alignItems: 'center', border: `1px solid ${C.faint4}`, borderRadius: 6, padding: '15px 28px', fontFamily: FONT.mono, fontSize: 12, letterSpacing: 2, color: C.text }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.ember; e.currentTarget.style.color = C.ember; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.faint4; e.currentTarget.style.color = C.text; }}>ASK FOR AN OFFER</a>
          </div>
          <div style={{ display: 'flex', gap: 40, marginTop: 16, fontFamily: FONT.mono }}>
            <Stat n={products.length || '—'} label="SKUs IN STOCK" />
            <Stat n="4" label="TEMP CLASSES" />
            <Stat n="EU" label="SHIPPED FROM NL" />
          </div>
        </div>
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <BearingHero />
        </div>
      </section>

      {/* heat scale */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 40px 64px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>Pick your temperature class</h2>
          <span style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 2, color: C.dim }}>GLOW = RATED HEAT</span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: 'linear-gradient(90deg,#e0512e,#ff7a2f 38%,#ffb24d 72%,#ffe9cf)', marginBottom: 28 }} />
        <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
          {Object.values(SERIES).map((s) => (
            <button key={s.key} onClick={() => nav(`/catalogue?series=${s.key}`)} className="beco-hover"
              style={{ textAlign: 'left', background: C.panel, border: `1px solid ${C.faint}`, borderRadius: 10, padding: '26px 24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10, boxShadow: `inset 0 -60px 60px -70px ${s.c}` }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = s.c)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.faint)}>
              <div style={{ fontSize: 42, fontWeight: 700, letterSpacing: -1, color: s.c, textShadow: `0 0 24px ${s.c}88` }}>{s.temp}°</div>
              <div style={{ fontFamily: FONT.mono, fontSize: 12, letterSpacing: 1, color: C.text }}>{s.label}</div>
              <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.muted }}>{s.range}</div>
              <div style={{ fontFamily: FONT.mono, fontSize: 10, letterSpacing: 2, color: C.dim, marginTop: 6 }}>{countFor(s.key)} SIZES →</div>
            </button>
          ))}
        </div>
      </section>

      {/* industries */}
      <section style={{ borderTop: `1px solid ${C.faint}`, borderBottom: `1px solid ${C.faint}`, background: C.panel2 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '26px 40px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 10, letterSpacing: 3, color: C.dim, marginRight: 8 }}>DESIGNED FOR</span>
          {INDUSTRIES.map((ind) => (
            <span key={ind} style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1, color: C.muted, border: `1px solid ${C.faint2}`, borderRadius: 999, padding: '7px 16px' }}>{ind}</span>
          ))}
        </div>
      </section>

      {/* featured */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>Top sale</h2>
          <button onClick={() => nav('/catalogue')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT.mono, fontSize: 11, letterSpacing: 2, color: C.ember }}>VIEW ALL →</button>
        </div>
        <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
          {featured.map((p) => <ProductCard key={p.sku} product={p} variant="featured" />)}
        </div>
      </section>

      {/* about strip */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px 72px' }}>
        <div className="grid-2" style={{ background: C.panel, border: `1px solid ${C.faint}`, borderRadius: 12, padding: '36px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <div>
            <div style={{ fontFamily: FONT.mono, fontSize: 10, letterSpacing: 3, color: C.ember, marginBottom: 12 }}>ABOUT BECO</div>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: C.muted }}>Beco Italy has spent decades pushing the limits of what a bearing can survive. Beco Netherlands, opened in 2023, brings that catalogue closer — direct ordering, faster shipping and EU-local support.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center', fontFamily: FONT.mono, fontSize: 12, color: C.muted }}>
            <div><span style={{ color: C.dim }}>TEL&nbsp;&nbsp;&nbsp;</span> <a href="https://wa.me/37360948118">+373 60 948 118</a></div>
            <div><span style={{ color: C.dim }}>MAIL&nbsp;&nbsp;</span> <a href="mailto:office@becobearings.com">office@becobearings.com</a></div>
            <div><span style={{ color: C.dim }}>MIN&nbsp;&nbsp;&nbsp;</span> 20 € minimum order · personalized offers via contact form</div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ n, label }) {
  return (
    <div>
      <div style={{ fontSize: 26, color: C.text }}>{n}</div>
      <div style={{ fontSize: 10, letterSpacing: 2, color: C.dim, marginTop: 4 }}>{label}</div>
    </div>
  );
}
