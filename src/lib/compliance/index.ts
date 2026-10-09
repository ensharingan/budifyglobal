import raw from '@root/compliance.config.json';
import type { ComplianceConfig, ConsentModel, Market } from './types';

export const complianceConfig = raw as unknown as ComplianceConfig;
export const MARKETS = complianceConfig.markets;
export const COUNTRY_CODES = Object.keys(MARKETS);

export function getMarket(country: string): Market | undefined {
  return MARKETS[country.toUpperCase()];
}

export { strictestConsent } from '@/lib/consent/modes';

/**
 * Consent model for ANY ISO country (used with IP geolocation).
 * Countries outside our market matrix default to opt-in (the conservative choice).
 */
export function consentModelForCountry(country: string | null | undefined): ConsentModel {
  if (!country) return 'opt-in';
  return getMarket(country)?.consentModel ?? 'opt-in';
}

export function gpcHonoredFor(country: string | null | undefined): boolean {
  if (!country) return false;
  return getMarket(country)?.honorGpc ?? false;
}

/** Precomputed maps passed to client components (keeps the big config JSON out of the client bundle). */
export function clientConsentMaps() {
  return {
    consentByCountry: Object.fromEntries(Object.entries(MARKETS).map(([cc, m]) => [cc, m.consentModel])) as Record<string, ConsentModel>,
    gpcCountries: Object.entries(MARKETS).filter(([, m]) => m.honorGpc).map(([cc]) => cc)
  };
}
