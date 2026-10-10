export type ConsentModel = 'opt-in' | 'opt-out' | 'notice-only';
export type Positioning = 'dispensary' | 'association' | 'medical' | 'private-club' | 'pilot';
export type SolutionId = 'dispensaries' | 'clubs' | 'groups' | 'white-label';
export type TraceStatus = 'available' | 'export' | 'roadmap' | 'custom';
export type FooterLinkKey =
  | 'privacy' | 'cookies' | 'terms' | 'acceptableUse' | 'dpa' | 'accessibility'
  | 'cookieSettings' | 'doNotSell' | 'impressum' | 'avisoLegal' | 'companyDetails'
  | 'privacyOfficer' | 'informationOfficer' | 'paiaManual';
export type LegalPageId =
  | 'privacy' | 'cookies' | 'terms' | 'acceptable-use' | 'dpa' | 'accessibility'
  | 'impressum' | 'aviso-legal' | 'company-details' | 'paia-manual';

export interface LegalSection { id: string; title: string; body: string }

export interface Market {
  name: string;
  /** 'sa' = photographic, cannabis-themed visuals copied from budify.co.za; 'neutral' = abstract illustrations only */
  visuals: 'sa' | 'neutral';
  languages: string[];
  defaultLocale: string;
  minAge: number;
  minAgeMedicalOnlyStates?: number;
  minAgeByLocale?: Record<string, number>;
  minAgeNotes?: string;
  consentModel: ConsentModel;
  honorGpc: boolean;
  currency: string;
  dataRegion: string;
  vercelRegion: string;
  positioning: Positioning;
  solutions: SolutionId[];
  requiredLinks: FooterLinkKey[];
  bannedClaims: string[];
  requiredFooterText: string[];
  legalPages: LegalPageId[];
  forms: { sms: boolean; casl: boolean; doubleOptInNewsletter: boolean };
  trackAndTrace: { system: string; status: TraceStatus }[];
  privacy: {
    laws: string[];
    regulator: { name: string; url: string };
    rights: string[];
    transfers: string;
    special: LegalSection[];
  };
  overview: { laws: string; advertising: string; support: string; caveat: string };
  openQuestions: string[];
}

export interface ComplianceConfig {
  version: string;
  consentVersion: string;
  status: string;
  global: {
    defaultLocale: string;
    bannedClaims: string[];
    bannedImageryTags: string[];
    allowedImageryTags: string[];
    requiredFooterTextKeys: string[];
    phase2Markets: { country: string; locales: string[]; rtl?: boolean }[];
  };
  languages: Record<string, { name: string; native: string; dir: 'ltr' | 'rtl'; script: string }>;
  markets: Record<string, Market>;
}
