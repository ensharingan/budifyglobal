import { NextResponse } from 'next/server';
import { verifyToken, confirmedUrl } from '@/lib/newsletter';
import { persist, regionForCountry } from '@/lib/store';
import { complianceConfig } from '@/lib/compliance';
import { countryOf, isLocale } from '@/i18n/locales';
import { rateLimit, clientKey } from '@/lib/rateLimit';

/** Step 2 of double opt-in: only a valid, unexpired, signed token creates a confirmed subscriber record. */
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token') ?? '';
  const v = rateLimit(`nlc:${clientKey(req)}`, 20, 10 * 60_000).ok ? verifyToken(token) : null;
  const locale = v && isLocale(v.locale) ? v.locale : 'en-US';
  if (!v) return NextResponse.redirect(confirmedUrl(locale, false), 303);
  const ok = await persist('newsletter', regionForCountry(countryOf(locale)), {
    email: v.email, status: 'confirmed', locale, confirmedAt: new Date().toISOString(),
    consent: { basis: 'consent', method: 'double-opt-in', textVersion: complianceConfig.consentVersion }
  });
  return NextResponse.redirect(confirmedUrl(locale, ok), 303);
}
