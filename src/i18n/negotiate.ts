import { DEFAULT_LOCALE, LOCALES, isLocale, langOf } from './locales';
import { MARKETS } from '@/lib/compliance';

/** Language → the locale used when a visitor's country is not one of our markets. */
export const LANG_PRIMARY: Record<string, string> = {
  en: 'en-US', es: 'es-ES', fr: 'fr-CA', de: 'de-DE', nl: 'nl-NL', it: 'it-CH', ca: 'ca-ES', th: 'th-TH', af: 'af-ZA', zu: 'zu-ZA'
};

export function parseAcceptLanguage(header: string | null | undefined): { tag: string; lang: string; q: number }[] {
  if (!header) return [];
  return header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const q = Number(params.find((p) => p.trim().startsWith('q='))?.split('=')[1] ?? 1);
      return { tag: tag.trim(), lang: tag.trim().split('-')[0].toLowerCase(), q: Number.isFinite(q) ? q : 0 };
    })
    .filter((x) => x.tag && x.tag !== '*' && x.q > 0)
    .sort((a, b) => b.q - a.q);
}

/**
 * Default-locale negotiation. Order:
 *   1. the visitor's own saved choice (cookie) – always wins, never overridden
 *   2. IP-detected country → that market, in the language the browser prefers when available
 *   3. browser language → closest locale
 *   4. global default
 * This ONLY picks a default for URLs that carry no locale. It never rewrites an explicit /{locale}/ URL.
 */
export function negotiateLocale(opts: { cookie?: string | null; geo?: string | null; acceptLanguage?: string | null }): string {
  if (isLocale(opts.cookie)) return opts.cookie;
  const prefs = parseAcceptLanguage(opts.acceptLanguage);
  const market = opts.geo ? MARKETS[opts.geo.toUpperCase()] : undefined;
  if (market) {
    for (const p of prefs) {
      const hit = market.languages.find((l) => langOf(l) === p.lang);
      if (hit) return hit;
    }
    return market.defaultLocale;
  }
  for (const p of prefs) {
    const exact = LOCALES.find((l) => l.toLowerCase() === p.tag.toLowerCase());
    if (exact) return exact;
    if (LANG_PRIMARY[p.lang]) return LANG_PRIMARY[p.lang];
  }
  return DEFAULT_LOCALE;
}
