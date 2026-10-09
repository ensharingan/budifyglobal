import { getTranslations } from 'next-intl/server';
import { initLocale, pageMeta } from '@/lib/page';
import { countryOf, minAgeOf } from '@/i18n/locales';
import { MARKETS } from '@/lib/compliance';
import { LocaleLink } from '@/components/LocaleLink';
import { PageHeader, Section, Card, Notice } from '@/components/ui/Page';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { return pageMeta(params, 'compliance', '/compliance'); }

export default async function ComplianceCentre({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await initLocale(params);
  const t = await getTranslations('compliance');
  const names = new Intl.DisplayNames([locale], { type: 'region' });
  const mine = countryOf(locale);
  const entries = Object.entries(MARKETS).sort(([a], [b]) => (a === mine ? -1 : b === mine ? 1 : (names.of(a) ?? a).localeCompare(names.of(b) ?? b, locale)));
  return (
    <>
      <PageHeader title={t('title')} intro={t('intro')} />
      <Section>
        <Notice tone="warn">{t('disclaimer')}</Notice>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map(([cc, m]) => (
            <li key={cc}><Card className={`flex h-full flex-col ${cc === mine ? 'border-2 border-brand' : ''}`}>
              {cc === mine && <p className="mb-2 w-fit rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-dark">{t('yourMarket')}</p>}
              <h2 className="text-lg font-semibold">{names.of(cc) ?? cc}</h2>
              <p className="mt-2 text-sm text-ink-muted">{t(`positioning.${m.positioning}`)}</p>
              <p className="mt-1 text-sm text-ink-muted">{t('ageLabel', { age: cc === mine ? minAgeOf(locale) : m.minAge })}</p>
              <LocaleLink href={`/compliance/${cc.toLowerCase()}`} className="mt-4 inline-flex min-h-[44px] items-center font-semibold text-brand-dark underline">{t('viewMarket', { country: names.of(cc) ?? cc })}</LocaleLink>
            </Card></li>
          ))}
        </ul>
      </Section>
    </>
  );
}
