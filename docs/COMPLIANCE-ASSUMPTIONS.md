# Compliance assumptions & open questions

Generated from `compliance.config.json` v2026.10.09-draft1 (consent v2026-10-09.1). **Status: DRAFT – nothing here is legal advice. Every item needs verification by qualified local counsel before launch.** Regenerate with `npm run assumptions`.

## 1. Global assumptions

1. Budify is **software only**. The site never sells, offers, prices, depicts or facilitates the sale/consumption of cannabis; customers are licensed/lawful operators. (Counsel: confirm "software for operators" is not treated as facilitation in any market, incl. payment/ad-platform rules.)
2. The age/role gate is **self-declared** (click-through + first-party cookie, strictly necessary). No ID verification. Counsel: is self-declaration enough in each market?
3. The gate stays in the DOM (content `inert` while open) so crawlers and screen readers are not hard-blocked. Counsel: confirm this is acceptable and not "blocking by geography".
4. Consent model: EU/EEA, UK, CH, ZA, CA-QC, TH = **opt-in**; US = **opt-out** + GPC/DNT honoured; AU = **notice-only**. The effective mode is the **strictest** of page-market and IP-geo country. Unknown countries default to opt-in.
5. IP-geo uses edge headers (`x-vercel-ip-country`, `cf-ipcountry`); the IP is not stored. Counsel: is edge geolocation for compliance mode itself lawful without consent (legitimate interest / necessary)?
6. Consent log stores timestamp, consent version, choices, locale, country – **no IP, no user ID**. Retention period is undecided.
7. Consent cookie lifetime 180 days; consent re-requested whenever `consentVersion` changes.
8. Analytics: GA4 with Consent Mode v2 (default denied; script loads only after consent). Counsel: EU transfer basis for GA4 / consider Plausible or self-hosted alternative.
9. Lead data is routed to region-specific webhooks (`LEAD_WEBHOOK_URL_<REGION>`). Data-residency claims depend on the processors you wire up – verify before stating them publicly.
10. Newsletter = double opt-in (HMAC-signed confirm link, Resend). Contact forms carry an unticked consent checkbox, purpose text and privacy link. US SMS (TCPA) and CA (CASL) fields only where applicable.
11. Legal pages are **templates**, labelled "Draft – review by qualified local counsel before launch". Machine-translated legal text must be replaced by professional translation; non-English legal pages fall back to reviewed English where no translation exists.
12. Entity details, addresses, registration numbers, DPO/EU-representative/UK-representative and imprint fields are `[TO BE COMPLETED]` placeholders in `content/entities.json`. `STRICT_LAUNCH=1` fails the build while any remain.
13. Pricing is **indicative**: ZAR is the only real price list; other currencies are converted placeholders. Counsel/finance: tax display (VAT/GST/sales tax), B2B-only wording.
14. Integrations are marked roadmap/export only; no certifications, testimonials, customer logos or track-and-trace connectivity are claimed. Add only what is true and evidenced.
15. Machine-drafted translations (fr, es, de, th, zu; core-only it, nl, ca, af) are **not** professionally reviewed. Thai and Zulu in particular need native review.
16. Security headers: CSP uses `'unsafe-inline'` for scripts because of the Next.js bootstrap; move to nonce-based CSP if policy requires. Rate limiting is in-memory per instance – use an edge/WAF or Redis limiter in production.
17. The site ships `noindex` (header, robots, empty sitemaps) until `ALLOW_INDEXING=1` is set.
18. Phase-2 markets (UY, CO, MT, CZ, LU, IL/he-IL RTL) are not implemented; the architecture is RTL-ready but untested.
19. Ad-platform policies (Google, Meta, LinkedIn) may restrict even B2B software ads in this sector; no ads are configured.
20. Accessibility target is WCAG 2.2 AA; automated and keyboard checks done, **no formal audit or screen-reader test matrix** yet.

## 2. Market-by-market questions for counsel

### US – United States

Locales: en-US, es-US · min age 21 (18) · consent: opt-out + GPC · data region: us · positioning: dispensary

- **laws:** Cannabis remains a controlled substance under federal law; state regimes (and seed-to-sale rules) vary widely.
- **advertising:** State advertising rules differ (no minor targeting, no health claims). This site is B2B software marketing only.
- **support:** Budify records member and sales data, stock movements and audit trails, and can export reports in CSV so operators can supply data to their state track-and-trace and tax reporting.
- **caveat:** Budify does not file reports for you and is not a licensed seed-to-sale system. Track-and-trace integrations listed are roadmap items, not current features.

- [ ] Which states may we market to, and does any state restrict B2B software marketing to cannabis licensees?
- [ ] Should the age gate be 21 everywhere or 18 where only medical programmes exist (state-by-state gating needs state geolocation)?
- [ ] Do ad platform policies (Google, Meta, LinkedIn) permit our B2B software ads if we run any?
- [ ] Is the Do-Not-Sell/Share link plus GPC handling sufficient under CPRA regulations and the Colorado/Connecticut universal opt-out mechanism rules?
- [ ] TCPA: is our SMS consent wording and record-keeping sufficient for B2B contacts?
- [ ] Is our DPA/CCPA service-provider language adequate for customers' member data?

