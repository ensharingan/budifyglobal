import { getTranslations } from 'next-intl/server';
import { initLocale, pageMeta } from '@/lib/page';
import { marketOf } from '@/i18n/locales';
import { LocaleLink } from '@/components/LocaleLink';
import { PageHeader, Section, Card, CheckList } from '@/components/ui/Page';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { return pageMeta(params, 'solutions', '/solutions'); }

export default async function Solutions({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await initLocale(params);
  const t = await getTranslations();
  const market = marketOf(locale);
  return (
    <>
      <PageHeader title={t('solutions.title')} intro={t('solutions.intro')} />
      <Section>
        <ul className="grid gap-6 md:grid-cols-2">
          {market.solutions.map((s) => (
            <li key={s}><Card className="flex h-full flex-col">
              <h2 className="text-xl font-semibold">{t(`solutions.items.${s}.title`)}</h2>
              <p className="mt-2 text-ink-muted">{t(`solutions.items.${s}.body`)}</p>
              <div className="mt-4 flex-1"><CheckList items={t.raw(`solutions.items.${s}.points`) as string[]} /></div>
              <LocaleLink href={`/solutions/${s}`} className="mt-5 inline-flex min-h-[44px] items-center font-semibold text-brand-dark underline">{t('common.learnMore')}<span className="sr-only">: {t(`solutions.items.${s}.title`)}</span></LocaleLink>
            </Card></li>
          ))}
        </ul>
      </Section>
    </>
  );
}
