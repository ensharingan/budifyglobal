// Draft legal page templates, generated per jurisdiction from compliance.config.json + content/entities.json.
// ALL of this text is a DRAFT to be reviewed, localised and adopted by qualified local counsel before launch.
// English is the reference language; translated versions must be produced professionally (see README).
import entities from '@root/content/entities.json';
import { MARKETS, complianceConfig } from '@/lib/compliance';
import type { LegalPageId, Market } from '@/lib/compliance/types';
import sub from '@root/content/subprocessors.json';

export type Block =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'component'; component: 'privacyChoices' };
export interface LegalSectionDoc { id: string; title: string; blocks: Block[] }
export interface LegalDoc { id: LegalPageId; title: string; sections: LegalSectionDoc[] }

export const DRAFT_DATE = '2026-10-09';
const GDPR_LIKE = new Set(['DE', 'ES', 'NL', 'CH', 'GB']);
const p = (text: string): Block => ({ type: 'p', text });
const ul = (items: string[]): Block => ({ type: 'ul', items });
const sec = (id: string, title: string, ...blocks: Block[]): LegalSectionDoc => ({ id, title, blocks });

type Ent = Record<string, string>;
function ent(country: string): Ent {
  const markets = entities.markets as Record<string, Ent>;
  return { ...(entities.global as Ent), ...(markets[country] ?? {}) };
}
const cookies = () => [
  'bud_locale – remembers the country/language you chose (strictly necessary; 12 months).',
  'bud_age – remembers that you confirmed you are a business operator of the required age (strictly necessary; 30 days).',
  'bud_consent – remembers your cookie choices and the version of this notice you saw (strictly necessary; 180 days).'
];

