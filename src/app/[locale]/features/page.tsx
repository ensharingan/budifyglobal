import { getTranslations } from 'next-intl/server';
import { initLocale, pageMeta } from '@/lib/page';
import { marketOf } from '@/i18n/locales';
import { LocaleLink } from '@/components/LocaleLink';
import { PageHeader, Section, Card, CheckList, btnPrimary } from '@/components/ui/Page';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { return pageMeta(params, 'features', '/features'); }

const ITEMS = ['pos', 'membership', 'inventory', 'compliance', 'finance', 'analytics', 'multistore', 'security'] as const;
const HAS_ASSOC = new Set(['pos', 'finance']);

export default async function Features({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await initLocale(params);
  const t = await getTranslations();
  const assoc = marketOf(locale).positioning === 'association';
  return (
    <>
      <PageHeader title={t('features.title')} intro={t('features.intro')} />
      <Section>
        <ul className="grid gap-6 md:grid-cols-2">
          {ITEMS.map((k) => {
            const base = HAS_ASSOC.has(k) && assoc ? `features.items.${k}.assoc` : `features.items.${k}`;
            return (
              <li key={k}><Card className="h-full">
                <h2 className="text-xl font-semibold">{t(`${base}.title`)}</h2>
                <p className="mt-2 text-ink-muted">{t(`${base}.body`)}</p>
                <div className="mt-4"><CheckList items={t.raw(`${base}.bullets`) as string[]} /></div>
              </Card></li>
            );
          })}
        </ul>
        <div className="mt-10"><LocaleLink href="/contact" className={btnPrimary}>{t('common.bookDemo')}</LocaleLink></div>
      </Section>
    </>
  );
}
