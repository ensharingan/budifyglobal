import type { FooterLinkKey } from '@/lib/compliance/types';

export const MAIN_NAV = [
  { id: 'features', href: '/features', key: 'features' },
  { id: 'solutions', href: '/solutions', key: 'solutions' },
  { id: 'pricing', href: '/pricing', key: 'pricing' },
  { id: 'integrations', href: '/integrations', key: 'integrations' },
  { id: 'compliance', href: '/compliance', key: 'compliance' },
  { id: 'resources', href: '/resources', key: 'resources' }
] as const;

export interface FooterLinkDef { href?: string; action?: 'cookieSettings'; labelKey: string }
export const FOOTER_LINKS: Record<FooterLinkKey, FooterLinkDef> = {
  privacy: { href: '/legal/privacy', labelKey: 'privacy' },
  cookies: { href: '/legal/cookies', labelKey: 'cookies' },
  terms: { href: '/legal/terms', labelKey: 'terms' },
  acceptableUse: { href: '/legal/acceptable-use', labelKey: 'acceptableUse' },
  dpa: { href: '/legal/dpa', labelKey: 'dpa' },
  accessibility: { href: '/legal/accessibility', labelKey: 'accessibility' },
  cookieSettings: { action: 'cookieSettings', labelKey: 'cookieSettings' },
  doNotSell: { href: '/legal/privacy#privacy-choices', labelKey: 'doNotSell' },
  impressum: { href: '/legal/impressum', labelKey: 'impressum' },
  avisoLegal: { href: '/legal/aviso-legal', labelKey: 'avisoLegal' },
  companyDetails: { href: '/legal/company-details', labelKey: 'companyDetails' },
  privacyOfficer: { href: '/legal/privacy#privacy-officer', labelKey: 'privacyOfficer' },
  informationOfficer: { href: '/legal/privacy#information-officer', labelKey: 'informationOfficer' },
  paiaManual: { href: '/legal/paia-manual', labelKey: 'paiaManual' }
};
