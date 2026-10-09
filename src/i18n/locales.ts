import { complianceConfig, MARKETS } from '@/lib/compliance';
import type { Market } from '@/lib/compliance/types';

export interface LocaleInfo { locale: string; lang: string; country: string }

export const LOCALE_LIST: LocaleInfo[] = Object.entries(MARKETS).flatMap(([country, m]) =>
  m.languages.map((locale) => ({ locale, lang: locale.split('-')[0], country }))
);
export const LOCALES = LOCALE_LIST.map((l) => l.locale);
export const DEFAULT_LOCALE = complianceConfig.global.defaultLocale;
export const LOCALE_COOKIE = 'bud_locale';

export function isLocale(v: string | undefined | null): v is string {
  return !!v && LOCALES.includes(v);
}
export function parseLocale(locale: string): { lang: string; country: string } {
  const [lang, country] = locale.split('-');
  return { lang, country };
}
export function langOf(locale: string) { return parseLocale(locale).lang; }
export function countryOf(locale: string) { return parseLocale(locale).country; }
export function marketOf(locale: string): Market { return MARKETS[countryOf(locale)] ?? MARKETS.US; }
export function dirOf(locale: string): 'ltr' | 'rtl' { return complianceConfig.languages[langOf(locale)]?.dir ?? 'ltr'; }
export function minAgeOf(locale: string): number {
  const m = marketOf(locale);
  return m.minAgeByLocale?.[locale] ?? m.minAge;
}
export function languageName(lang: string, native = true) {
  const l = complianceConfig.languages[lang];
  return l ? (native ? l.native : l.name) : lang;
}
/** Some locale codes are not valid for Intl on every runtime; map to a safe tag. */
export function intlTag(locale: string) { return locale; }