/* ------------------------------------------------------------------ privacy */
function privacy(c: string, m: Market): LegalDoc {
  const e = ent(c);
  const gdpr = GDPR_LIKE.has(c);
  const sections: LegalSectionDoc[] = [
    sec('who', '1. Who we are', p(`This Privacy Policy explains how ${e.legalName} (“Budify”, “we”, “us”) handles personal data collected through this website. Registered address: ${e.registeredAddress}. Contact for privacy matters: ${e.privacyEmail}.`),
      p('This policy covers the website and enquiries. When operators use the Budify platform, Budify processes their members’ and staff members’ data on the operator’s behalf as a processor/service provider under a separate Data Processing Agreement; the operator is responsible for telling its own members how their data is used.')),
    sec('data', '2. What we collect', ul([
      'Enquiry data: name, work email, organisation, role, country, phone (optional) and the message you write.',
      'Newsletter data (only if you ask for it): email address and confirmation record.',
      'Consent records: your cookie choices, a random identifier, timestamp and the consent text version. We do not store your IP address in the consent log.',
      'Technical data: IP address and request metadata processed by our hosting provider for security and delivery.',
      'Analytics data: only if you accept analytics cookies (or, where the law allows, until you opt out).'
    ]), p('This website is for business operators and professionals. We do not knowingly collect personal data from anyone below the minimum age shown on the operator confirmation screen.')),
    sec('purposes', '3. Why we use it and our legal basis', ul(gdpr
      ? ['To answer your enquiry and arrange a demo – your consent (Art. 6(1)(a) GDPR) and, where you ask for a quote, steps prior to entering into a contract (Art. 6(1)(b)).',
         'To send newsletters – your consent, confirmed by double opt-in (Art. 6(1)(a)).',
         'To keep the website secure and prevent abuse – our legitimate interests (Art. 6(1)(f)).',
         'To measure website usage – your consent via the cookie banner (Art. 6(1)(a)).',
         'To keep a record that you gave or withdrew consent – legal obligation / legitimate interests (Art. 6(1)(c)/(f)).']
      : ['To answer your enquiry and arrange a demo – your consent.',
         'To send newsletters – your consent, confirmed by double opt-in.',
         'To keep the website secure and prevent abuse – our legitimate interests.',
         'To measure website usage – your consent or, where the law allows, until you opt out.',
         'To keep a record of your consent choices – our legitimate interests and legal obligations.'])),
    sec('cookies', '4. Cookies and similar technologies', p('We use only the cookies listed in our Cookie Policy. Analytics and marketing technologies are switched off until you agree (or, where the law allows opt-out, until you reject them). You can change your choice at any time via “Cookie settings” in the footer.')),
    sec('sharing', '5. Who receives your data', p('We share personal data only with service providers that help us run the site and respond to you (hosting, email delivery, bot protection, analytics where enabled). They act on our instructions. See the current list on our Sub-processors page:'),
      ul(sub.items.map((s) => `${s.name} – ${s.purpose} (${s.status})`)),
      p('We do not sell your personal data.')),
    sec('transfers', '6. International transfers', p(m.privacy.transfers), p(`Data from enquiries made from this market is routed to our “${m.dataRegion}” data region where possible.`)),
    sec('retention', '7. How long we keep it', ul([
      'Enquiries: up to 24 months after our last contact, unless you become a customer.',
      'Newsletter subscriptions: until you unsubscribe.',
      'Consent records: up to 5 years, to evidence compliance.',
      '[TO BE COMPLETED BY COUNSEL: confirm retention periods against local limitation periods.]'
    ])),
    sec('rights', '8. Your rights', p(`Under ${m.privacy.laws.slice(0, 3).join(', ')} you may have the following rights, subject to conditions and exceptions:`), ul(m.privacy.rights),
      p(`To exercise your rights, email ${e.privacyEmail}. We will respond within the time limit set by law.`)),
    sec('complaints', '9. Complaints', p(`You may complain to the regulator: ${m.privacy.regulator.name} (${m.privacy.regulator.url}). We would appreciate the chance to resolve your concern first.`)),
    sec('security', '10. Security', p('We use measures appropriate to the risk, including HTTPS, access controls and data separation. No system is perfectly secure.')),
    sec('changes', '11. Changes', p('We will publish changes on this page and update the draft date shown above. If we materially change how we use personal data, we will tell you or ask for consent again where required.')),
    sec('contact', '12. Contact', p(`${e.legalName}, ${e.registeredAddress}. Email: ${e.privacyEmail}.`))
  ];
  for (const s of m.privacy.special) {
    const blocks: Block[] = [p(s.body)];
    if (s.id === 'privacy-choices') blocks.push({ type: 'component', component: 'privacyChoices' });
    if (s.id === 'privacy-officer') blocks.push(p(`Person in charge: ${e.privacyOfficerName ?? '[TO BE COMPLETED]'}. Email: ${e.privacyEmail}.`));
    if (s.id === 'information-officer') blocks.push(p(`Information Officer: ${e.informationOfficer}. Email: ${e.informationOfficerEmail ?? e.privacyEmail}. Regulator registration: ${e.regulatorRegistration}.`));
    sections.push(sec(s.id, s.title, ...blocks));
  }
  if (c === 'US') {
    sections.push(sec('ccpa', 'California and other US state disclosures',
      p('In the last 12 months we collected these categories of personal information: identifiers (name, email, IP address); commercial information (enquiry details); internet activity (only with analytics consent); and professional information (organisation, role). We collected them from you and from your device, for the business purposes in section 3. We do not sell personal information and do not share it for cross-context behavioural advertising unless you opt in. We do not knowingly sell or share the personal information of consumers under 16.'),
      p('Authorised agents may submit requests on your behalf by emailing ' + e.privacyEmail + '. We may need to verify identity.')));
  }
  return { id: 'privacy', title: 'Privacy Policy', sections };
}

/* ------------------------------------------------------------------ cookies */
function cookiePolicy(c: string, m: Market): LegalDoc {
  return { id: 'cookies', title: 'Cookie Policy', sections: [
    sec('what', '1. What are cookies?', p('Cookies are small files stored on your device. We also use similar technologies such as local storage. This policy lists everything this website sets or reads.')),
    sec('necessary', '2. Strictly necessary', p('These are needed for the site to work and to respect your choices. They do not require consent under most laws, including where consent is otherwise required for non-essential storage.'), ul(cookies())),
    sec('analytics', '3. Analytics (optional)', p(m.consentModel === 'opt-in'
      ? 'Analytics is off until you accept it. Nothing is requested from an analytics provider before you do.'
      : 'Analytics may run by default in this region until you reject it, and is always off if your browser sends a Global Privacy Control or Do Not Track signal.'),
      p('Which provider is used depends on how the site is configured at launch (see the Sub-processors page). [TO BE COMPLETED: list each analytics cookie with name, purpose and lifetime once the provider is chosen.]')),
    sec('marketing', '4. Marketing (optional)', p('We do not currently set marketing or advertising cookies. If this changes we will ask for your consent first and update this policy.')),
    sec('choices', '5. Your choices', p('Use “Cookie settings” in the footer to change or withdraw consent at any time. You can also delete cookies in your browser settings. Withdrawing consent does not affect processing carried out before withdrawal.'),
      p(`Consent log: each decision is recorded with a timestamp and the version of this notice (currently ${complianceConfig.consentVersion}). You are asked again when the version changes or after 180 days.`))
  ] };
}

