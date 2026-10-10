import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LOCALES, isLocale, countryOf, marketOf } from '@/i18n/locales';
import { buildMetadata } from '@/lib/seo';
import { LocaleLink } from '@/components/LocaleLink';
import { Container, Notice } from '@/components/ui/Page';
import JsonLd from '@/components/JsonLd';
import { ARTICLES, articlesFor, isPublishedIn, localize, categoryLabel } from '@root/content/articles';
import { coverFor } from '@/lib/articleCover';
import { SITE_URL } from '@/lib/site';
import { localizedPath } from '@/i18n/paths';

export const dynamicParams = false;
export function generateStaticParams() { return LOCALES.flatMap((locale) => ARTICLES.filter((a) => isPublishedIn(a, countryOf(locale))).map((a) => ({ locale, slug: a.slug }))); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const a0 = ARTICLES.find((x) => x.slug === slug);
  if (!isLocale(locale) || !a0 || !isPublishedIn(a0, countryOf(locale))) return {};
  const a = localize(a0, locale);
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { keywords: a.keywords, ...buildMetadata({ locale, internalPath: `/resources/${slug}`, title: a.title, description: a.description, siteName: t('siteName'), titleTemplate: t('titleTemplate') }) };
}

export default async function Article({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const a0 = ARTICLES.find((x) => x.slug === slug);
  if (!isLocale(locale) || !a0 || !isPublishedIn(a0, countryOf(locale))) notFound();
  const a = localize(a0, locale);
  setRequestLocale(locale);
  const t = await getTranslations();
  const cover = coverFor(a.category, marketOf(locale).visuals === 'sa');
  const related = articlesFor(countryOf(locale)).map((x) => localize(x, locale)).filter((x) => x.slug !== a.slug && x.category === a.category).slice(0, 3);
  return (
    <Container className="max-w-3xl py-12">
      <LocaleLink href="/resources" className="text-sm font-medium text-brand-dark underline">← {t('common.backTo', { page: t('nav.resources') })}</LocaleLink>
      {locale.split('-')[0] !== 'en' && !a.translated && <div className="mt-4"><Notice>{t('resources.englishOnly')}</Notice></div>}
      <article lang={a.lang} className="mt-6">
        {a.category && <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand-dark">{categoryLabel(a.category, a.lang)}</span>}
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">{a.title}</h1>
        <p className="mt-3 text-sm text-ink-muted"><time dateTime={a.published}>{a.published}</time> · {t('resources.readTime', { minutes: a.minutes })}</p>
        {a.keywords && <div className="mt-4 flex flex-wrap gap-1.5">{a.keywords.map((k) => (<span key={k} className="rounded-full bg-brand/5 px-2.5 py-0.5 text-xs text-brand-dark">{k}</span>))}</div>}
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" aria-hidden="true" className="mt-8 h-56 w-full rounded-2xl border border-brand/15 object-cover sm:h-72" />
        )}
        {a.sections.map((s) => (
          <section key={s.heading} className="mt-8">
            <h2 className="text-xl font-semibold">{s.heading}</h2>
            {s.paras.map((p) => <p key={p} className="mt-3 text-ink">{p}</p>)}
          </section>
        ))}
      </article>
      <div className="mt-12 rounded-2xl bg-brand-dark p-8 text-center text-white">
        <h2 className="text-2xl font-extrabold">{t('home.ctaTitle')}</h2>
        <p className="mx-auto mt-2 max-w-xl text-white/80">{t('home.ctaBody')}</p>
        <LocaleLink href="/contact" className="mt-6 inline-flex min-h-[48px] items-center rounded-lg bg-white px-8 text-sm font-bold uppercase tracking-wider text-brand-dark hover:bg-brand-soft">{t('common.bookDemo')}</LocaleLink>
      </div>
      {related.length > 0 && (
        <aside lang={a.lang} className="mt-12"><h2 className="text-xl font-bold">{categoryLabel(a.category, a.lang)}</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">{related.map((r) => (<li key={r.slug}><LocaleLink href={`/resources/${r.slug}`} className="block h-full rounded-xl border border-brand/10 bg-white p-4 text-sm font-semibold hover:border-brand/40">{r.title}</LocaleLink></li>))}</ul>
        </aside>
      )}
      <p className="mt-10 text-sm text-ink-muted">{t('common.b2bOnly')}</p>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.description, datePublished: a.published, inLanguage: a.lang, mainEntityOfPage: SITE_URL + localizedPath(locale, `/resources/${slug}`), publisher: { '@type': 'Organization', name: 'Budify' } }} />
    </Container>
  );
}