### CA – Canada

Locales: en-CA, fr-CA · min age 19 · consent: opt-in + GPC · data region: ca · positioning: dispensary

- **laws:** The Cannabis Act strictly limits promotion; provinces regulate retail. Quebec requires a full French version of commercial sites.
- **advertising:** No lifestyle or brand-appeal promotion. This site is B2B software marketing for licensed operators only.
- **support:** Budify keeps sales, stock movement and member-visit records with audit trails and CSV export so licensed operators can prepare provincial and federal reporting.
- **caveat:** Provincial system integrations listed are roadmap items. Operators remain responsible for provincial licensing and reporting.

- [ ] Is a 19+ default (21+ for fr-CA) the correct per-province approach, or do we need province selection?
- [ ] Does PIPEDA-based implied consent suffice for analytics outside Quebec, or should opt-in apply nationwide (current setting)?
- [ ] Law 25: required content of the privacy policy, the named person in charge, and transfer impact assessments.
- [ ] Charter of the French Language: is fr-CA complete and 'at least equally available' (including legal pages, forms and emails)?
- [ ] CASL: validity of our express-consent wording and records; B2B exemptions that might apply.
- [ ] Cannabis Act s.17 promotion limits: does B2B SaaS marketing to licence holders fall outside the promotion prohibition?

### DE – Germany

Locales: de-DE, en-DE · min age 18 · consent: opt-in · data region: eu · positioning: association

- **laws:** The Consumer Cannabis Act (KCanG) allows non-commercial cultivation associations (Anbauvereinigungen); advertising and promotion of cannabis and of clubs is prohibited.
- **advertising:** Budify is positioned strictly as administration software for associations. This site does not advertise any club or product, and shows no consumer-facing offers.
- **support:** Budify supports member registers, age and membership-status checks, allocation-limit tracking and documentation exports that associations can use for their own record-keeping duties.
- **caveat:** Associations remain solely responsible for their permit (Erlaubnis), prevention concept, reporting and record-keeping duties.

- [ ] KCanG §6 (Werbeverbot): does marketing software to associations ever count as 'promotion' of clubs, and may we show case studies?
- [ ] Is the club-only (no dispensary POS) positioning correct for Germany, and how should the 'POS' feature be framed?
- [ ] Impressum content under DDG §5 for a non-German operator (representative, VAT ID, register entry).
- [ ] TDDDG §25: confirm equal-weight consent banner design and that strictly-necessary storage (age gate, consent log) is exempt.
- [ ] Which state data protection authority is competent, and do we need a German GDPR Art. 27 representative?
- [ ] Whether DE legal pages must be exclusively in German to be effective.

### ES – Spain

Locales: es-ES, ca-ES, en-ES · min age 18 · consent: opt-in · data region: eu · positioning: association

- **laws:** Cannabis associations operate in a legal grey area that differs between autonomous communities; public promotion is not permitted.
- **advertising:** Copy is limited to membership-administration software for associations. No promotion to the public.
- **support:** Budify supports member registers, membership status, allocation records and exportable documentation that associations can use for their own record-keeping.
- **caveat:** Associations are responsible for assessing the legality of their activities in their region.

- [ ] Is it lawful to market membership software to cannabis associations in Spain, and do regional rules (e.g. Catalonia, Basque Country) restrict it?
- [ ] Aviso legal content required by LSSI art. 10 for a non-Spanish provider.
- [ ] AEPD cookie guidance (2023 update): confirm banner layout and the 'reject all' prominence.
- [ ] Is Catalan (ca-ES) required for any legal page for Catalan users?
- [ ] Do customers' member records count as special-category data, and what extra DPA terms are needed?

### NL – Netherlands

Locales: nl-NL, en-NL · min age 18 · consent: opt-in · data region: eu · positioning: dispensary

- **laws:** Coffeeshops are tolerated under the gedoogbeleid; the licensed-supply 'Wietexperiment' is a separate closed-chain channel. Advertising is prohibited.
- **advertising:** B2B copy only, addressed to operators. No consumer-facing material.
- **support:** Budify supports point of sale, stock records, member/ID-check records and exports that operators can use for bookkeeping and for programme reporting.
- **caveat:** Operators remain responsible for compliance with gedoogcriteria or experiment requirements.

- [ ] Does marketing POS software to coffeeshops conflict with the advertising ban (Opiumwet art. 3 / Opiumwet 'reclameverbod')?
- [ ] Which KvK/company details and which Dutch entity should appear on the site?
- [ ] Telecommunicatiewet 11.7a: confirm whether first-party analytics need consent.
- [ ] Should experiment-shop (Wietexperiment) functionality be named, or only the generic 'closed-chain reporting export'?

