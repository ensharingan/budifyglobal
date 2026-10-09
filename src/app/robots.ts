import type { MetadataRoute } from 'next';
import { LOCALES } from '@/i18n/locales';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  const allow = process.env.ALLOW_INDEXING === '1';
  return {
    rules: allow ? [{ userAgent: '*', allow: '/', disallow: ['/api/'] }] : [{ userAgent: '*', disallow: '/' }],
    sitemap: allow ? LOCALES.map((l) => `${SITE_URL}/sitemap/${l}.xml`) : undefined
  };
}
