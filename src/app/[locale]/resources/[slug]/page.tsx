import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LOCALES, isLocale } from '@/i18n/locales';
import { buildMetadata } from '@/lib/seo';
import { LocaleLink } from '@/components/LocaleLink';
import { Container, Notice } from '@/components/ui/Page';
import JsonLd from '@/components/JsonLd';
import { ARTICLES } from '@root/content/articles';
import { SITE_URL } from '@/lib/site';
import { localizedPath } from '@/i18n/paths';

export const dynamicParams = false;
export function generateStaticParams() { return LOCALES.flatMap((locale) => ARTICLES.map((a) => ({ locale, slug: a.slug }))); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!isLocale(locale) || !a) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  return buildMetadata({ locale, internalPath: `/resources/${slug}`, title: a.title, description: a.description, siteName: t('siteName'), titleTemplate: t('titleTemplate') });
}

export default async function Article({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!isLocale(locale) || !a) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();
  return (
    <Container className="max-w-3xl py-12">
      <LocaleLink href="/resources" className="text-sm font-medium text-brand-dark underline">← {t('common.backTo', { page: t('nav.resources') })}</LocaleLink>
      {locale.split('-')[0] !== 'en' && <div className="mt-4"><Notice>{t('resources.englishOnly')}</Notice></div>}
      <article lang="en" className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{a.title}</h1>
        <p className="mt-2 text-sm text-ink-muted">{t('resources.readTime', { minutes: a.minutes })}</p>
        {a.sections.map((s) => (
          <section key={s.heading} className="mt-8">
            <h2 className="text-xl font-semibold">{s.heading}</h2>
            {s.paras.map((p) => <p key={p} className="mt-3 text-ink">{p}</p>)}
          </section>
        ))}
      </article>
      <p className="mt-10 text-sm text-ink-muted">{t('common.b2bOnly')}</p>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.description, datePublished: a.published, inLanguage: 'en', mainEntityOfPage: SITE_URL + localizedPath(locale, `/resources/${slug}`), publisher: { '@type': 'Organization', name: 'Budify' } }} />
    </Container>
  );
}
