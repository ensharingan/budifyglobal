# Budify Global – compliance-aware multi-country, multi-language site

B2B marketing and lead-gen site for **Budify (software only)**. It never sells, promotes or facilitates the sale of cannabis. Next.js 15 (App Router) · TypeScript · Tailwind · next-intl · static generation for every locale (22 locales, 10 markets).

> **Status: DRAFT.** All legal text, compliance values and translations must be reviewed by qualified local counsel / native reviewers before launch. See `docs/COMPLIANCE-ASSUMPTIONS.md`.

## Quick start
```bash
npm install
cp .env.example .env.local
npm run dev            # http://localhost:3000  (redirects to your negotiated locale)
npm run check          # compliance + i18n + content-lint gates
npm run build && npm start
```
`npm run build` runs `check` and writes `public/compliance-audit.json` (config version + hash per deployment).

## How it works
| Concern | Where |
|---|---|
| Rules per market (min age, consent model, links, footer text, legal pages, positioning, currency, data region) | `compliance.config.json` (schema: `docs/compliance.schema.json`) |
| Routing `/{lang}-{COUNTRY}/…`, geo/lang negotiation, localized slugs, 308 canonicalisation | `src/middleware.ts`, `src/i18n/*`, `src/i18n/slugs.json` |
| Messages (fallback locale → language → en) | `messages/*.json`, `messages/overrides/*.json`, `src/i18n/messages.ts` |
| Age/role gate | `src/components/compliance/AgeGate.tsx`, `public/gate-init.js` |
| Consent banner, log, withdrawal, GPC/DNT, Consent Mode | `src/components/compliance/*`, `src/lib/consent/*`, `/api/consent`, `/api/geo` |
| Legal templates per jurisdiction | `src/lib/legal/templates.ts`, `/[locale]/legal/[page]` |
| Forms (honeypot, timing, optional Turnstile, rate limit, region-routed webhook, double opt-in) | `src/app/api/*`, `src/lib/*` |
| Build gates | `scripts/check-compliance.mjs`, `check-i18n.mjs`, `content-lint.mjs`, `audit-log.mjs` |
| Security headers / noindex switch | `next.config.ts`, `vercel.json` |

Language switcher / region selector (header + footer + `/regions`) stores the choice in `bud_locale`; once chosen, the site never auto-redirects again. Geography never blocks access.

## Add a country
1. Add a market block in `compliance.config.json` (copy the closest one; fill every field incl. `openQuestions`).
2. Add its locales to `languages` if new; add `src/i18n/slugs.json` entries (optional).
3. Add `content/pricing.json` currency, `content/entities.json` entity/representative placeholders, and sub-processor regions if needed.
4. Add a legal template set / jurisdiction section in `src/lib/legal/templates.ts` (marked Draft).
5. `npm run check` (validates invariants: footer text, privacy link, banned claims, min age, consent model, legal pages).
6. `npm run assumptions` and send `docs/COMPLIANCE-ASSUMPTIONS.md` to local counsel.

## Add a language
1. Add the language to `compliance.config.json → languages` (name, dir `ltr|rtl`, font subset) and to `scripts/i18n.config.json` (`full` or `core`).
2. Create `messages/<lang>.json` (copy `en.json`; core languages need only the namespaces listed in `coreNamespaces`). Keep `_meta` stating translation status.
3. Add the language to the relevant market(s) `languages`. Add a font subset in `src/app/layout.tsx` if the script needs one.
4. For RTL (e.g. he-IL) set `dir: "rtl"`; layout uses logical properties but **needs a visual QA pass**.
5. Regional variants: `node scripts/gen-overrides.mjs` pattern → `messages/overrides/<lang>-<CC>.json` (only differing keys).
6. `npm run check` – fails on missing keys / placeholder mismatches in full languages.

## Update compliance rules
Edit `compliance.config.json`, bump `version`; bump `consentVersion` if consent categories, purposes or vendors changed (forces re-consent). Run `npm run check`; the audit log records the new version on the next build. Never loosen `bannedClaims` without counsel sign-off.

## Environment variables
See `.env.example`: `NEXT_PUBLIC_SITE_URL`, `ALLOW_INDEXING`, `STRICT_LAUNCH`, analytics IDs (optional), Turnstile keys, `LEAD_WEBHOOK_URL_<REGION>`, `CONSENT_LOG_WEBHOOK_URL`, `NEWSLETTER_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`.

## Deployment (Vercel)
- Set the **function region to an EU region** (`vercel.json`) and route lead/consent data to the regional webhook that matches `dataRegion`.
- Set env vars per environment; keep `ALLOW_INDEXING=0` on previews.
- Add Vercel Firewall / rate limiting in front of `/api/*` (the built-in limiter is per-instance memory).
- Custom domain + HSTS preload only after verifying all subdomains.

## Pre-launch checklist
- [ ] Counsel sign-off per market (table at the end of `docs/COMPLIANCE-ASSUMPTIONS.md`).
- [ ] Replace every `[TO BE COMPLETED]` in `content/entities.json`; run with `STRICT_LAUNCH=1`.
- [ ] Professional translation of legal pages; native review of all machine-drafted locales (fr, es, de, th, zu, it, nl, ca, af).
- [ ] Remove the "Draft" banners only once reviewed (per page).
- [ ] Confirm pricing, taxes, currency display; remove "indicative" wording.
- [ ] Confirm sub-processor list (`content/subprocessors.json`) matches reality; wire DPA signing.
- [ ] Configure webhooks/storage, retention periods, and DSR (data-subject request) process.
- [ ] Decide analytics (none / Plausible / GA4) and test consent: no non-essential cookies/requests before consent in EU/EEA, UK, CH, ZA, CA-QC, TH.
- [ ] Test GPC/DNT in US; test withdrawal link; test age gate with keyboard & screen reader.
- [ ] Accessibility audit (`docs/ACCESSIBILITY.md`); publish accessibility statement where required.
- [ ] Security: CSP review (nonce), rate limiting, Turnstile keys, secrets rotation, security.txt.
- [ ] Verify hreflang/x-default, canonicals, per-locale sitemaps; then set `ALLOW_INDEXING=1`.
- [ ] Verify ad-platform policies before running any ads.
- [ ] Only publish claims you can evidence (integrations, security, certifications, case studies).

## Visual style per market (`visuals`)
Each market in `compliance.config.json` has `visuals`: `"sa"` (default – the photographic, cannabis-themed look copied from budify.co.za: tabbed feature photos, lounge photo, member-app screens) or `"neutral"` (abstract, text-only illustrations). The `sa` photos are AI-generated images hotlinked from readdy.ai (see `content/sa-visuals.json`). **Self-host them** (avoids third-party requests before consent): run `npm run fetch-images` on a machine with normal internet access, commit `public/sa/`, redeploy. Counsel must approve cannabis-themed imagery per market (`global.cannabisImageryApproval`; `STRICT_LAUNCH=1` fails until it is filled in). New `sa.*` strings are English-only until translated (other languages fall back to English).

## Content rules (enforced by `content-lint`)
No product/consumption imagery, strain or price listings, health claims, or youth-appealing content. Image tags come from `content/images.manifest.json` and must be in `allowedImageryTags`. Banned terms are per market and global.
