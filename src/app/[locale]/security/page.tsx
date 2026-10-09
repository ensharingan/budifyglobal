import { getTranslations } from 'next-intl/server';
import { initLocale, pageMeta } from '@/lib/page';
import entities from '@root/content/entities.json';
import { PageHeader, Section, Card, Notice } from '@/components/ui/Page';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { return pageMeta(params, 'security', '/security'); }

export default async function Security({ params }: { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  const t = await getTranslations('legal.security');
  const items = t.raw('items') as { title: string; body: string }[];
  return (
    <>
      <PageHeader title={t('title')} intro={t('intro')} />
      <Section>
        <ul className="grid gap-5 md:grid-cols-2">
          {items.map((i) => (
            <li key={i.title}><Card className="h-full"><h2 className="font-semibold">{i.title}</h2>
              <p className="mt-2 text-sm text-ink-muted">{i.body.replace('{email}', entities.global.privacyEmail)}</p></Card></li>
          ))}
        </ul>
        <div className="mt-8"><Notice>{t('notice')}</Notice></div>
      </Section>
    </>
  );
}
