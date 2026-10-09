import { NextResponse } from 'next/server';
import { persist, regionForCountry } from '@/lib/store';
import { rateLimit, clientKey } from '@/lib/rateLimit';
import { complianceConfig } from '@/lib/compliance';
import { isLocale, countryOf } from '@/i18n/locales';

/**
 * Consent log: records what was chosen, when, under which consent-text version.
 * No IP address is stored. `id` is a random per-browser identifier generated client-side.
 */
export async function POST(req: Request) {
  if (!rateLimit(`consent:${clientKey(req)}`, 30, 60_000).ok) return new NextResponse(null, { status: 429 });
  let b: Record<string, unknown>;
  try { b = (await req.json()) as Record<string, unknown>; } catch { return new NextResponse(null, { status: 400 }); }
  const locale = String(b.locale ?? '');
  if (!isLocale(locale) || typeof b.id !== 'string' || b.id.length > 64 || typeof b.analytics !== 'boolean' || typeof b.marketing !== 'boolean') {
    return new NextResponse(null, { status: 400 });
  }
  const entry = {
    consentId: b.id,
    consentVersion: String(b.v ?? '').slice(0, 40),
    currentConfigVersion: complianceConfig.version,
    decidedAtClient: String(b.ts ?? '').slice(0, 40),
    analytics: b.analytics, marketing: b.marketing,
    source: String(b.source ?? '').slice(0, 20),
    locale, mode: String(b.mode ?? '').slice(0, 12),
    detectedCountry: typeof b.geo === 'string' ? b.geo.slice(0, 2) : null,
    gpcHeader: req.headers.get('sec-gpc') === '1'
  };
  await persist('consent', regionForCountry(countryOf(locale)), entry);
  return new NextResponse(null, { status: 204 });
}
