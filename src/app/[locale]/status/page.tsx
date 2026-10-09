import { getTranslations } from 'next-intl/server';
import { initLocale, pageMeta } from '@/lib/page';
import entities from '@root/content/entities.json';
import { STATUS_URL } from '@/lib/site';
import { PageHeader, Section, Notice, btnPrimary } from '@/components/ui/Page';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { return pageMeta(params, 'status', '/status'); }

export default async function Status({ params }: { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  const t = await getTranslations('legal.status');
  const c = await getTranslations('common');
  return (
    <>
      <PageHeader title={t('title')} intro={t('intro')} />
      <Section>
        {STATUS_URL
          ? <a href={STATUS_URL} target="_blank" rel="noopener noreferrer" className={btnPrimary}>{t('open')} <span className="sr-only">{c('opensNewTab')}</span></a>
          : <Notice>{t('notConfigured', { email: entities.global.generalEmail })}</Notice>}
      </Section>
    </>
  );
}
