import { getLocale, getTranslations } from 'next-intl/server';
import { initLocale, pageMeta } from '@/lib/page';
import { countryOf, marketOf } from '@/i18n/locales';
import { PageHeader, Section, Card, Notice } from '@/components/ui/Page';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { return pageMeta(params, 'integrations', '/integrations'); }

const GROUPS = ['hardware', 'payments', 'accounting', 'api'] as const;
const BADGE: Record<string, string> = {
  available: 'bg-brand-soft text-brand-dark', export: 'bg-slate-100 text-slate-800', roadmap: 'bg-warn-soft text-warn', custom: 'bg-slate-100 text-slate-800'
};

export default async function Integrations({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await initLocale(params);
  const t = await getTranslations();
  const market = marketOf(locale);
  const names = new Intl.DisplayNames([locale], { type: 'region' });
  return (
    <>
      <PageHeader title={t('integrations.title')} intro={t('integrations.intro')} />
      <Section>
        <ul className="grid gap-5 sm:grid-cols-2">
          {GROUPS.map((g) => (
            <li key={g}><Card className="h-full">
              <h2 className="text-lg font-semibold">{t(`integrations.groups.${g}.title`)}</h2>
              <p className="mt-2 text-sm text-ink-muted">{t(`integrations.groups.${g}.body`)}</p>
            </Card></li>
          ))}
        </ul>
      </Section>
      <Section title={t('integrations.traceTitle', { country: names.of(countryOf(locale)) ?? countryOf(locale) })} intro={t('integrations.traceIntro')}>
        <ul className="space-y-3">
          {market.trackAndTrace.map((x) => (
            <li key={x.system}><Card className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-medium">{x.system}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${BADGE[x.status]}`}>{t(`common.status.${x.status}`)}</span>
            </Card></li>
          ))}
        </ul>
        {locale.split('-')[0] !== 'en' && <div className="mt-4"><Notice>{t('common.englishOnly')}</Notice></div>}
      </Section>
    </>
  );
}
