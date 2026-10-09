'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useCompliance } from './compliance/ComplianceProvider';
import { LocaleLink } from './LocaleLink';
import { COUNTRY_CODES_ALL } from '@/lib/countries';

declare global { interface Window { turnstile?: { render: (el: HTMLElement, o: Record<string, unknown>) => void } } }
const TURNSTILE = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const TYPES = ['dispensary', 'club', 'group', 'partner', 'other'] as const;

export default function ContactForm({ privacyEmail, address, allowedTypes }: { privacyEmail: string; address: string; allowedTypes: readonly string[] }) {
  const t = useTranslations('contact');
  const tc = useTranslations('common');
  const locale = useLocale();
  const c = useCompliance();
  const params = useSearchParams();
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error' | 'rate' | 'invalid'>('idle');
  const [fields, setFields] = useState<string[]>([]);
  const [nl, setNl] = useState<'pending' | 'failed' | undefined>();
  const [phone, setPhone] = useState('');
  const renderedAt = useRef(Date.now());
  const token = useRef('');
  const tsBox = useRef<HTMLDivElement>(null);
  const summary = useRef<HTMLDivElement>(null);
  const names = new Intl.DisplayNames([locale], { type: 'region' });
  const countries = COUNTRY_CODES_ALL.map((cc) => ({ cc, name: names.of(cc) ?? cc })).sort((a, b) => a.name.localeCompare(b.name, locale));

  useEffect(() => {
    if (!TURNSTILE || !tsBox.current) return;
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; s.async = true;
    s.onload = () => window.turnstile?.render(tsBox.current!, { sitekey: TURNSTILE, callback: (v: string) => { token.current = v; } });
    document.head.appendChild(s);
  }, []);
  useEffect(() => { if (state === 'ok' || state === 'error' || state === 'rate' || state === 'invalid') summary.current?.focus(); }, [state]);

  const nlStatus = params.get('newsletter');
  const input = 'mt-1 block min-h-[44px] w-full rounded-md border border-ink-muted bg-white px-3 py-2 text-base';
  const bad = (f: string) => fields.includes(f);
  const label = 'block text-sm font-medium';

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? '');
    setState('sending'); setFields([]);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: get('name'), email: get('email'), company: get('company'), role: get('role'), country: get('country'), phone: get('phone'),
          message: get('message'), type: get('type'), consent: fd.get('consent') === 'on', sms: fd.get('sms') === 'on', newsletter: fd.get('newsletter') === 'on',
          locale, company_website: get('company_website'), t: renderedAt.current, turnstileToken: token.current
        })
      });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; fields?: string[]; newsletter?: 'pending' | 'failed' };
      if (res.ok && j.ok) { setNl(j.newsletter); setState('ok'); (e.target as HTMLFormElement).reset(); return; }
      if (res.status === 429) return setState('rate');
      if (res.status === 422) { setFields(j.fields ?? []); return setState('invalid'); }
      setState('error');
    } catch { setState('error'); }
  }

  return (
    <div>
      {nlStatus === 'confirmed' && <p role="status" className="mb-6 rounded-md bg-brand-soft p-4 font-medium text-brand-dark">{t('confirmed')}</p>}
      {nlStatus === 'invalid' && <p role="alert" className="mb-6 rounded-md bg-warn-soft p-4 font-medium text-warn">{t('confirmInvalid')}</p>}

      <div ref={summary} tabIndex={-1} aria-live="polite" className="outline-none">
        {state === 'ok' && (
          <p className="mb-6 rounded-md bg-brand-soft p-4 font-medium text-brand-dark">
            {t('success')}{nl === 'pending' && <> {t('successNewsletter')}</>}
          </p>
        )}
        {state === 'error' && <p role="alert" className="mb-6 rounded-md bg-red-50 p-4 font-medium text-red-900">{t('error', { email: privacyEmail })}</p>}
        {state === 'rate' && <p role="alert" className="mb-6 rounded-md bg-warn-soft p-4 font-medium text-warn">{t('rateLimited')}</p>}
        {state === 'invalid' && <p role="alert" className="mb-6 rounded-md bg-red-50 p-4 font-medium text-red-900">{t('invalid')}</p>}
      </div>

      <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
        {([
          ['name', 'text', 'name', true], ['email', 'email', 'email', true], ['company', 'text', 'organization', true], ['role', 'text', 'organization-title', false]
        ] as const).map(([k, type, ac, req]) => (
          <div key={k}>
            <label className="block text-sm font-medium" htmlFor={`f-${k}`}>{t(`fields.${k}`)}{req ? <span aria-hidden="true"> *</span> : <span className="text-ink-muted"> ({tc('optional')})</span>}</label>
            <input id={`f-${k}`} name={k} type={type} autoComplete={ac} required={req} aria-required={req} maxLength={k === 'email' ? 320 : 160}
              aria-invalid={bad(k)} aria-describedby={bad(k) ? `e-${k}` : undefined} className={input} />
            {bad(k) && <p id={`e-${k}`} className="mt-1 text-sm font-medium text-red-800">{t('invalid')}</p>}
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium" htmlFor="f-country">{t('fields.country')} <span aria-hidden="true">*</span></label>
          <select id="f-country" name="country" required aria-required="true" defaultValue={c.country} autoComplete="country" aria-invalid={bad('country')} className={input}>
            {countries.map((x) => <option key={x.cc} value={x.cc}>{x.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="f-type">{t('fields.type')} <span aria-hidden="true">*</span></label>
          <select id="f-type" name="type" required aria-required="true" defaultValue={allowedTypes[0]} aria-invalid={bad('type')} className={input}>
            {TYPES.filter((x) => allowedTypes.includes(x)).map((x) => <option key={x} value={x}>{t(`types.${x}`)}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium" htmlFor="f-phone">{t('fields.phone')}</label>
          <input id="f-phone" name="phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={40}
            aria-invalid={bad('phone')} className={input} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium" htmlFor="f-message">{t('fields.message')} <span aria-hidden="true">*</span></label>
          <textarea id="f-message" name="message" rows={5} required aria-required="true" maxLength={3000} aria-invalid={bad('message')}
            aria-describedby={bad('message') ? 'e-message' : undefined} className={input} />
          {bad('message') && <p id="e-message" className="mt-1 text-sm font-medium text-red-800">{t('invalid')}</p>}
        </div>

        {/* Honeypot: invisible to people and assistive tech; bots fill it. */}
        <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
          <label>Website<input type="text" name="company_website" tabIndex={-1} autoComplete="off" /></label>
        </div>
        {TURNSTILE && <div ref={tsBox} className="sm:col-span-2" />}

        <fieldset className="space-y-4 sm:col-span-2">
          <legend className="sr-only">{t('consent.privacyLink')}</legend>
          <div>
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input type="checkbox" name="consent" required aria-required="true" aria-invalid={bad('consent')} aria-describedby="consent-purpose"
                className="mt-0.5 h-6 w-6 shrink-0 accent-[rgb(21,128,61)]" />
              <span>{t('consent.label', { privacy: t('consent.privacyLink') })} <span aria-hidden="true">*</span></span>
            </label>
            <p id="consent-purpose" className="ms-9 mt-1 text-sm text-ink-muted">
              {t('consent.purpose', { email: privacyEmail })}{' '}
              <LocaleLink href="/legal/privacy" className="font-medium text-brand-dark underline">{t('consent.privacyLink')}</LocaleLink>
            </p>
            {bad('consent') && <p role="alert" className="ms-9 mt-1 text-sm font-medium text-red-800">{t('consentRequired')}</p>}
          </div>
          {c.forms.sms && phone.trim() !== '' && (
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input type="checkbox" name="sms" className="mt-0.5 h-6 w-6 shrink-0 accent-[rgb(21,128,61)]" />
              <span>{t('sms.label')}</span>
            </label>
          )}
          <div>
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input type="checkbox" name="newsletter" className="mt-0.5 h-6 w-6 shrink-0 accent-[rgb(21,128,61)]" />
              <span>{t('newsletter.label')}</span>
            </label>
            {c.forms.casl && <p className="ms-9 mt-1 text-sm text-ink-muted">{t('newsletter.casl', { address })}</p>}
          </div>
        </fieldset>

        <div className="sm:col-span-2">
          <button type="submit" disabled={state === 'sending'}
            className="min-h-[48px] rounded-md bg-brand-dark px-6 py-3 font-semibold text-white hover:bg-brand disabled:opacity-60">
            {state === 'sending' ? t('sending') : t('submit')}
          </button>
          <p className="mt-3 text-sm text-ink-muted">{t('businessOnly')}</p>
        </div>
      </form>
    </div>
  );
}
