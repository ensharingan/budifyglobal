export const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
export const TYPES = ['dispensary', 'club', 'group', 'partner', 'other'] as const;

export interface LeadInput {
  name: string; email: string; company: string; role: string; country: string; phone: string; message: string; type: string;
  consent: boolean; sms: boolean; newsletter: boolean; locale: string;
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export function parseLead(b: Record<string, unknown>): { ok: true; data: LeadInput } | { ok: false; fields: string[] } {
  const data: LeadInput = {
    name: str(b.name, 120), email: str(b.email, 320).toLowerCase(), company: str(b.company, 160), role: str(b.role, 120),
    country: str(b.country, 2).toUpperCase(), phone: str(b.phone, 40), message: str(b.message, 3000), type: str(b.type, 20),
    consent: b.consent === true, sms: b.sms === true, newsletter: b.newsletter === true, locale: str(b.locale, 10)
  };
  const bad: string[] = [];
  if (data.name.length < 2) bad.push('name');
  if (!EMAIL_RE.test(data.email)) bad.push('email');
  if (data.company.length < 1) bad.push('company');
  if (!/^[A-Z]{2}$/.test(data.country)) bad.push('country');
  if (!(TYPES as readonly string[]).includes(data.type)) bad.push('type');
  if (data.message.length < 5) bad.push('message');
  if (data.phone && !/^[+\d\s().-]{6,40}$/.test(data.phone)) bad.push('phone');
  if (!data.consent) bad.push('consent');
  return bad.length ? { ok: false, fields: bad } : { ok: true, data };
}
