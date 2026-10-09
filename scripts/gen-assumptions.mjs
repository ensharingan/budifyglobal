// Generates docs/COMPLIANCE-ASSUMPTIONS.md from compliance.config.json (openQuestions + global assumptions).
import fs from 'node:fs';
import path from 'node:path';
import { root, compliance } from './lib.mjs';

const c = compliance();
const L = [];
L.push('# Compliance assumptions & open questions', '');
L.push(`Generated from \`compliance.config.json\` v${c.version} (consent v${c.consentVersion}). **Status: DRAFT – nothing here is legal advice. Every item needs verification by qualified local counsel before launch.** Regenerate with \`npm run assumptions\`.`, '');
L.push('## 1. Global assumptions', '');
const G = [
  'Budify is **software only**. The site never sells, offers, prices, depicts or facilitates the sale/consumption of cannabis; customers are licensed/lawful operators. (Counsel: confirm "software for operators" is not treated as facilitation in any market, incl. payment/ad-platform rules.)',
  'The age/role gate is **self-declared** (click-through + first-party cookie, strictly necessary). No ID verification. Counsel: is self-declaration enough in each market?',
  'The gate stays in the DOM (content `inert` while open) so crawlers and screen readers are not hard-blocked. Counsel: confirm this is acceptable and not "blocking by geography".',
  'Consent model: EU/EEA, UK, CH, ZA, CA-QC, TH = **opt-in**; US = **opt-out** + GPC/DNT honoured; AU = **notice-only**. The effective mode is the **strictest** of page-market and IP-geo country. Unknown countries default to opt-in.',
  'IP-geo uses edge headers (`x-vercel-ip-country`, `cf-ipcountry`); the IP is not stored. Counsel: is edge geolocation for compliance mode itself lawful without consent (legitimate interest / necessary)?',
  'Consent log stores timestamp, consent version, choices, locale, country – **no IP, no user ID**. Retention period is undecided.',
  'Consent cookie lifetime 180 days; consent re-requested whenever `consentVersion` changes.',
  'Analytics: GA4 with Consent Mode v2 (default denied; script loads only after consent). Counsel: EU transfer basis for GA4 / consider Plausible or self-hosted alternative.',
  'Lead data is routed to region-specific webhooks (`LEAD_WEBHOOK_URL_<REGION>`). Data-residency claims depend on the processors you wire up – verify before stating them publicly.',
  'Newsletter = double opt-in (HMAC-signed confirm link, Resend). Contact forms carry an unticked consent checkbox, purpose text and privacy link. US SMS (TCPA) and CA (CASL) fields only where applicable.',
  'Legal pages are **templates**, labelled "Draft – review by qualified local counsel before launch". Machine-translated legal text must be replaced by professional translation; non-English legal pages fall back to reviewed English where no translation exists.',
  'Entity details, addresses, registration numbers, DPO/EU-representative/UK-representative and imprint fields are `[TO BE COMPLETED]` placeholders in `content/entities.json`. `STRICT_LAUNCH=1` fails the build while any remain.',
  'Pricing is **indicative**: ZAR is the only real price list; other currencies are converted placeholders. Counsel/finance: tax display (VAT/GST/sales tax), B2B-only wording.',
  'Integrations are marked roadmap/export only; no certifications, testimonials, customer logos or track-and-trace connectivity are claimed. Add only what is true and evidenced.',
  'Machine-drafted translations (fr, es, de, th, zu; core-only it, nl, ca, af) are **not** professionally reviewed. Thai and Zulu in particular need native review.',
  'Security headers: CSP uses `\'unsafe-inline\'` for scripts because of the Next.js bootstrap; move to nonce-based CSP if policy requires. Rate limiting is in-memory per instance – use an edge/WAF or Redis limiter in production.',
  'The site ships `noindex` (header, robots, empty sitemaps) until `ALLOW_INDEXING=1` is set.',
  'Phase-2 markets (UY, CO, MT, CZ, LU, IL/he-IL RTL) are not implemented; the architecture is RTL-ready but untested.',
  'Ad-platform policies (Google, Meta, LinkedIn) may restrict even B2B software ads in this sector; no ads are configured.',
  'Accessibility target is WCAG 2.2 AA; automated and keyboard checks done, **no formal audit or screen-reader test matrix** yet.',
];
G.forEach((g, i) => L.push(`${i + 1}. ${g}`));
L.push('', '## 2. Market-by-market questions for counsel', '');
for (const [code, m] of Object.entries(c.markets)) {
  L.push(`### ${code} – ${m.name}`, '');
  L.push(`Locales: ${m.languages.join(', ')} · min age ${m.minAge}${m.minAgeMedicalOnlyStates ? ` (${m.minAgeMedicalOnlyStates})` : ''} · consent: ${m.consentModel}${m.honorGpc ? ' + GPC' : ''} · data region: ${m.dataRegion} · positioning: ${m.positioning}`, '');
  if (m.overview && typeof m.overview === 'object') { for (const [k, v] of Object.entries(m.overview)) L.push(`- **${k}:** ${v}`); L.push(''); }
  else if (m.overview) L.push(`*Assumption:* ${m.overview}`, '');
  (m.openQuestions || []).forEach((q) => L.push(`- [ ] ${q}`));
  L.push('');
}
L.push('## 3. Sign-off', '', '| Market | Counsel | Date | Notes |', '|---|---|---|---|');
Object.keys(c.markets).forEach((k) => L.push(`| ${k} | | | |`));
L.push('');
fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
fs.writeFileSync(path.join(root, 'docs/COMPLIANCE-ASSUMPTIONS.md'), L.join('\n'));
console.log('wrote docs/COMPLIANCE-ASSUMPTIONS.md');