/* -------------------------------------------------------------------- terms */
function terms(c: string, m: Market): LegalDoc {
  const e = ent(c);
  return { id: 'terms', title: 'Terms of Service (website)', sections: [
    sec('scope', '1. Scope', p(`These terms govern your use of this website operated by ${e.legalName}. The Budify platform itself is provided under a separate customer agreement.`)),
    sec('b2b', '2. Business use only', p('This website is for business operators and professionals. By continuing you confirm you meet the minimum age shown on the confirmation screen and are visiting for business purposes. Nothing here is an offer to sell cannabis or any other product to the public.')),
    sec('software', '3. Software only; your responsibilities', p('Budify supplies software. Customers are responsible for holding all licences, permits and registrations, and for complying with all laws that apply to them. Information on this website is general, may be incomplete or out of date, and is not legal advice.')),
    sec('ip', '4. Intellectual property', p('The website, its content and the Budify name and marks belong to us or our licensors. You may view and share pages for non-commercial business evaluation, but may not copy, scrape or reuse them otherwise without permission.')),
    sec('conduct', '5. Acceptable use', p('Do not misuse the website, probe or interfere with its security, submit false information or send unlawful content. See the Acceptable Use Policy.')),
    sec('liability', '6. Disclaimers and liability', p('To the extent permitted by law, the website is provided “as is”, and we are not liable for indirect or consequential loss arising from your use of it. Nothing limits liability that cannot be limited by law (for example for death or personal injury caused by negligence, or fraud).')),
    sec('law', '7. Governing law and disputes', p(`[TO BE COMPLETED BY COUNSEL: governing law and venue for ${m.name}, consumer-law carve-outs where relevant, and language of the binding version.]`)),
    sec('changes', '8. Changes', p('We may update these terms. The version in force is the one published on this page.')),
    sec('contact', '9. Contact', p(`${e.legalName}, ${e.registeredAddress}. Email: ${e.legalEmail}.`))
  ] };
}

/* ------------------------------------------------------------ acceptable use */
function acceptableUse(_c: string, m: Market): LegalDoc {
  return { id: 'acceptable-use', title: 'Acceptable Use Policy', sections: [
    sec('purpose', '1. Purpose', p('This policy applies to the website and to customers’ use of the Budify platform.')),
    sec('must', '2. Customers must', ul([
      `Hold every licence, permit or registration required in ${m.name} and keep it current.`,
      'Use Budify only for lawful activity and only with members, staff and records they are entitled to hold.',
      'Verify age and eligibility as the law requires; Budify records the result but does not replace the operator’s duty.',
      'Keep account credentials confidential and give staff only the access their role needs.'
    ])),
    sec('mustnot', '3. Customers must not', ul([
      'Use Budify to sell or supply to minors, or to anyone the law does not allow them to sell or supply to.',
      'Use Budify to advertise, promote or market cannabis products to the public, or to publish product, strain or price lists through Budify channels where that is prohibited.',
      'Attempt to bypass legal limits, reporting duties or security controls.',
      'Upload unlawful content or data they have no right to process.',
      'Probe, scrape, overload or reverse-engineer the service.'
    ])),
    sec('enforcement', '4. Enforcement', p('We may suspend or terminate access where this policy is breached or where required by law or by our payment, hosting or other providers. Where possible we will give notice first.'))
  ] };
}

