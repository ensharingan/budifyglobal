import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LOCALES, countryOf, isLocale, marketOf } from '@/i18n/locales';
import { buildMetadata } from '@/lib/seo';
import { buildLegalDoc, DRAFT_DATE } from '@/lib/legal/templates';
import type { LegalPageId } from '@/lib/compliance/types';
import { LocaleLink } from '@/components/LocaleLink';
import { Container, Notice } from '@/components/ui/Page';
import PrivacyChoices from '@/components/compliance/PrivacyChoices';

export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALES.flatMap((locale) => marketOf(locale).legalPages.map((page) => ({ locale, page })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; page: string }> }) {
  const { locale, page } = await params;
  if (!isLocale(locale) || !marketOf(locale).legalPages.includes(page as LegalPageId)) return {};
  const t = await getTranslations({ locale });
  return buildMetadata({ locale, internalPath: `/legal/${page}`, title: t(`legal.titles.${page}`), description: t('meta.legal.description'), siteName: t('meta.siteName'), titleTemplate: t('meta.titleTemplate') });
}

export default async function LegalPage({ params }: { params: Promise<{ locale: string; page: string }> }) {
  const { locale, page } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const country = countryOf(locale);
  const doc = buildLegalDoc(page as LegalPageId, country);
  if (!doc) notFound();
  const t = await getTranslations();
  const names = new Intl.DisplayNames([locale], { type: 'region' });
  const title = t(`legal.titles.${doc.id}`);
  return (
    <Container className="max-w-3xl py-12">
      <LocaleLink href="/legal" className="text-sm font-medium text-brand-dark underline">← {t('legal.backToHub')}</LocaleLink>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-ink-muted">{t('legal.jurisdiction', { country: names.of(country) ?? country })} · {t('legal.lastUpdated', { date: DRAFT_DATE })}</p>
      <div className="mt-6 space-y-3">
        <Notice tone="warn">{t('legal.draftBanner')}</Notice>
        <Notice>{t('legal.translationPending')}</Notice>
      </div>

      <nav aria-label={t('legal.onThisPage')} className="mt-8 rounded-lg border border-line bg-surface-alt p-4">
        <h2 className="text-sm font-semibold">{t('legal.onThisPage')}</h2>
        <ol className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
          {doc.sections.map((s) => <li key={s.id}><a className="inline-flex min-h-[32px] items-center text-brand-dark underline" href={`#${s.id}`} lang="en">{s.title}</a></li>)}
        </ol>
      </nav>

      <article lang="en" className="prose-legal mt-4">
        {doc.sections.map((s) => (
          <section key={s.id} aria-labelledby={`h-${s.id}`}>
            <h2 id={s.id}><span id={`h-${s.id}`}>{s.title}</span></h2>
            {s.blocks.map((b, i) =>
              b.type === 'p' ? <p key={i}>{b.text}</p>
              : b.type === 'ul' ? <ul key={i}>{b.items.map((it) => <li key={it}>{it}</li>)}</ul>
              : <PrivacyChoices key={i} />
            )}
          </section>
        ))}
      </article>
    </Container>
  );
}
