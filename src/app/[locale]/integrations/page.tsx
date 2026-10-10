import { getTranslations } from 'next-intl/server';
import { initLocale, pageMeta } from '@/lib/page';
import { countryOf, marketOf } from '@/i18n/locales';
import { saImage } from '@/lib/saImage';
import { LocaleLink } from '@/components/LocaleLink';
import SolutionVisual from '@/components/SolutionVisual';
import { PageHeader, Section, Container, Notice, Pill } from '@/components/ui/Page';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { return pageMeta(params, 'integrations', '/integrations'); }

const GROUPS = [['hardware', 'pos'], ['payments', 'preorders'], ['accounting', 'finance'], ['api', 'insights']] as const;
const HW = ['hw-t2', 'hw-p5', 'hw-p3', 'hw-p5se'];
const BADGE: Record<string, string> = {
  available: 'bg-brand-soft text-brand-dark', export: 'bg-slate-100 text-slate-800', roadmap: 'bg-warn-soft text-warn', custom: 'bg-slate-100 text-slate-800'
};

export default async function Integrations({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await initLocale(params);
  const t = await getTranslations();
  const market = marketOf(locale);
  const sa = market.visuals === 'sa';
  const names = new Intl.DisplayNames([locale], { type: 'region' });
  const hw = sa ? HW.map((h) => saImage(h)).filter((x): x is string => !!x) : [];
  return (
    <>
      <PageHeader title={t('integrations.title')} intro={t('integrations.intro')} />
      {GROUPS.map(([g, id], i) => (
        <section key={g} className={`py-16 sm:py-20 ${i % 2 ? 'bg-brand-soft' : ''}`}>
          <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
            {g === 'hardware' && hw.length === 4 ? (
              <div aria-hidden="true" className="grid grid-cols-2 gap-4">
                {hw.map((src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <div key={src} className="flex aspect-square items-center justify-center rounded-2xl border border-brand/15 bg-white p-4 shadow-sm"><img src={src} alt="" loading="lazy" className="max-h-full max-w-full object-contain" /></div>
                ))}
              </div>
            ) : (
              <SolutionVisual type={g} id={id === 'preorders' && !sa ? 'pos' : id} sa={sa} className={`h-72 sm:h-96 ${i % 2 ? 'lg:order-2' : ''}`} />
            )}
            <div>
              <Pill>{`0${i + 1}`}</Pill>
              <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{t(`integrations.groups.${g}.title`)}</h2>
              <p className="mt-4 text-lg text-ink-muted">{t(`integrations.groups.${g}.body`)}</p>
            </div>
          </Container>
        </section>
      ))}
      <Section title={t('integrations.traceTitle', { country: names.of(countryOf(locale)) ?? countryOf(locale) })} intro={t('integrations.traceIntro')}>
        <ul className="grid gap-4 sm:grid-cols-2">
          {market.trackAndTrace.map((x) => (
            <li key={x.system} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand/10 bg-white p-5 transition-colors hover:border-brand/30">
              <span className="flex items-center gap-3 font-semibold"><span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand-dark"><svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M4 3h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm2 4v2h8V7H6zm0 4v2h5v-2H6z" /></svg></span>{x.system}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${BADGE[x.status]}`}>{t(`common.status.${x.status}`)}</span>
            </li>
          ))}
        </ul>
        {locale.split('-')[0] !== 'en' && <div className="mt-4"><Notice>{t('common.englishOnly')}</Notice></div>}
      </Section>
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
