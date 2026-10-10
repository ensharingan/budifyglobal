import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LOCALES, isLocale, marketOf } from '@/i18n/locales';
import { buildMetadata } from '@/lib/seo';
import { LocaleLink } from '@/components/LocaleLink';
import SolutionVisual from '@/components/SolutionVisual';
import { PageHeader, Section, Container, CheckList, btnPrimary, btnSecondary } from '@/components/ui/Page';

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
      <section className="py-16 sm:py-20"><Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <SolutionVisual type={type} sa={marketOf(locale).visuals === 'sa'} className="h-72 sm:h-96" />
        <div>
          <CheckList items={t.raw(`solutions.items.${type}.points`) as string[]} />
          <div className="mt-8 flex flex-wrap gap-3">
            <LocaleLink href="/contact" className={btnPrimary}>{t('common.bookDemo')}</LocaleLink>
            <LocaleLink href="/solutions" className={btnSecondary}>{t('solutions.back')}</LocaleLink>
          </div>
        </div>
      </Container></section>
      {marketOf(locale).solutions.length > 1 && (
        <section className="bg-brand-soft py-16"><Container>
          <ul className="grid gap-5 md:grid-cols-3">
            {marketOf(locale).solutions.filter((x) => x !== type).map((x) => (<li key={x}><LocaleLink href={`/solutions/${x}`} className="block h-full rounded-xl border border-brand/10 bg-white p-6 transition-colors hover:border-brand/30"><h3 className="font-bold">{t(`solutions.items.${x}.title`)}</h3><p className="mt-2 text-sm text-ink-muted">{t(`solutions.items.${x}.summary`)}</p></LocaleLink></li>))}
          </ul>
        </Container></section>
      )}
    </>
  );
}
