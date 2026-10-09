import { getTranslations } from 'next-intl/server';
import { initLocale, pageMeta } from '@/lib/page';
import { PageHeader, Section, Notice } from '@/components/ui/Page';
import sub from '@root/content/subprocessors.json';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { return pageMeta(params, 'subProcessors', '/sub-processors'); }

export default async function SubProcessors({ params }: { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  const t = await getTranslations('legal');
  const th = 'px-3 py-2 text-start text-sm font-semibold';
  return (
    <>
      <PageHeader title={t('subProcessors.title')} intro={t('subProcessors.intro')} />
      <Section>
        <div className="mb-4"><Notice tone="warn">{t('draftBanner')}</Notice></div>
        <div className="overflow-x-auto rounded-lg border border-line" tabIndex={0} role="region" aria-label={t('subProcessors.title')}>
          <table lang="en" className="w-full min-w-[760px] border-collapse text-sm">
            <caption className="sr-only">{t('subProcessors.title')}</caption>
            <thead className="bg-surface-alt"><tr>
              {(['name', 'purpose', 'location', 'data', 'status', 'transfer'] as const).map((k) => <th key={k} scope="col" className={th}>{t(`subProcessors.${k}`)}</th>)}
            </tr></thead>
            <tbody>
              {sub.items.map((i) => (
                <tr key={i.name} className="border-t border-line align-top">
                  <th scope="row" className="px-3 py-3 text-start font-medium">{i.name}</th>
                  <td className="px-3 py-3">{i.purpose}</td><td className="px-3 py-3">{i.location}</td><td className="px-3 py-3">{i.data}</td>
                  <td className="px-3 py-3">{t(`subProcessors.statuses.${i.status}`)}</td><td className="px-3 py-3">{i.transfer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-ink-muted">{t('subProcessors.reviewed', { date: sub.lastReviewed })}</p>
      </Section>
    </>
  );
}
