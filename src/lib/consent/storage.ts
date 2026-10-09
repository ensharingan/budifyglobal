'use client';
// First-party cookie helpers + consent record format.

export const CONSENT_COOKIE = 'bud_consent';
export const AGE_COOKIE = 'bud_age';

export interface ConsentRecord {
  /** consent text/config version (compliance.config.json → consentVersion) */
  v: string;
  /** random anonymous id, used only to correlate log entries for this browser */
  id: string;
  /** ISO timestamp (client) */
  ts: string;
  analytics: boolean;
  marketing: boolean;
  source: 'banner' | 'settings' | 'gpc' | 'privacy-page';
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const hit = document.cookie.split('; ').find((c) => c.startsWith(name + '='));
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : null;
}

export function setCookie(name: string, value: string, opts: { days?: number } = {}) {
  if (typeof document === 'undefined') return;
  const secure = typeof location !== 'undefined' && location.protocol === 'https:' ? '; Secure' : '';
  const maxAge = opts.days ? `; Max-Age=${Math.round(opts.days * 86400)}` : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; SameSite=Lax${maxAge}${secure}`;
}

export function deleteCookie(name: string, domain?: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${domain ? `; Domain=${domain}` : ''}`;
}

export function readConsent(): ConsentRecord | null {
  try {
    const raw = getCookie(CONSENT_COOKIE);
    if (!raw) return null;
    const r = JSON.parse(raw) as ConsentRecord;
    return r && typeof r.v === 'string' ? r : null;
  } catch {
    return null;
  }
}

export function newId(): string {
  try { return crypto.randomUUID(); } catch { return Math.random().toString(36).slice(2) + Date.now().toString(36); }
}

export function writeConsent(r: ConsentRecord) {
  // 180 days: users are re-asked at least twice a year
  setCookie(CONSENT_COOKIE, JSON.stringify(r), { days: 180 });
}

export function browserPrivacySignals(): { gpc: boolean; dnt: boolean } {
  if (typeof navigator === 'undefined') return { gpc: false, dnt: false };
  const n = navigator as Navigator & { globalPrivacyControl?: boolean; msDoNotTrack?: string };
  const dnt = n.doNotTrack === '1' || (window as unknown as { doNotTrack?: string }).doNotTrack === '1' || n.msDoNotTrack === '1';
  return { gpc: n.globalPrivacyControl === true, dnt };
}
