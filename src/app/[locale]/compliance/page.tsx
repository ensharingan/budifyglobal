import { getTranslations } from 'next-intl/server';
import { initLocale, pageMeta } from '@/lib/page';
import { countryOf, marketOf, minAgeOf } from '@/i18n/locales';
import { MARKETS } from '@/lib/compliance';
import { LocaleLink } from '@/components/LocaleLink';
import SolutionVisual from '@/components/SolutionVisual';
import { PageHeader, Container, Notice, Pill, btnPrimary } from '@/components/ui/Page';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { return pageMeta(params, 'compliance', '/compliance'); }

const flag = (cc: string) => String.fromCodePoint(...[...cc.toUpperCase()].map((c) => 127397 + c.charCodeAt(0)));

export default async function ComplianceCentre({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await initLocale(params);
  const t = await getTranslations('compliance');
  const c = await getTranslations();
  const names = new Intl.DisplayNames([locale], { type: 'region' });
  const mine = countryOf(locale);
  const sa = marketOf(locale).visuals === 'sa';
  const others = Object.entries(MARKETS).filter(([cc]) => cc !== mine).sort(([a], [b]) => (names.of(a) ?? a).localeCompare(names.of(b) ?? b, locale));
  const my = MARKETS[mine];
  return (
    <>
      <PageHeader title={t('title')} intro={t('intro')} />
      <section className="pt-10"><Container><Notice tone="warn">{t('disclaimer')}</Notice></Container></section>
      {my && (
        <section className="py-14 sm:py-20"><Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <SolutionVisual type="compliance" id="access" sa={sa} className="h-72 sm:h-96" />
          <div>
            <Pill>{t('yourMarket')}</Pill>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-5xl"><span aria-hidden="true">{flag(mine)} </span>{names.of(mine) ?? mine}</h2>
            <p className="mt-4 text-lg text-ink-muted">{t(`positioning.${my.positioning}`)}</p>
            <p className="mt-2 text-sm text-ink-muted">{t('ageLabel', { age: minAgeOf(locale) })}</p>
            <LocaleLink href={`/compliance/${mine.toLowerCase()}`} className={`${btnPrimary} mt-8`}>{t('viewMarket', { country: names.of(mine) ?? mine })}</LocaleLink>
          </div>
        </Container></section>
      )}
      <section className="bg-brand-soft py-14 sm:py-20"><Container>
        <h2 className="mb-8 text-2xl font-extrabold tracking-tight sm:text-3xl">{t('allMarkets')}</h2>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {others.map(([cc, m]) => (
            <li key={cc}><LocaleLink href={`/compliance/${cc.toLowerCase()}`} className="group flex h-full flex-col rounded-2xl border border-brand/10 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg">
              <span aria-hidden="true" className="text-4xl">{flag(cc)}</span>
              <h3 className="mt-4 text-xl font-bold">{names.of(cc) ?? cc}</h3>
              <p className="mt-2 flex-1 text-sm text-ink-muted">{t(`positioning.${m.positioning}`)}</p>
              <div className="mt-4 flex flex-col items-start gap-3">
                <span className="w-fit rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-dark">{t('ageLabel', { age: m.minAge })}</span>
                <span className="font-bold text-brand-dark underline">{t('viewMarket', { country: names.of(cc) ?? cc })}</span>
              </div>
            </LocaleLink></li>
          ))}
        </ul>
      </Container></section>
      <section className="py-14 sm:py-20"><Container>
        <div className="mb-10 max-w-2xl"><h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{c('about.title')}</h2><p className="mt-3 text-ink-muted">{c('about.body')}</p></div>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(['c1', 'c2', 'c3', 'c4'] as const).map((k) => (<li key={k} className="rounded-xl border border-brand/10 bg-white p-6 transition-colors hover:border-brand/30"><h3 className="mb-2 font-bold">{c(`about.${k}t`)}</h3><p className="text-sm leading-relaxed text-ink-muted">{c(`about.${k}b`)}</p></li>))}
        </ul>
      </Container></section>
      <section className="bg-brand-dark py-16 text-white sm:py-20"><Container className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{c('home.ctaTitle')}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-white/80">{c('home.ctaBody')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LocaleLink href="/contact" className="inline-flex min-h-[48px] items-center rounded-lg bg-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-brand-dark hover:bg-brand-soft">{c('common.bookDemo')}</LocaleLink>
          <LocaleLink href="/pricing" className="inline-flex min-h-[48px] items-center rounded-lg border-2 border-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10">{c('common.viewPricing')}</LocaleLink>
        </div>
      </Container></section>
    </>
  );
}
