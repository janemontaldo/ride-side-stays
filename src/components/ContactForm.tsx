import { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { submitEnquiry } from '../lib/supabase';

interface Props {
  prefilledProperty?: string;
  propertyOptions?: string[];
}

const initialState = { name: '', email: '', phone: '', message: '', property_interest: '' };

// ── Email notifications via Web3Forms ─────────────────────────────────────────
// Every enquiry is emailed to the site master (janemontaldo@gmail.com). Owners handle
// their own rentals via the direct emails shown on each listing.
// Get a free key at https://web3forms.com (enter janemontaldo@gmail.com; the key is
// emailed to that address), then paste it below in place of the PASTE_… text.
// The key is safe to keep in the code. To add more recipients later, add more keys here.
const WEB3FORMS_ACCESS_KEYS: string[] = [
  '37a95d75-2a2e-443f-995f-70f4207aa673',
];

type EnquiryPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  property_interest?: string;
};

async function sendEnquiryEmails(data: EnquiryPayload) {
  const keys = WEB3FORMS_ACCESS_KEYS.filter(k => k && !k.startsWith('PASTE_'));
  if (keys.length === 0) return; // no keys set yet — skip email, form still saves to Supabase
  await Promise.all(
    keys.map(async access_key => {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key,
          subject: `New enquiry — ${data.property_interest || 'Ride Side Stays'}`,
          from_name: 'Ride Side Stays website',
          replyto: data.email,
          name: data.name,
          email: data.email,
          phone: data.phone || 'Not provided',
          property_interest: data.property_interest || 'Not specified',
          message: data.message,
        }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message || 'Email send failed');
    })
  );
}

const fieldClass = (error: boolean) =>
  `w-full px-4 py-3 rounded-xl border text-sm text-ink placeholder-ink-faint bg-cream transition-colors focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink/40 ${
    error ? 'border-red-400 bg-red-50' : 'border-cream-400'
  }`;

export default function ContactForm({ prefilledProperty, propertyOptions }: Props) {
  const [form, setForm] = useState({ ...initialState, property_interest: prefilledProperty ?? '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Your name is required.';
    if (!form.email.trim()) e.email = 'Your email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email.';
    if (!form.message.trim()) e.message = 'Please include a message.';
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus('submitting');

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      message: form.message.trim(),
      property_interest: form.property_interest || undefined,
    };

    try {
      // Email the enquiry to the team (primary goal).
      await sendEnquiryEmails(payload);
      // Also store it in Supabase as a record — best effort, don't fail the form if this errors.
      submitEnquiry(payload).catch(() => {});
      setStatus('success');
      setForm({ ...initialState, property_interest: prefilledProperty ?? '' });
    } catch {
      setStatus('error');
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-cream-400 p-8 text-center">
        <CheckCircle className="w-11 h-11 text-ink mx-auto mb-4" />
        <h3 className="font-semibold text-lg text-ink mb-2">Message received!</h3>
        <p className="text-ink-muted text-sm">
          Thank you for getting in touch. We'll get back to you within one working day.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 text-ink-muted hover:text-ink text-sm underline underline-offset-2 transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {status === 'error' && (
        <div className="flex items-start gap-3 border border-red-200 bg-red-50 rounded-xl p-4 text-sm text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>Something went wrong. Please try again or email us directly.</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5">
            Full name *
          </label>
          <input id="name" name="name" type="text" value={form.name} onChange={handleChange}
            placeholder="Jane Smith" className={fieldClass(!!errors.name)} />
          {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5">
            Email address *
          </label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange}
            placeholder="jane@example.com" className={fieldClass(!!errors.email)} />
          {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5">
          Phone <span className="normal-case font-normal text-ink-faint">(optional)</span>
        </label>
        <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange}
          placeholder="+61 400 000 000" className={fieldClass(false)} />
      </div>

      {propertyOptions && propertyOptions.length > 0 && (
        <div>
          <label htmlFor="property_interest" className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5">
            Property of interest
          </label>
          <select id="property_interest" name="property_interest" value={form.property_interest}
            onChange={handleChange} className={fieldClass(false)}>
            <option value="">— Not sure yet —</option>
            {propertyOptions.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5">
          Message *
        </label>
        <textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange}
          placeholder="Tell us your ideal dates, group size, and any questions..."
          className={fieldClass(!!errors.message) + ' resize-none'} />
        {errors.message && <p className="mt-1.5 text-xs text-red-600">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full flex items-center justify-center gap-2 bg-ink hover:bg-ink-soft disabled:bg-ink-faint text-white font-semibold py-3.5 px-6 rounded-xl transition-colors duration-200 text-sm"
      >
        {status === 'submitting' ? (
          <>
            <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4" />
            Sending…
          </>
        ) : 'Send enquiry'}
      </button>
    </form>
  );
}
