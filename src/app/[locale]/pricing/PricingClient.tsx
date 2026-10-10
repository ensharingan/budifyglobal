'use client';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { LocaleLink } from '@/components/LocaleLink';

export interface PlanPrice { id: 'starter' | 'growth' | 'enterprise'; monthly: number | null; featured?: boolean }

export default function PricingClient({ plans, currency, discount }: { plans: PlanPrice[]; currency: string; discount: number }) {
  const t = useTranslations('pricing');
  const locale = useLocale();
  const [annual, setAnnual] = useState(false);
  const fmt = new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 });
  const tab = (active: boolean) => `min-h-[44px] rounded-full px-6 py-2 text-sm font-semibold ${active ? 'bg-brand text-white' : 'border border-ink-muted bg-white text-ink'}`;
  return (
    <div>
      <div role="group" aria-label={t('title')} className="inline-flex gap-2">
        <button type="button" aria-pressed={!annual} className={tab(!annual)} onClick={() => setAnnual(false)}>{t('monthly')}</button>
        <button type="button" aria-pressed={annual} className={tab(annual)} onClick={() => setAnnual(true)}>{t('annual')} · {t('annualSave', { percent: discount })}</button>
      </div>
      <ul className="mt-8 grid gap-6 lg:grid-cols-3">
        {plans.map((p) => {
          const price = p.monthly === null ? null : Math.round(annual ? p.monthly * (1 - discount / 100) : p.monthly);
          return (
            <li key={p.id} className={`flex flex-col rounded-2xl border bg-white p-7 ${p.featured ? 'border-2 border-brand bg-brand-soft' : 'border-brand/10'}`}>
              {p.featured && <p className="mb-2 w-fit rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">{t('popular')}</p>}
              <h2 className="text-xl font-bold">{t(`plans.${p.id}.name`)}</h2>
              <p className="text-sm text-ink-muted">{t(`plans.${p.id}.tagline`)}</p>
              <p className="mt-5">
                {price === null ? <span className="text-4xl font-extrabold tracking-tight">{t('plans.enterprise.priceLabel')}</span> : (
                  <>
                    <span className="text-5xl font-extrabold tracking-tight">{fmt.format(price)}</span>
                    <span className="text-ink-muted"> {t('perMonth')}</span>
                    {annual && <span className="block text-sm text-ink-muted">{t('billedAnnually')}</span>}
                  </>
                )}
              </p>
              <ul className="mt-6 flex-1 space-y-2 text-sm">
                {(t.raw(`plans.${p.id}.bullets`) as string[]).map((b) => (
                  <li key={b} className="flex gap-2"><span aria-hidden="true" className="text-brand">✓</span><span>{b}</span></li>
                ))}
              </ul>
              <LocaleLink href="/contact" className={`mt-6 inline-flex min-h-[48px] items-center justify-center rounded-lg px-5 py-3 text-sm font-bold uppercase tracking-wider ${p.featured ? 'bg-brand text-white hover:bg-brand-dark' : 'border-2 border-brand text-brand-dark hover:bg-brand hover:text-white'}`}>
                {t(`plans.${p.id}.cta`)}
              </LocaleLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
