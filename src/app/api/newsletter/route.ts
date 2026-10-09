import { NextResponse } from 'next/server';
import { EMAIL_RE } from '@/lib/validate';
import { checkBot, sameOrigin } from '@/lib/bot';
import { rateLimit, clientKey } from '@/lib/rateLimit';
import { sendConfirmation } from '@/lib/newsletter';
import { isLocale } from '@/i18n/locales';

const json = (body: Record<string, unknown>, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

/** Step 1 of double opt-in: validate, then email a signed confirmation link. Nothing is subscribed yet. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ ok: false, code: 'origin' }, 403);
  const ip = clientKey(req);
  const rl = rateLimit(`nl:${ip}`, 3, 10 * 60_000);
  if (!rl.ok) return NextResponse.json({ ok: false, code: 'rate_limited' }, { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } });
  let b: Record<string, unknown>;
  try { b = (await req.json()) as Record<string, unknown>; } catch { return json({ ok: false, code: 'invalid' }, 400); }
  if ((await checkBot({ hp: b.company_website, renderedAt: b.t, token: b.turnstileToken, ip })) === 'bot') return json({ ok: true });
  const email = typeof b.email === 'string' ? b.email.trim().toLowerCase() : '';
  const locale = typeof b.locale === 'string' ? b.locale : '';
  if (!EMAIL_RE.test(email) || !isLocale(locale) || b.consent !== true) return json({ ok: false, code: 'invalid' }, 422);
  return (await sendConfirmation(email, locale)) ? json({ ok: true }) : json({ ok: false, code: 'unavailable' }, 503);
}
