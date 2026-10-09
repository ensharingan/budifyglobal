import type { Metadata } from 'next';
import { LOCALES, langOf } from '@/i18n/locales';
import { localizedPath } from '@/i18n/paths';
import { abs, SITE_URL } from './site';

/** hreflang map for one internal path across ALL locales (+ x-default → root, which negotiates). */
export function alternatesFor(locale: string, internalPath: string): NonNullable<Metadata['alternates']> {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = abs(localizedPath(l, internalPath));
  languages['x-default'] = SITE_URL + '/';
  return { canonical: abs(localizedPath(locale, internalPath)), languages };
}

export function buildMetadata(opts: {
  locale: string; internalPath: string; title: string; description: string; siteName: string; titleTemplate?: string; noindex?: boolean;
}): Metadata {
  const { locale, internalPath, title, description, siteName } = opts;
  const url = abs(localizedPath(locale, internalPath));
  const full = opts.titleTemplate ? opts.titleTemplate.replace('{page}', title) : title;
  return {
    title: { absolute: full },
    description,
    alternates: alternatesFor(locale, internalPath),
    robots: opts.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'website', url, title: full, description, siteName, locale: locale.replace('-', '_'),
      alternateLocale: LOCALES.filter((l) => l !== locale && langOf(l) === langOf(locale)).map((l) => l.replace('-', '_')),
      images: [{ url: abs('/og.png'), width: 1200, height: 630, alt: siteName }]
    },
    twitter: { card: 'summary_large_image', title: full, description, images: [abs('/og.png')] }
  };
}
