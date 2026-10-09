import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LOCALES, isLocale, marketOf } from '@/i18n/locales';
import { buildMetadata } from '@/lib/seo';
import { LocaleLink } from '@/components/LocaleLink';
import { PageHeader, Section, CheckList, btnPrimary, btnSecondary } from '@/components/ui/Page';

export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALES.flatMap((locale) => marketOf(locale).solutions.map((type) => ({ locale, type })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; type: string }> }) {
  const { locale, type } = await params;
  if (!isLocale(locale) || !marketOf(locale).solutions.includes(type as never)) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  const s = await getTranslations({ locale, namespace: 'solutions.items' });
  return buildMetadata({ locale, internalPath: `/solutions/${type}`, title: s(`${type}.title`), description: s(`${type}.summary`), siteName: t('siteName'), titleTemplate: t('titleTemplate') });
}

export default async function SolutionDetail({ params }: { params: Promise<{ locale: string; type: string }> }) {
  const { locale, type } = await params;
  if (!isLocale(locale) || !marketOf(locale).solutions.includes(type as never)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();
  return (
    <>
      <PageHeader title={t(`solutions.items.${type}.title`)} intro={t(`solutions.items.${type}.body`)} />
      <Section>
        <CheckList items={t.raw(`solutions.items.${type}.points`) as string[]} />
        <div className="mt-8 flex flex-wrap gap-3">
          <LocaleLink href="/contact" className={btnPrimary}>{t('common.bookDemo')}</LocaleLink>
          <LocaleLink href="/solutions" className={btnSecondary}>{t('solutions.back')}</LocaleLink>
        </div>
      </Section>
    </>
  );
}