/* ---------------------------------------------------------------------- DPA */
function dpa(c: string, m: Market): LegalDoc {
  const e = ent(c);
  const t = GDPR_LIKE.has(c);
  return { id: 'dpa', title: 'Data Processing Agreement (customers)', sections: [
    sec('parties', '1. Parties and roles', p(`This DPA forms part of the agreement between ${e.legalName} (“Budify”, processor / service provider) and the customer organisation (“Customer”, controller / business). It applies to personal data Budify processes on the Customer’s behalf through the platform, under: ${m.privacy.laws.slice(0, 4).join('; ')}.`)),
    sec('subject', '2. Subject matter, duration and nature', p('Provision of the Budify point-of-sale and membership-management platform for the term of the agreement, including hosting, storage, backup, support and exports.')),
    sec('data', '3. Data subjects and data categories (Annex 1)', ul([
      'Data subjects: Customer’s members and customers, and Customer’s staff.',
      'Categories: identity and contact details, membership status and dates, transaction/allocation and visit records, staff account data, and – only where the Customer chooses to upload them – ID document images and signatures.',
      '[TO BE COMPLETED BY COUNSEL: whether membership in a cannabis organisation is treated as special-category / sensitive data in this jurisdiction, and any additional safeguards required.]'
    ])),
    sec('instructions', '4. Processing on instructions', p('Budify processes personal data only on the Customer’s documented instructions (this DPA, the agreement and the Customer’s use of the platform), unless required by law, in which case Budify will inform the Customer where permitted.')),
    sec('confidentiality', '5. Confidentiality', p('Budify ensures that people authorised to process personal data are bound by confidentiality.')),
    sec('security', '6. Security measures (Annex 2)', ul(['Tenant data separated at database level with row-level access rules', 'Role-based access and individual accounts', 'Encryption in transit (HTTPS)', 'Audit trails for key actions', 'Backups and restoration process', '[TO BE COMPLETED: add organisational measures and confirm encryption at rest with infrastructure providers]'])),
    sec('subprocessors', '7. Sub-processors', p('The Customer gives general authorisation for the sub-processors listed on the Sub-processors page. Budify will give at least 30 days’ notice of additions or replacements; the Customer may object on reasonable data-protection grounds. Budify imposes equivalent data-protection obligations on sub-processors.')),
    sec('transfers', '8. International transfers', p(m.privacy.transfers),
      p(t ? (c === 'GB' ? 'Where required, transfers rely on the UK International Data Transfer Agreement or the UK Addendum to the EU Standard Contractual Clauses.' : 'Where required, transfers rely on adequacy decisions or the EU Standard Contractual Clauses (Module 2 / 3), incorporated by reference.') : '[TO BE COMPLETED BY COUNSEL: transfer mechanism for this jurisdiction.]'))
    ,
    sec('rights', '9. Assistance with data-subject requests', p('Budify will, taking into account the nature of processing, assist the Customer by appropriate technical and organisational measures to respond to requests to exercise data-subject rights, and will forward requests it receives directly.')),
    sec('breach', '10. Personal data breaches', p('Budify will notify the Customer without undue delay – and in any event within [48] hours – after becoming aware of a personal data breach affecting Customer data, with the information reasonably available.')),
    sec('audit', '11. Audits', p('Budify will make available information necessary to demonstrate compliance and allow for reasonable audits on reasonable notice, no more than once a year unless required by a regulator or following a breach.')),
    sec('deletion', '12. Deletion and return', p('On termination, Budify will make Customer data available for export for [30] days and then delete it, unless law requires retention.')),
    sec('liability', '13. Liability and precedence', p('Liability is governed by the agreement. If this DPA conflicts with the agreement on personal-data matters, this DPA prevails.')),
    sec('signature', '14. Execution', p('[TO BE COMPLETED: signature blocks and effective date.]'))
  ] };
}

