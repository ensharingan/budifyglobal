import { getTranslations } from 'next-intl/server';
import { initLocale, pageMeta } from '@/lib/page';
import { countryOf, marketOf } from '@/i18n/locales';
import { MARKETS } from '@/lib/compliance';
import { localizedPath } from '@/i18n/paths';
import { LocaleLink } from '@/components/LocaleLink';
import { PageHeader, Section, Card, Notice } from '@/components/ui/Page';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { return pageMeta(params, 'legal', '/legal'); }

export default async function LegalHub({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await initLocale(params);
  const t = await getTranslations();
  const market = marketOf(locale);
  const names = new Intl.DisplayNames([locale], { type: 'region' });
  const me = countryOf(locale);
  return (
    <>
      <PageHeader title={t('legal.hubTitle')} intro={t('legal.hubIntro', { country: names.of(me) ?? me })} />
      <Section>
        <Notice tone="warn">{t('legal.draftBanner')}</Notice>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {market.legalPages.map((id) => (
            <li key={id}><Card><LocaleLink href={`/legal/${id}`} className="font-semibold text-brand-dark underline">{t(`legal.titles.${id}`)}</LocaleLink></Card></li>
          ))}
          <li><Card><LocaleLink href="/sub-processors" className="font-semibold text-brand-dark underline">{t('footer.links.subProcessors')}</LocaleLink></Card></li>
          <li><Card><LocaleLink href="/security" className="font-semibold text-brand-dark underline">{t('footer.links.security')}</LocaleLink></Card></li>
          <li><Card><LocaleLink href="/status" className="font-semibold text-brand-dark underline">{t('footer.links.status')}</LocaleLink></Card></li>
        </ul>
        <h2 className="mt-12 text-xl font-bold">{t('legal.otherJurisdictions')}</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {Object.entries(MARKETS).filter(([cc]) => cc !== me).map(([cc, m]) => (
            <li key={cc}><a href={localizedPath(m.defaultLocale, '/legal')} hrefLang={m.defaultLocale} className="inline-flex min-h-[44px] items-center rounded-md border border-ink-muted px-4 text-sm font-medium hover:bg-surface-alt">{names.of(cc) ?? cc}</a></li>
          ))}
        </ul>
      </Section>
    </>
  );
}
