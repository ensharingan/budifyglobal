import { NextResponse } from 'next/server';
import { parseLead } from '@/lib/validate';
import { checkBot, sameOrigin } from '@/lib/bot';
import { rateLimit, clientKey } from '@/lib/rateLimit';
import { persist, regionForCountry } from '@/lib/store';
import { sendConfirmation } from '@/lib/newsletter';
import { complianceConfig } from '@/lib/compliance';
import { countryOf, isLocale, marketOf } from '@/i18n/locales';

const json = (body: Record<string, unknown>, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ ok: false, code: 'origin' }, 403);
  const ip = clientKey(req);
  const rl = rateLimit(`lead:${ip}`, 5, 10 * 60_000);
  if (!rl.ok) return NextResponse.json({ ok: false, code: 'rate_limited' }, { status: 429, headers: { 'Retry-After': String(rl.retryAfter), 'Cache-Control': 'no-store' } });

  let body: Record<string, unknown>;
  try { body = (await req.json()) as Record<string, unknown>; } catch { return json({ ok: false, code: 'invalid' }, 400); }

  if ((await checkBot({ hp: body.company_website, renderedAt: body.t, token: body.turnstileToken, ip })) === 'bot') {
    return json({ ok: true }); // silent success: don't teach bots what tripped
  }
  const parsed = parseLead(body);
  if (!parsed.ok) return json({ ok: false, code: 'invalid', fields: parsed.fields }, 422);
  const d = parsed.data;
  if (!isLocale(d.locale)) return json({ ok: false, code: 'invalid', fields: ['locale'] }, 422);

  const market = marketOf(d.locale);
  const region = regionForCountry(countryOf(d.locale));
  const record = {
    id: crypto.randomUUID(),
    name: d.name, email: d.email, company: d.company, role: d.role, country: d.country, type: d.type, message: d.message,
    phone: d.phone || null,
    smsConsent: market.forms.sms && !!d.phone && d.sms,
    newsletterRequested: d.newsletter,
    locale: d.locale,
    consent: { given: true, purpose: 'respond-to-enquiry', basis: 'consent', textVersion: complianceConfig.consentVersion, formVersion: 'lead-v1', at: new Date().toISOString() }
  };
  const stored = await persist('lead', region, record);
  if (!stored) return json({ ok: false, code: 'unavailable' }, 503);

  let newsletter: 'pending' | 'failed' | undefined;
  if (d.newsletter) newsletter = (await sendConfirmation(d.email, d.locale)) ? 'pending' : 'failed';
  return json({ ok: true, newsletter });
}
