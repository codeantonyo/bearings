import { useState } from 'react';
import { C, FONT } from '../theme.js';
import { Eyebrow, Field, TextInput, PrimaryButton, GhostButton } from '../components/ui.jsx';

export default function Contact() {
  const [f, setF] = useState({ name: '', last: '', email: '', subject: '', msg: '' });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const send = () => { if (f.name.trim() && f.email.trim() && f.msg.trim()) setSent(true); };

  return (
    <main style={{ flex: 1, maxWidth: 1100, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '48px 40px 72px' }}>
      <Eyebrow>PERSONALIZED OFFER?</Eyebrow>
      <h1 style={{ margin: '0 0 36px', fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>Contact us</h1>
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'start' }}>
        <div>
          {sent ? (
            <div style={{ border: '1px solid rgba(125,219,138,.35)', borderRadius: 12, padding: 48, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
              <span style={{ fontSize: 28, color: C.green }}>✓</span>
              <span style={{ fontFamily: FONT.mono, fontSize: 13, letterSpacing: 1, color: C.green }}>MESSAGE RECEIVED</span>
              <span style={{ fontFamily: FONT.mono, fontSize: 11, color: C.muted, lineHeight: 1.7 }}>We will contact you as soon as possible —<br />usually within one working day.</span>
              <GhostButton onClick={() => { setSent(false); setF((s) => ({ ...s, subject: '', msg: '' })); }} style={{ marginTop: 8 }}>SEND ANOTHER</GhostButton>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="FIRST NAME *"><TextInput value={f.name} onChange={set('name')} /></Field>
                <Field label="LAST NAME"><TextInput value={f.last} onChange={set('last')} /></Field>
              </div>
              <Field label="EMAIL *"><TextInput type="email" value={f.email} onChange={set('email')} placeholder="you@company.com" /></Field>
              <Field label="SUBJECT"><TextInput value={f.subject} onChange={set('subject')} placeholder="e.g. offer for 200 pcs 6204 BHTS ZZ C4 280" /></Field>
              <Field label="YOUR MESSAGE *">
                <textarea value={f.msg} onChange={set('msg')} rows={6}
                  style={{ width: '100%', boxSizing: 'border-box', background: C.panel, border: `1px solid ${C.faint2}`, borderRadius: 8, padding: '12px 14px', color: C.text, fontFamily: FONT.mono, fontSize: 12, resize: 'vertical' }} />
              </Field>
              <PrimaryButton onClick={send} style={{ alignSelf: 'flex-start', padding: '15px 30px' }}>SUBMIT FORM →</PrimaryButton>
              <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.dim, lineHeight: 1.6 }}>* REQUIRED. THE PROCESSING OF YOUR DATA TAKES PLACE ON BASIS OF OUR PRIVACY STATEMENT.</div>
            </div>
          )}
        </div>
        <div style={{ background: C.panel, border: `1px solid ${C.faint}`, borderRadius: 12, padding: 28, display: 'flex', flexDirection: 'column', gap: 18, fontFamily: FONT.mono, fontSize: 12 }}>
          <div><div style={{ color: C.dim, fontSize: 10, letterSpacing: 2, marginBottom: 6 }}>TEL / WHATSAPP</div><a href="https://wa.me/37360948118">+373 60 948 118</a></div>
          <div><div style={{ color: C.dim, fontSize: 10, letterSpacing: 2, marginBottom: 6 }}>EMAIL</div><a href="mailto:office@becobearings.com">office@becobearings.com</a></div>
          <div><div style={{ color: C.dim, fontSize: 10, letterSpacing: 2, marginBottom: 6 }}>SHIPPING</div><span style={{ color: C.text }}>EU-wide, from the Netherlands</span></div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 16, color: C.muted, lineHeight: 1.7, fontSize: 11 }}>A minimum order of 20 € is necessary for purchases on this website. For specific or bulk orders, use this form — we answer with a personalized offer.</div>
        </div>
      </div>
    </main>
  );
}
