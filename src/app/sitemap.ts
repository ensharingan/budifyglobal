import type { MetadataRoute } from 'next';
import { LOCALES, marketOf, countryOf } from '@/i18n/locales';
import { localizedPath } from '@/i18n/paths';
import { COUNTRY_CODES } from '@/lib/compliance';
import { articlesFor } from '@root/content/articles';
import { abs } from '@/lib/site';

// One sitemap per locale: /sitemap/<locale>.xml, each URL carrying hreflang alternates.
export async function generateSitemaps() {
  return LOCALES.map((id) => ({ id }));
}

function pathsFor(locale: string): string[] {
  const m = marketOf(locale);
  return [
    '/', '/features', '/pricing', '/integrations', '/solutions', '/compliance', '/resources', '/case-studies', '/contact',
    '/legal', '/sub-processors', '/security', '/status', '/regions',
    ...m.solutions.map((s) => `/solutions/${s}`),
    ...COUNTRY_CODES.map((c) => `/compliance/${c.toLowerCase()}`),
    ...articlesFor(countryOf(locale)).map((a) => `/resources/${a.slug}`),
    ...m.legalPages.map((p) => `/legal/${p}`)
  ];
}

export default async function sitemap({ id }: { id: Promise<string> | string }): Promise<MetadataRoute.Sitemap> {
  const locale = String(await id);
  if (process.env.ALLOW_INDEXING !== '1' || !LOCALES.includes(locale)) return [];
  return pathsFor(locale).map((p) => {
    const languages: Record<string, string> = {};
    // alternates only where the same internal path exists in the other locale
    for (const l of LOCALES) if (pathsFor(l).includes(p)) languages[l] = abs(localizedPath(l, p));
    return { url: abs(localizedPath(locale, p)), lastModified: new Date('2026-10-09'), changeFrequency: 'monthly', priority: p === '/' ? 1 : 0.7, alternates: { languages } };
  });
}
