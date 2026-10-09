import { getTranslations } from 'next-intl/server';
import { initLocale, pageMeta } from '@/lib/page';
import { LocaleLink } from '@/components/LocaleLink';
import { PageHeader, Section, Card, Notice } from '@/components/ui/Page';
import { ARTICLES } from '@root/content/articles';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { return pageMeta(params, 'resources', '/resources'); }

export default async function Resources({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await initLocale(params);
  const t = await getTranslations('resources');
  const fmt = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' });
  return (
    <>
      <PageHeader title={t('title')} intro={t('intro')} />
      <Section>
        {locale.split('-')[0] !== 'en' && <div className="mb-6"><Notice>{t('englishOnly')}</Notice></div>}
        <ul className="grid gap-6 md:grid-cols-3">
          {ARTICLES.map((a) => (
            <li key={a.slug}><Card className="flex h-full flex-col">
              <p className="text-xs text-ink-muted"><time dateTime={a.published}>{fmt.format(new Date(a.published))}</time> · {t('readTime', { minutes: a.minutes })}</p>
              <h2 className="mt-2 text-lg font-semibold"><LocaleLink href={`/resources/${a.slug}`} className="hover:underline" lang="en">{a.title}</LocaleLink></h2>
              <p className="mt-2 flex-1 text-sm text-ink-muted" lang="en">{a.description}</p>
            </Card></li>
          ))}
        </ul>
      </Section>
    </>
  );
}
