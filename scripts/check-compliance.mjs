#!/usr/bin/env node
// Validates compliance.config.json structure and invariants taken from the master brief.
import { compliance, readJson, flatten, reporter, root } from './lib.mjs';
import fs from 'node:fs';
import path from 'node:path';

const { err, warn, done } = reporter('compliance check');
const cfg = compliance();
const en = flatten(readJson('messages/en.json'));
const slugs = readJson('src/i18n/slugs.json');
const pricing = readJson('content/pricing.json');
const entities = readJson('content/entities.json');

const CONSENT = ['opt-in', 'opt-out', 'notice-only'];
const POSITIONING = ['dispensary', 'association', 'medical', 'private-club', 'pilot'];
const SOLUTIONS = ['dispensaries', 'clubs', 'groups', 'white-label'];
const LINKS = ['privacy', 'cookies', 'terms', 'acceptableUse', 'dpa', 'accessibility', 'cookieSettings', 'doNotSell', 'impressum', 'avisoLegal', 'companyDetails', 'privacyOfficer', 'informationOfficer', 'paiaManual'];
const LEGAL = ['privacy', 'cookies', 'terms', 'acceptable-use', 'dpa', 'accessibility', 'impressum', 'aviso-legal', 'company-details', 'paia-manual'];
const LINK_TO_PAGE = { privacy: 'privacy', cookies: 'cookies', terms: 'terms', acceptableUse: 'acceptable-use', dpa: 'dpa', accessibility: 'accessibility', impressum: 'impressum', avisoLegal: 'aviso-legal', companyDetails: 'company-details', paiaManual: 'paia-manual' };
const LINK_TO_SECTION = { doNotSell: 'privacy-choices', privacyOfficer: 'privacy-officer', informationOfficer: 'information-officer' };
const REGIONS = ['us', 'ca', 'eu', 'au', 'sg', 'za'];
const REQUIRED = ['name', 'languages', 'defaultLocale', 'minAge', 'consentModel', 'honorGpc', 'currency', 'dataRegion', 'vercelRegion', 'positioning', 'solutions', 'requiredLinks', 'bannedClaims', 'requiredFooterText', 'legalPages', 'forms', 'trackAndTrace', 'privacy', 'overview', 'openQuestions'];

if (!cfg.version || !cfg.consentVersion) err('version and consentVersion are required');

// The 10 markets from the brief
const EXPECTED = { US: ['en-US', 'es-US'], CA: ['en-CA', 'fr-CA'], DE: ['de-DE', 'en-DE'], ES: ['es-ES', 'ca-ES', 'en-ES'], NL: ['nl-NL', 'en-NL'], CH: ['de-CH', 'fr-CH', 'it-CH', 'en-CH'], GB: ['en-GB'], AU: ['en-AU'], TH: ['th-TH', 'en-TH'], ZA: ['en-ZA', 'af-ZA', 'zu-ZA'] };
for (const [cc, locs] of Object.entries(EXPECTED)) {
  const m = cfg.markets[cc];
  if (!m) { err(`market ${cc} missing`); continue; }
  for (const l of locs) if (!m.languages.includes(l)) err(`${cc}: locale ${l} missing`);
}

