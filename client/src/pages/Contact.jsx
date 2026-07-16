import { useState } from 'react';
import { C } from '../theme.js';
import { Eyebrow, Field, TextInput, PrimaryButton, SecondaryButton, Alert } from '../components/ui.jsx';

export default function Contact() {
  const [f, setF] = useState({ name: '', last: '', email: '', subject: '', msg: '' });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const send = () => { if (f.name.trim() && f.email.trim() && f.msg.trim()) setSent(true); };

  return (
    <main className="page-pad" style={{ flex: 1, maxWidth: 1000, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '36px 24px 56px' }}>
      <Eyebrow>Request a personalized offer</Eyebrow>
      <h1 style={{ margin: '0 0 8px', fontSize: 32, fontWeight: 700, color: C.ink }}>Contact us</h1>
      <p style={{ margin: '0 0 30px', fontSize: 16, color: C.textSoft, maxWidth: 560 }}>For specific sizes, bulk quantities or anything not in the catalogue, send us a message — we answer with a personalized offer, usually within one working day.</p>

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 40, alignItems: 'start' }}>
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 26, boxShadow: C.shadow }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '28px 10px', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={C.success} strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="m8 12 3 3 5-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.ink }}>Message received</div>
              <div style={{ fontSize: 14.5, color: C.textSoft, lineHeight: 1.6 }}>We will contact you as soon as possible — usually within one working day.</div>
              <SecondaryButton onClick={() => { setSent(false); setF((s) => ({ ...s, subject: '', msg: '' })); }} style={{ marginTop: 4 }}>Send another message</SecondaryButton>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="First name *"><TextInput value={f.name} onChange={set('name')} /></Field>
                <Field label="Last name"><TextInput value={f.last} onChange={set('last')} /></Field>
              </div>
              <Field label="Email *"><TextInput type="email" value={f.email} onChange={set('email')} placeholder="you@company.com" /></Field>
              <Field label="Subject"><TextInput value={f.subject} onChange={set('subject')} placeholder="e.g. offer for 200 pcs 6204 BHTS ZZ C4 280" /></Field>
              <Field label="Your message *">
                <textarea value={f.msg} onChange={set('msg')} rows={6}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#fff', border: `1px solid ${C.borderStrong}`, borderRadius: 8, padding: '11px 13px', fontSize: 15, resize: 'vertical', lineHeight: 1.5 }} />
              </Field>
              <PrimaryButton onClick={send} style={{ alignSelf: 'flex-start' }}>Submit</PrimaryButton>
              <div style={{ fontSize: 12.5, color: C.textMute }}>* Required. Your data is processed on the basis of our privacy statement.</div>
            </div>
          )}
        </div>

        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 26, display: 'flex', flexDirection: 'column', gap: 20, boxShadow: C.shadow }}>
          <ContactRow label="Phone / WhatsApp"><a href="https://wa.me/37360948118">+373 60 948 118</a></ContactRow>
          <ContactRow label="Email"><a href="mailto:office@becobearings.com">office@becobearings.com</a></ContactRow>
          <ContactRow label="Shipping"><span style={{ color: C.text }}>EU-wide, from the Netherlands</span></ContactRow>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, fontSize: 13.5, color: C.textSoft, lineHeight: 1.65 }}>
            A minimum order of €20 applies to purchases on this website. For specific or bulk orders, use this form and we'll reply with a personalized offer.
          </div>
        </div>
      </div>
    </main>
  );
}

function ContactRow({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: C.textMute, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 15 }}>{children}</div>
    </div>
  );
}
