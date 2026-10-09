import { getTranslations } from 'next-intl/server';
import { initLocale, pageMeta } from '@/lib/page';
import { LocaleLink } from '@/components/LocaleLink';
import { PageHeader, Section, Card, btnPrimary } from '@/components/ui/Page';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { return pageMeta(params, 'caseStudies', '/case-studies'); }

export default async function CaseStudies({ params }: { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  const t = await getTranslations('caseStudies');
  return (
    <>
      <PageHeader title={t('title')} intro={t('intro')} />
      <Section>
        <Card className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-semibold">{t('emptyTitle')}</h2>
          <p className="mt-3 text-ink-muted">{t('emptyBody')}</p>
          <div className="mt-6"><LocaleLink href="/contact" className={btnPrimary}>{t('cta')}</LocaleLink></div>
        </Card>
      </Section>
    </>
  );
}
