import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LOCALES, isLocale } from '@/i18n/locales';
import { COUNTRY_CODES, MARKETS } from '@/lib/compliance';
import { buildMetadata } from '@/lib/seo';
import { LocaleLink } from '@/components/LocaleLink';
import { PageHeader, Section, Card, Notice, btnPrimary } from '@/components/ui/Page';
import { localizedPath } from '@/i18n/paths';

export const dynamicParams = false;
export function generateStaticParams() { return LOCALES.flatMap((locale) => COUNTRY_CODES.map((c) => ({ locale, country: c.toLowerCase() }))); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string; country: string }> }) {
  const { locale, country } = await params;
  const m = MARKETS[country.toUpperCase()];
  if (!isLocale(locale) || !m) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  const c = await getTranslations({ locale, namespace: 'compliance' });
  const name = new Intl.DisplayNames([locale], { type: 'region' }).of(country.toUpperCase()) ?? country;
  return buildMetadata({ locale, internalPath: `/compliance/${country}`, title: `${c('title')} – ${name}`, description: c('intro'), siteName: t('siteName'), titleTemplate: t('titleTemplate') });
}

export default async function MarketCompliance({ params }: { params: Promise<{ locale: string; country: string }> }) {
  const { locale, country } = await params;
  const cc = country.toUpperCase();
  const m = MARKETS[cc];
  if (!isLocale(locale) || !m) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();
  const name = new Intl.DisplayNames([locale], { type: 'region' }).of(cc) ?? cc;
  const rows: [string, string][] = [['regime', m.overview.laws], ['advertising', m.overview.advertising], ['support', m.overview.support], ['caveat', m.overview.caveat]];
  return (
    <>
      <PageHeader title={`${t('compliance.title')} – ${name}`} intro={t(`compliance.positioning.${m.positioning}`)} />
      <Section>
        <div className="grid gap-4"><Notice tone="warn">{t('compliance.disclaimer')}</Notice>
          {locale.split('-')[0] !== 'en' && <Notice>{t('compliance.englishOnly')}</Notice>}</div>
        <div lang="en" className="mt-8 grid gap-5 md:grid-cols-2">
          {rows.map(([k, v]) => (
            <Card key={k}><h2 className="font-semibold">{t(`compliance.${k}`)}</h2><p className="mt-2 text-sm text-ink-muted">{v}</p></Card>
          ))}
          <Card><h2 className="font-semibold">{t('compliance.laws')}</h2>
            <ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-ink-muted">{m.privacy.laws.map((l) => <li key={l}>{l}</li>)}</ul></Card>
          <Card><h2 className="font-semibold">{t('compliance.trace')}</h2>
            <ul className="mt-2 space-y-2 text-sm">{m.trackAndTrace.map((x) => (
              <li key={x.system} className="flex flex-wrap items-center justify-between gap-2"><span>{x.system}</span><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-800">{t(`common.status.${x.status}`)}</span></li>
            ))}</ul></Card>
        </div>
        <p className="mt-6 text-sm text-ink-muted">{t('compliance.ageLabel', { age: m.minAgeByLocale?.[m.defaultLocale] ?? m.minAge })}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={localizedPath(m.defaultLocale, '/legal')} hrefLang={m.defaultLocale} className={btnPrimary}>{t('compliance.legalLinks')}</a>
          <LocaleLink href="/compliance" className="inline-flex min-h-[48px] items-center font-semibold text-brand-dark underline">{t('common.backTo', { page: t('nav.compliance') })}</LocaleLink>
        </div>
      </Section>
    </>
  );
}
