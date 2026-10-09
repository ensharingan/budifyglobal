import { getTranslations } from 'next-intl/server';
import { initLocale, pageMeta } from '@/lib/page';
import { marketOf } from '@/i18n/locales';
import { PageHeader, Section, Notice } from '@/components/ui/Page';
import PricingClient, { type PlanPrice } from './PricingClient';
import pricing from '@root/content/pricing.json';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { return pageMeta(params, 'pricing', '/pricing'); }

export default async function Pricing({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await initLocale(params);
  const t = await getTranslations('pricing');
  const { currency } = marketOf(locale);
  const price = (id: 'starter' | 'growth') => (pricing.plans[id].prices as Record<string, number>)[currency] ?? null;
  const plans: PlanPrice[] = [
    { id: 'starter', monthly: price('starter') },
    { id: 'growth', monthly: price('growth'), featured: true },
    { id: 'enterprise', monthly: null }
  ];
  return (
    <>
      <PageHeader title={t('title')} intro={t('intro')} />
      <Section>
        <PricingClient plans={plans} currency={currency} discount={pricing.annualDiscountPercent} />
        <p className="mt-6 text-sm text-ink-muted">{t('currencyNote', { currency })}</p>
        <div className="mt-8">
          <h2 className="text-lg font-semibold">{t('faqTitle')}</h2>
          <ul className="mt-3 list-disc space-y-1 ps-5 text-sm text-ink-muted">
            {(t.raw('faq') as string[]).map((f) => <li key={f}>{f}</li>)}
          </ul>
        </div>
        <div className="mt-8"><Notice tone="warn">{(await getTranslations('common'))('b2bOnly')}</Notice></div>
      </Section>
    </>
  );
}
