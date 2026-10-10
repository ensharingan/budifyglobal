// B2B resources. English only (flagged in the UI). No product, strain, price or health content.
export interface Article {
  slug: string; title: string; description: string; minutes: number; published: string;
  sections: { heading: string; paras: string[] }[];
  /** SEO keyphrases (shown as tags + meta keywords). */
  keywords?: string[];
  category?: string;
  /** Country codes this article is published for; undefined = every market. */
  markets?: string[];
}

const SHARED: Article[] = [
  {
    slug: 'audit-ready-records',
    title: 'Audit-ready records: what regulated operators should log, and why',
    description: 'A practical checklist of the records that make inspections and reporting less stressful.',
    minutes: 5,
    published: '2026-10-01',
    sections: [
      { heading: 'Why records are the real product of compliance', paras: [
        'Regulators rarely ask whether you intend to follow the rules. They ask for evidence that you did. In every regulated market, the operators who handle inspections well are the ones who can produce complete, consistent and time-stamped records within hours rather than weeks.',
        'This guide is general information for operators. It is not legal advice, and the records you must keep depend on your licence, your jurisdiction and your regulator.'
      ] },
      { heading: 'Five categories worth capturing everywhere', paras: [
        'Stock movements: every intake, adjustment, transfer, return and write-off, with who did it and when. Stock counts: scheduled and ad-hoc counts, the system quantity at the time, the counted quantity and the explained variance.',
        'Membership or customer verification: how identity and eligibility were checked, when, and by whom. Transactions: what was recorded at the point of sale or allocation, including voids and refunds. Access and changes: who changed prices, limits, permissions or member status.'
      ] },
      { heading: 'Make the log tamper-evident', paras: [
        'A record that anyone can silently edit is a liability. Prefer systems where changes create a new entry instead of overwriting the old one, where user accounts are individual, and where exports are reproducible.',
        'Agree a retention period with your adviser and write it down. Retain what you must; delete what you no longer need, especially personal data.'
      ] },
      { heading: 'Practice the export before you need it', paras: [
        'Once a quarter, pick a date range and produce the reports a regulator would plausibly request. If it takes more than an afternoon, fix the process while nobody is waiting on you.'
      ] }
    ]
  },
  {
    slug: 'blind-stock-counts',
    title: 'Blind stock counts: a simple method that finds problems early',
    description: 'How blind counts and variance reports work, and how to roll them out across several locations.',
    minutes: 4,
    published: '2026-10-02',
    sections: [
      { heading: 'What “blind” means', paras: [
        'In a blind count the person counting does not see the quantity the system expects. This removes the temptation to confirm what the screen says and makes counts more reliable.'
      ] },
      { heading: 'A repeatable routine', paras: [
        'Choose a scope (all items or one category), freeze movements for the area being counted, count, and then review only the differences. Investigate variances above an agreed threshold before you adjust anything.',
        'Record the reason for every adjustment. Over time the reasons themselves become useful: repeated shrinkage in one category, or one location, points to a process problem rather than bad luck.'
      ] },
      { heading: 'Rolling it out across several locations', paras: [
        'Use the same schedule and thresholds at every location, give counters their own accounts, and reserve approval of adjustments for managers. Compare variance by location, not just in total.'
      ] }
    ]
  },
  {
    slug: 'membership-administration-basics',
    title: 'Membership administration basics for associations and clubs',
    description: 'The registers, limits and documentation that membership organisations typically need to maintain.',
    minutes: 5,
    published: '2026-10-03',
    sections: [
      { heading: 'A register you can trust', paras: [
        'Membership organisations are, first of all, administrators. A reliable member register records who joined, when, under which conditions, and whether their membership is currently valid.',
        'Rules differ by country and region, and in some places the activity of such organisations is restricted or unsettled in law. Always take local legal advice; this article describes administration, not entitlement to operate.'
      ] },
      { heading: 'Status, expiry and limits', paras: [
        'Track membership status and expiry automatically, and make deactivation immediate. If your rules include allocation limits, record each allocation against the member so that limits can be checked before the next one.'
      ] },
      { heading: 'Documentation and data protection', paras: [
        'Keep only the documents you need, store them securely, and restrict access by role. Member records can be sensitive: agree retention periods, honour access and deletion requests, and make sure your software supplier signs a data processing agreement.'
      ] }
    ]
  }
];

import us from './articles/us.json';
import ca from './articles/ca.json';
import de from './articles/de.json';
import es from './articles/es.json';
import nl from './articles/nl.json';
import ch from './articles/ch.json';
import gb from './articles/gb.json';
import au from './articles/au.json';
import th from './articles/th.json';
import za from './articles/za.json';

const BY_COUNTRY: Record<string, Article[]> = { US: us, CA: ca, DE: de, ES: es, NL: nl, CH: ch, GB: gb, AU: au, TH: th, ZA: za } as Record<string, Article[]>;
for (const [cc, list] of Object.entries(BY_COUNTRY)) for (const a of list) a.markets = [cc];

export const ARTICLES: Article[] = [...SHARED, ...Object.values(BY_COUNTRY).flat()];
export const CATEGORIES = ['Records & compliance', 'Stock & inventory', 'Membership & access', 'Operations', 'Finance & reporting', 'Data protection', 'Technology', 'Growth'] as const;

/** Articles published for a market (country-specific first, newest first, then shared guides). */
export function articlesFor(cc: string): Article[] {
  const own = ARTICLES.filter((a) => a.markets?.includes(cc)).sort((a, b) => b.published.localeCompare(a.published));
  return [...own, ...SHARED];
}
export function isPublishedIn(a: Article, cc: string) { return !a.markets || a.markets.includes(cc); }