### CH – Switzerland

Locales: de-CH, fr-CH, it-CH, en-CH · min age 18 · consent: opt-in · data region: eu · positioning: pilot

- **laws:** Cannabis with more than 1% THC remains prohibited except in authorised pilot trials (Art. 8a Narcotics Act); public promotion is not permitted.
- **advertising:** Copy is limited to B2B software for authorised pilot-trial operators.
- **support:** Budify supports participant registers, controlled dispensing records and exportable documentation for authorised pilot programmes.
- **caveat:** Only organisations holding the relevant authorisation should use Budify for regulated cannabis supply.

- [ ] Are pilot-trial operators the only legitimate customer segment in Switzerland, and does the new legislative framework change this?
- [ ] Impressum requirements and whether a Swiss entity or representative is needed under the nDSG (art. 14).
- [ ] Per-language legal pages: must all four languages carry legally binding text?
- [ ] Opt-in versus opt-out for cookies under Swiss law (current setting is opt-in).

### GB – United Kingdom

Locales: en-GB · min age 18 · consent: opt-in · data region: eu · positioning: medical

- **laws:** Cannabis-based products for medicinal use are available only on specialist prescription; advertising prescription-only medicines to the public is prohibited.
- **advertising:** Copy is addressed to clinics and pharmacies, not to patients or the public.
- **support:** Budify supports stock, dispensing and sales records with audit trails and exports for clinic or pharmacy compliance processes.
- **caveat:** Budify is not a clinical system and does not provide prescribing or clinical-record functionality.

- [ ] Is the UK realistically a medical-only (clinic/pharmacy) market for us, and does our software fall within any MHRA/CQC expectations?
- [ ] ICO registration reference and the company details to show (Companies Act).
- [ ] Wording compliance with the Human Medicines Regulations 2012 advertising rules.

### AU – Australia

Locales: en-AU · min age 18 · consent: notice-only + GPC · data region: au · positioning: medical

- **laws:** Medicinal cannabis is available through the TGA's schemes under prescription; therapeutic advertising of controlled drugs to the public is prohibited.
- **advertising:** Copy is addressed to authorised prescribers' clinics and pharmacies only.
- **support:** Budify supports stock, dispensing and sales records with audit trails and exports.
- **caveat:** Budify is not a clinical system. Operators remain responsible for TGA and state/territory permit obligations.

- [ ] Does the Privacy Act small-business exemption or the 2024 reform affect our policy content?
- [ ] TGA advertising rules: does any wording on this site qualify as advertising a therapeutic good?
- [ ] ABN/ACN details and whether an Australian entity is required.
- [ ] Confirm that notice-only cookie consent is acceptable for AU (current setting) or use opt-in.

### TH – Thailand

Locales: th-TH, en-TH · min age 20 · consent: opt-in · data region: sg · positioning: dispensary

- **laws:** Rules were tightened in 2025: flower requires a prescription and advertising is restricted.
- **advertising:** Copy is addressed to licensed operators; no product promotion.
- **support:** Budify supports sales, prescription-reference, stock and customer-record keeping with audit trails and exports.
- **caveat:** Operators remain responsible for their licences and for any prescription verification duties.

- [ ] Confirm the age threshold used in the gate (20) against the latest notification, including any 21+ guidance.
- [ ] PDPA: required content of the Thai-language notice; whether a representative or DPO is needed.
- [ ] Whether the Thai text must be the governing language for legal pages.
- [ ] Any additional advertising restriction that reaches B2B software marketing.

### ZA – South Africa

Locales: en-ZA, af-ZA, zu-ZA · min age 18 · consent: opt-in · data region: za · positioning: private-club

- **laws:** The Cannabis for Private Purposes Act (2024) permits private use and cultivation by adults; commercial sale is not authorised by the Act.
- **advertising:** Copy avoids any promotion of sales. Budify is positioned as administration software for private member clubs and their groups.
- **support:** Budify supports member registers, stock and cultivation records, financial records and audit trails, with exports for operators' own record-keeping.
- **caveat:** Whether and how a club may operate is for the operator and its legal advisers to determine.

- [ ] How does the Cannabis for Private Purposes Act (2024) affect software that includes a POS/sales function for clubs?
- [ ] Is the 'private club' positioning safe, or should POS references be reworded further?
- [ ] Information Officer name and registration; PAIA manual content (section 51 / Form).
- [ ] ECTA section 43 supplier information requirements for our entity.
- [ ] Whether isiZulu and Afrikaans legal pages are required for validity or are courtesy translations only.

## 3. Sign-off

| Market | Counsel | Date | Notes |
|---|---|---|---|
| US | | | |
| CA | | | |
| DE | | | |
| ES | | | |
| NL | | | |
| CH | | | |
| GB | | | |
| AU | | | |
| TH | | | |
| ZA | | | |