const seenLocales = new Set();
for (const [cc, m] of Object.entries(cfg.markets)) {
  const at = `markets.${cc}`;
  for (const k of REQUIRED) if (!(k in m)) err(`${at}.${k} is missing`);
  if (!Number.isInteger(m.minAge) || m.minAge < 16 || m.minAge > 25) err(`${at}.minAge looks wrong (${m.minAge})`);
  if (!CONSENT.includes(m.consentModel)) err(`${at}.consentModel invalid`);
  if (!POSITIONING.includes(m.positioning)) err(`${at}.positioning invalid`);
  if (!REGIONS.includes(m.dataRegion)) err(`${at}.dataRegion must be one of ${REGIONS.join(', ')}`);
  if (!m.languages.includes(m.defaultLocale)) err(`${at}.defaultLocale not in languages`);
  for (const l of m.languages) {
    if (!/^[a-z]{2}-[A-Z]{2}$/.test(l)) err(`${at}: bad locale code ${l}`);
    if (l.split('-')[1] !== cc) err(`${at}: locale ${l} does not belong to ${cc}`);
    if (!cfg.languages[l.split('-')[0]]) err(`${at}: language ${l.split('-')[0]} not in "languages"`);
    if (seenLocales.has(l)) err(`locale ${l} defined twice`);
    seenLocales.add(l);
    if (!fs.existsSync(path.join(root, `messages/${l.split('-')[0]}.json`))) err(`${at}: messages/${l.split('-')[0]}.json missing`);
  }
  for (const s of m.solutions) if (!SOLUTIONS.includes(s)) err(`${at}.solutions has unknown "${s}"`);
  for (const l of m.requiredLinks) {
    if (!LINKS.includes(l)) { err(`${at}.requiredLinks unknown "${l}"`); continue; }
    if (LINK_TO_PAGE[l] && !m.legalPages.includes(LINK_TO_PAGE[l])) err(`${at}: requiredLink "${l}" needs legalPage "${LINK_TO_PAGE[l]}"`);
    if (LINK_TO_SECTION[l] && !m.privacy.special.some((s) => s.id === LINK_TO_SECTION[l])) err(`${at}: requiredLink "${l}" needs privacy.special section "${LINK_TO_SECTION[l]}"`);
    if (!en[`footer.links.${l === 'cookieSettings' ? 'cookieSettings' : l}`]) err(`${at}: footer.links.${l} missing in en.json`);
  }
  for (const p of m.legalPages) {
    if (!LEGAL.includes(p)) err(`${at}.legalPages unknown "${p}"`);
    if (!en[`legal.titles.${p}`]) err(`${at}: legal.titles.${p} missing in en.json`);
    if (!slugs.en[p]) err(`${at}: slug for legal page "${p}" missing`);
  }
  for (const k of m.requiredFooterText) if (!en[k]) err(`${at}.requiredFooterText key "${k}" missing in en.json`);
  if (!m.requiredFooterText.includes('footer.notice')) err(`${at}: footer.notice is mandatory ("Budify is software…")`);
  if (!(m.currency in pricing.plans.starter.prices)) err(`${at}: currency ${m.currency} has no price in content/pricing.json`);
  for (const k of ['sms', 'casl', 'doubleOptInNewsletter']) if (typeof m.forms?.[k] !== 'boolean') err(`${at}.forms.${k} must be boolean`);
  if (m.forms?.doubleOptInNewsletter !== true) err(`${at}: newsletters must use double opt-in`);
  if (!m.openQuestions?.length) err(`${at}.openQuestions is empty – every market needs counsel questions`);
  for (const l of ['privacy', 'terms', 'cookies']) if (!m.legalPages.includes(l)) err(`${at}: legalPages must include ${l}`);
  if (!m.legalPages.includes('dpa')) err(`${at}: legalPages must include dpa (B2B customers)`);
  if (!m.legalPages.includes('accessibility')) err(`${at}: legalPages must include accessibility`);
  if (!m.requiredLinks.includes('cookieSettings')) err(`${at}: footer needs a cookie-settings (consent withdrawal) link`);
  for (const t of m.trackAndTrace) if (!['available', 'export', 'roadmap', 'custom'].includes(t.status)) err(`${at}: trackAndTrace status "${t.status}" invalid`);
}

// Brief-specific invariants
const M = cfg.markets;
for (const cc of ['DE', 'ES', 'NL', 'CH', 'GB', 'ZA', 'TH']) if (M[cc]?.consentModel !== 'opt-in') err(`${cc}: consentModel must be opt-in (brief)`);
if (M.CA?.consentModel !== 'opt-in') err('CA: consentModel must be opt-in (Quebec Law 25 – province unknown)');
if (M.US && !(M.US.honorGpc && M.US.requiredLinks.includes('doNotSell') && M.US.minAge === 21)) err('US: needs honorGpc, doNotSell link and minAge 21');
if (M.CA && !(M.CA.forms.casl && M.CA.languages.includes('fr-CA') && M.CA.requiredLinks.includes('privacyOfficer'))) err('CA: needs CASL form handling, fr-CA and privacy officer link');
if (M.US && !M.US.forms.sms) err('US: SMS opt-in (TCPA) form handling required');
if (M.DE && !M.DE.requiredLinks.includes('impressum')) err('DE: Impressum required');
if (M.CH && !M.CH.requiredLinks.includes('impressum')) err('CH: Impressum required');
if (M.ES && !M.ES.requiredLinks.includes('avisoLegal')) err('ES: Aviso legal required');
if (M.ZA && !(M.ZA.requiredLinks.includes('informationOfficer') && M.ZA.requiredLinks.includes('paiaManual'))) err('ZA: information officer and PAIA manual links required');
if (M.DE && (M.DE.solutions.includes('dispensaries') || M.DE.positioning !== 'association')) err('DE: must be positioned as association admin software only (KCanG)');
if (M.TH && M.TH.minAge !== 20) warn('TH: minAge is not 20 – confirm with counsel');

// Entity placeholders
const placeholders = JSON.stringify(entities).match(/\[TO BE COMPLETED/g)?.length ?? 0;
if (placeholders) {
  const msg = `content/entities.json still has ${placeholders} "[TO BE COMPLETED]" placeholder(s) – required before launch`;
  if (process.env.STRICT_LAUNCH === '1') err(msg); else warn(msg);
}
if ((process.env.NEXT_PUBLIC_SITE_URL ?? '') === '' && process.env.STRICT_LAUNCH === '1') err('NEXT_PUBLIC_SITE_URL must be set when STRICT_LAUNCH=1');
done();
