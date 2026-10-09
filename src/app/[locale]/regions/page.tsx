import { getTranslations } from 'next-intl/server';
import { initLocale, pageMeta } from '@/lib/page';
import { MARKETS, complianceConfig } from '@/lib/compliance';
import { localizedPath } from '@/i18n/paths';
import { PageHeader, Section, Card } from '@/components/ui/Page';
import RegionLinks from './RegionLinks';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { return pageMeta(params, 'regions', '/regions'); }

export default async function Regions({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await initLocale(params);
  const t = await getTranslations('selector');
  const names = new Intl.DisplayNames([locale], { type: 'region' });
  return (
    <>
      <PageHeader title={t('title')} intro={t('intro')} />
      <Section>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(MARKETS).map(([cc, m]) => (
            <li key={cc}><Card className="h-full">
              <h2 className="text-lg font-semibold">{names.of(cc) ?? cc}</h2>
              <RegionLinks items={m.languages.map((l) => ({ locale: l, href: localizedPath(l, '/'), label: complianceConfig.languages[l.split('-')[0]].native, lang: l.split('-')[0] }))} />
            </Card></li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-ink-muted">{t('remember')}</p>
      </Section>
    </>
  );
}
