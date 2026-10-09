import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { initLocale, pageMeta } from '@/lib/page';
import { marketOf } from '@/i18n/locales';
import { PageHeader, Section } from '@/components/ui/Page';
import ContactForm from '@/components/ContactForm';
import entities from '@root/content/entities.json';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { return pageMeta(params, 'contact', '/contact'); }

const TYPE_FOR: Record<string, string> = { dispensaries: 'dispensary', clubs: 'club', groups: 'group', 'white-label': 'partner' };

export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await initLocale(params);
  const t = await getTranslations('contact');
  const allowed = [...marketOf(locale).solutions.map((s) => TYPE_FOR[s]), 'other'];
  return (
    <>
      <PageHeader title={t('title')} intro={t('intro')} />
      <Section>
        <div className="max-w-3xl">
          <Suspense fallback={null}>
            <ContactForm privacyEmail={entities.global.privacyEmail} address={entities.global.registeredAddress} allowedTypes={allowed} />
          </Suspense>
        </div>
      </Section>
    </>
  );
}
