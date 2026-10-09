import { createHmac, timingSafeEqual } from 'node:crypto';
import { getTranslations } from 'next-intl/server';
import { SITE_URL } from './site';
import { localizedPath } from '@/i18n/paths';

const TTL_MS = 48 * 3600_000;
const secret = () => process.env.NEWSLETTER_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'dev-only-secret');
const b64 = (s: string) => Buffer.from(s).toString('base64url');
const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url');

export function makeToken(email: string, locale: string, now = Date.now()): string {
  const payload = `${b64(email)}.${now}.${locale}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string): { email: string; locale: string } | null {
  if (!secret()) return null;
  const parts = token.split('.');
  if (parts.length !== 4) return null;
  const [e, ts, locale, sig] = parts;
  const expected = sign(`${e}.${ts}.${locale}`);
  const a = Buffer.from(sig), b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Date.now() - Number(ts) > TTL_MS) return null;
  return { email: Buffer.from(e, 'base64url').toString(), locale };
}

/** Sends the double-opt-in confirmation email. Returns false if it could not be sent. */
export async function sendConfirmation(email: string, locale: string): Promise<boolean> {
  if (!secret()) { console.error('[newsletter] NEWSLETTER_SECRET is not set'); return false; }
  const t = await getTranslations({ locale, namespace: 'contact.confirmEmail' });
  const link = `${SITE_URL}/api/newsletter/confirm?token=${encodeURIComponent(makeToken(email, locale))}`;
  const text = `${t('body', { link })}\n\n${t('ignore')}`;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV !== 'production') { console.log('[newsletter] (dev) confirmation link:', link); return true; }
    console.error('[newsletter] RESEND_API_KEY is not set – confirmation email NOT sent');
    return false;
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from: process.env.EMAIL_FROM || 'Budify <no-reply@budify.com>', to: [email], subject: t('subject'), text }),
      signal: AbortSignal.timeout(8000)
    });
    return res.ok;
  } catch { return false; }
}

export const confirmedUrl = (locale: string, ok: boolean) => `${SITE_URL}${localizedPath(locale, '/contact')}?newsletter=${ok ? 'confirmed' : 'invalid'}`;