/* ------------------------------------------------------------ accessibility */
function accessibility(c: string, m: Market): LegalDoc {
  const law: Record<string, string> = {
    US: 'We aim to align with WCAG 2.2 level AA, which courts and the US Department of Justice commonly reference when assessing accessibility under the Americans with Disabilities Act.',
    CA: 'We aim to align with WCAG 2.2 level AA in support of Ontario’s AODA and the Accessible Canada Act, where they apply.',
    DE: 'We aim to meet WCAG 2.2 level AA, in line with the European Accessibility Act as implemented in Germany (BFSG), to the extent it applies to us.',
    ES: 'We aim to meet WCAG 2.2 level AA, in line with the European Accessibility Act as implemented in Spain, to the extent it applies to us.',
    NL: 'We aim to meet WCAG 2.2 level AA, in line with the European Accessibility Act as implemented in the Netherlands, to the extent it applies to us.',
    CH: 'We aim to meet WCAG 2.2 level AA as good practice under Swiss disability-equality law.',
    GB: 'We aim to meet WCAG 2.2 level AA in line with the Equality Act 2010.',
    AU: 'We aim to meet WCAG 2.2 level AA in line with the Disability Discrimination Act 1992.',
    TH: 'We aim to meet WCAG 2.2 level AA as good practice.',
    ZA: 'We aim to meet WCAG 2.2 level AA as good practice.'
  };
  const e = ent(c);
  return { id: 'accessibility', title: 'Accessibility Statement', sections: [
    sec('commitment', '1. Our commitment', p('Budify is committed to making this website usable by everyone. ' + law[c]), p('This site is business-to-business software marketing. Where accessibility rules apply only to services for consumers, we follow them voluntarily.')),
    sec('measures', '2. What we do', ul(['Semantic HTML, landmarks and a skip link', 'Keyboard operation and visible focus on every control', 'Colour contrast of at least 4.5:1 for text', 'Targets of at least 24×24 CSS pixels (WCAG 2.2, 2.5.8)', 'Dialogs (operator confirmation, cookie settings) trap focus and return it on close', 'Respect for reduced-motion and forced-colour settings', 'Language set per page, and right-to-left layout support in the CSS']),),
    sec('limits', '3. Known limitations', p('This statement is a draft. A formal conformance evaluation has not yet been completed. Some content (for example articles and compliance overviews) is available in English only. [TO BE COMPLETED after the pre-launch accessibility audit.]')),
    sec('feedback', '4. Feedback and complaints', p(`If you have trouble using any part of this site, email ${e.generalEmail} and we will respond within five business days. If you are not satisfied, you may contact the competent enforcement body in ${m.name}.`))
  ] };
}

/* -------------------------------------------------------- imprint variants */
function imprintCommon(c: string): Block[] {
  const e = ent(c);
  return [ul([`Provider: ${e.legalName}`, `Address: ${e.registeredAddress}`, `Registration number: ${e.registrationNumber}`, `Directors / authorised representatives: ${e.directors}`, `Email: ${e.generalEmail}`, `Phone: ${e.phone}`, `VAT number: ${e.vatNumber}`])];
}
function impressum(c: string): LegalDoc {
  const e = ent(c);
  return { id: 'impressum', title: 'Impressum', sections: [
    sec('provider', 'Angaben gemäß § 5 DDG / provider identification', ...imprintCommon(c),
      ul([`Register entry: ${e.registerEntry ?? e.uid ?? '[TO BE COMPLETED]'}`, `VAT ID: ${e.vatId ?? e.uid ?? '[TO BE COMPLETED]'}`, `Authorised representative: ${e.authorisedRepresentative ?? e.representative ?? '[TO BE COMPLETED]'}`])),
    sec('content', 'Verantwortlich für den Inhalt / responsible for content (§ 18 Abs. 2 MStV)', p(`${e.legalName}, ${e.registeredAddress}`)),
    sec('disclaimer', 'Hinweis / notice', p('Budify is software. Customers are responsible for holding all licences and complying with local law. This website contains no advertising for cannabis products or for any association.')),
    sec('dispute', 'Streitbeilegung / dispute resolution', p('[TO BE COMPLETED BY COUNSEL: statement on participation in consumer dispute-resolution proceedings, if applicable to a B2B-only offering.]'))
  ] };
}
function avisoLegal(c: string): LegalDoc {
  const e = ent(c);
  return { id: 'aviso-legal', title: 'Aviso legal', sections: [
    sec('identification', 'Datos identificativos (art. 10 LSSI-CE) / provider identification', ...imprintCommon(c), ul([`Registro Mercantil: ${e.registerEntry}`, `NIF/CIF: ${e.taxId}`])),
    sec('use', 'Condiciones de uso / conditions of use', p('Access to this website is free and implies acceptance of these conditions and of the Terms of Service. The website is intended for business users only.')),
    sec('ip', 'Propiedad intelectual / intellectual property', p('All content is protected by intellectual-property law. Reproduction without permission is prohibited.')),
    sec('law', 'Legislación aplicable / governing law', p('[TO BE COMPLETED BY COUNSEL: applicable law and jurisdiction for Spain.]'))
  ] };
}
function companyDetails(c: string): LegalDoc {
  const e = ent(c);
  const extra: Record<string, string[]> = {
    NL: [`KvK number: ${e.kvk}`, `BTW-id: ${e.btw}`],
    GB: [`Companies House number: ${e.companiesHouseNumber}`, `Registered office: ${e.registeredOffice}`, `ICO registration reference: ${e.icoRegistration}`, `VAT number: ${e.vatNumber}`],
    AU: [`ABN: ${e.abn}`, `ACN: ${e.acn}`],
    ZA: [`Company registration (CIPC): ${e.registrationNumber}`, `Information Officer: ${e.informationOfficer}`, 'ECTA section 43 supplier information: see below']
  };
  const sections = [sec('details', 'Company details', ...imprintCommon(c), ul(extra[c] ?? []))];
  if (c === 'ZA') sections.push(sec('ecta', 'Supplier information (ECTA s.43)', ul([`Full name and legal status: ${e.legalName}`, `Physical address: ${e.registeredAddress}`, `Contact: ${e.generalEmail}`, `Registration number: ${e.registrationNumber}`, '[TO BE COMPLETED: membership of self-regulatory bodies, prices, payment, delivery and complaint-handling details as required by s.43]'])));
  return { id: 'company-details', title: 'Company details', sections };
}

