import { getTranslations } from 'next-intl/server';
import { initLocale, pageMeta } from '@/lib/page';
import { marketOf } from '@/i18n/locales';
import { LocaleLink } from '@/components/LocaleLink';
import SolutionVisual from '@/components/SolutionVisual';
import { PageHeader, Container, CheckList, Pill, btnPrimary, btnSecondary } from '@/components/ui/Page';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { return pageMeta(params, 'solutions', '/solutions'); }

export default async function Solutions({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await initLocale(params);
  const t = await getTranslations();
  const market = marketOf(locale);
  const sa = market.visuals === 'sa';
  return (
    <>
      <PageHeader title={t('solutions.title')} intro={t('solutions.intro')} />
      {market.solutions.map((s, i) => (
        <section key={s} className={`py-16 sm:py-24 ${i % 2 ? 'bg-brand-soft' : ''}`}>
          <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
            <SolutionVisual type={s} sa={sa} className={`h-72 sm:h-96 ${i % 2 ? 'lg:order-2' : ''}`} />
            <div>
              <Pill>{t(`solutions.items.${s}.summary`)}</Pill>
              <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{t(`solutions.items.${s}.title`)}</h2>
              <p className="mt-4 text-lg text-ink-muted">{t(`solutions.items.${s}.body`)}</p>
              <div className="mt-6"><CheckList items={t.raw(`solutions.items.${s}.points`) as string[]} /></div>
              <LocaleLink href={`/solutions/${s}`} className="mt-8 inline-flex min-h-[44px] items-center font-bold text-brand-dark underline">{t('common.learnMore')}<span className="sr-only">: {t(`solutions.items.${s}.title`)}</span></LocaleLink>
            </div>
          </Container>
        </section>
      ))}
      <section className="py-16 sm:py-24"><Container>
        <div className="mb-10 max-w-2xl"><h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t('about.title')}</h2><p className="mt-3 text-ink-muted">{t('about.body')}</p></div>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(['c1', 'c2', 'c3', 'c4'] as const).map((c) => (<li key={c} className="rounded-xl border border-brand/10 bg-white p-6 transition-colors hover:border-brand/30"><h3 className="mb-2 font-bold">{t(`about.${c}t`)}</h3><p className="text-sm leading-relaxed text-ink-muted">{t(`about.${c}b`)}</p></li>))}
        </ul>
      </Container></section>
      <section className="bg-brand-dark py-16 text-white sm:py-20"><Container className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t('home.ctaTitle')}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-white/80">{t('home.ctaBody')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LocaleLink href="/contact" className="inline-flex min-h-[48px] items-center rounded-lg bg-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-brand-dark hover:bg-brand-soft">{t('common.bookDemo')}</LocaleLink>
          <LocaleLink href="/pricing" className="inline-flex min-h-[48px] items-center rounded-lg border-2 border-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10">{t('common.viewPricing')}</LocaleLink>
        </div>
      </Container></section>
    </>
  );
}