/* ---------------------------------------------------------------- PAIA manual */
function paia(c: string): LegalDoc {
  const e = ent(c);
  return { id: 'paia-manual', title: 'PAIA manual', sections: [
    sec('intro', '1. Introduction', p(`This manual is prepared under section 51 of the Promotion of Access to Information Act 2 of 2000 (PAIA) for ${e.legalName} and is read with POPIA. Manual document (PDF): ${e.paiaManualUrl}.`)),
    sec('contact', '2. Contact details of the head of the private body / Information Officer', ul([`Name: ${e.informationOfficer}`, `Email: ${e.informationOfficerEmail}`, `Postal and physical address: ${e.registeredAddress}`])),
    sec('guide', '3. Guide of the Information Regulator', p('A guide on how to use PAIA is available from the Information Regulator (https://inforegulator.org.za).')),
    sec('records', '4. Records available', ul(['Automatically available without a request: website content, marketing material and published policies.', 'Available on request in terms of PAIA: corporate records, contracts, financial records, personnel records and customer records, subject to the grounds of refusal in PAIA.', '[TO BE COMPLETED: schedule of categories of records held, per section 51(1)(b)]'])),
    sec('popia', '5. Processing of personal information (POPIA s.51(1)(c))', ul(['Purpose: providing and supporting software services, responding to enquiries, legal compliance.', 'Categories of data subjects: customers’ staff and members, website visitors, suppliers, employees.', 'Recipients: hosting and service providers listed on the Sub-processors page.', 'Transfers outside South Africa: see the Privacy Policy.', '[TO BE COMPLETED: description of information-security measures]'])),
    sec('request', '6. How to request access', p('Submit the prescribed form (Form 2) to the Information Officer. State the record requested, the requester’s identity and the form of access required. A request fee and a deposit may apply as prescribed. We will decide within 30 days, which may be extended as PAIA allows.')),
    sec('remedies', '7. Remedies', p('If a request is refused, the requester may lodge an internal appeal where applicable, complain to the Information Regulator, or apply to court, as provided by PAIA.'))
  ] };
}

export function buildLegalDoc(page: LegalPageId, country: string): LegalDoc | null {
  const m = MARKETS[country];
  if (!m || !m.legalPages.includes(page)) return null;
  switch (page) {
    case 'privacy': return privacy(country, m);
    case 'cookies': return cookiePolicy(country, m);
    case 'terms': return terms(country, m);
    case 'acceptable-use': return acceptableUse(country, m);
    case 'dpa': return dpa(country, m);
    case 'accessibility': return accessibility(country, m);
    case 'impressum': return impressum(country);
    case 'aviso-legal': return avisoLegal(country);
    case 'company-details': return companyDetails(country);
    case 'paia-manual': return paia(country);
    default: return null;
  }
}
