import { getTranslations } from 'next-intl/server';
import { Container, Card, Pill, Accent } from '@/components/ui/Page';
import Icon, { type IconName } from './Icon';
import SaFeatures, { type SaFeature } from './SaFeatures';
import { saImage, SA } from '@/lib/saImage';

const FEATURES: [string, IconName][] = [['pos', 'cart'], ['membership', 'id'], ['insights', 'chart'], ['inventory', 'stack'], ['finance', 'bank'], ['preorders', 'calendar'], ['comms', 'chat'], ['access', 'scan']];
const SHIPPED: [string, IconName][] = [['batch', 'barcode'], ['consign', 'coin'], ['reports', 'file'], ['account', 'wallet'], ['refunds', 'refund'], ['returns', 'truck'], ['renewals', 'refresh'], ['counts', 'scales'], ['transfers', 'arrows']];
const MOBILE: [string, IconName][] = [['card', 'scan'], ['preorder', 'bag'], ['chat', 'bell'], ['profile', 'user']];
const STEPS: [string, IconName][] = [['s1', 'building'], ['s2', 'userplus'], ['s3', 'store'], ['s4', 'bars']];
const ABOUT: [string, IconName][] = [['c1', 'shield'], ['c2', 'link'], ['c3', 'bars'], ['c4', 'star']];

const Head = ({ badge, children, intro }: { badge: string; children: React.ReactNode; intro?: string }) => (
  <div className="mb-14 text-center"><Pill>{badge}</Pill><h2 className="mx-auto mt-5 max-w-4xl text-3xl font-extrabold leading-tight tracking-tight [overflow-wrap:anywhere] sm:text-5xl">{children}</h2>{intro && <p className="mx-auto mt-4 max-w-2xl text-ink-muted">{intro}</p>}</div>
);

export async function SaFeaturesSection() {
  const t = await getTranslations('sa.features');
  const items: SaFeature[] = FEATURES.map(([k, icon]) => ({ key: k, icon, title: t(`items.${k}.title`), short: t(`items.${k}.short`), desc: t(`items.${k}.desc`), bullets: t.raw(`items.${k}.bullets`) as string[], image: saImage(k) }));
  return (<section className="py-16 sm:py-24"><Container><Head badge={t('badge')} intro={t('intro')}><Accent text={t('title')} /></Head><SaFeatures items={items} /></Container></section>);
}

export async function SaAboutSection({ revenue }: { revenue: string }) {
  const t = await getTranslations();
  const aboutImg = saImage('about');
  return (
    <div className="bg-brand-soft"><section className="py-16 sm:py-24"><Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <div className="relative hidden lg:block">
        <div className="relative overflow-hidden rounded-2xl border border-brand/10">
          {aboutImg
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={aboutImg} alt={t('sa.about.altPhoto')} loading="lazy" className="h-[520px] w-full object-cover object-top" />
            : <div aria-hidden="true" className="h-[520px] w-full bg-gradient-to-br from-[#0b1f14] to-brand-dark" />}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand-soft/80 via-transparent to-transparent" />
        </div>
        <div className="absolute inset-x-8 bottom-8 rounded-xl border border-brand/20 bg-white/95 p-5 backdrop-blur">
          <div className="mb-3 flex items-center justify-between"><span className="text-sm font-bold">{t('mock.revenue')}</span><span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand-dark">+18.4%</span></div>
          <div className="text-3xl font-extrabold">{revenue}</div>
          <div className="text-xs text-ink-muted">{t('sa.about.revenueMeta')}</div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-brand/10"><div className="h-full w-3/4 rounded-full bg-brand" /></div>
          <div className="mt-2 text-[10px] text-ink-muted">{t('mock.sample')}</div>
        </div>
      </div>
      <div>
        <Pill>{t('about.badge')}</Pill>
        <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">{t('sa.about.title')}</h2>
        <p className="mt-6 text-ink-muted">{t('sa.about.body')}</p>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2">
          {ABOUT.map(([c, icon]) => (<li key={c}><div className="h-full rounded-xl border border-brand/10 bg-white/60 p-5 transition-colors hover:border-brand/30"><span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand-dark"><Icon name={icon} /></span><h3 className="mb-2 text-sm font-bold">{t(`about.${c}t`)}</h3><p className="text-xs leading-relaxed text-ink-muted">{t(`about.${c}b`)}</p></div></li>))}
        </ul>
      </div>
    </Container></section></div>
  );
}

export async function SaMobileSection() {
  const t = await getTranslations('sa.mobile');
  const m1 = saImage('mobile-1'), m2 = saImage('mobile-2');
  return (
    <section className="overflow-hidden py-16 sm:py-24"><Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <div>
        <Pill>{t('badge')}</Pill>
        <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">{t('title1')}<br /><span className="text-brand">{t('title2')}</span></h2>
        <p className="mt-6 text-ink-muted">{t('body')}</p>
        <ul className="mt-8 flex flex-col gap-5">
          {MOBILE.map(([k, icon]) => (<li key={k} className="flex items-start gap-4"><span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand-dark"><Icon name={icon} /></span><div><h3 className="mb-1 text-sm font-bold">{t(`items.${k}.title`)}</h3><p className="text-xs leading-relaxed text-ink-muted">{t(`items.${k}.desc`)}</p></div></li>))}
        </ul>
      </div>
      <div className="relative mx-auto flex max-w-md items-center justify-center gap-4 py-6">
        <div aria-hidden="true" className="absolute inset-0 -z-0 m-auto h-72 w-72 rounded-full bg-gradient-to-br from-[#cff1da] to-[#dff5b8] blur-2xl" />
        {m1 && (/* eslint-disable-next-line @next/next/no-img-element */
        <img src={m1} alt={t('altScreen1')} loading="lazy" className="relative z-10 w-1/2 rounded-[2rem] border-4 border-ink shadow-2xl" />)}
        {m2 && (/* eslint-disable-next-line @next/next/no-img-element */
        <img src={m2} alt={t('altScreen2')} loading="lazy" className="relative z-10 mt-12 w-[44%] rounded-[2rem] border-4 border-ink/80 shadow-xl" />)}
      </div>
    </Container></section>
  );
}

export async function SaShippedSection() {
  const t = await getTranslations('sa.shipped');
  return (
    <div className="bg-brand-soft"><section className="py-16 sm:py-24"><Container>
      <div className="mb-12 text-center"><h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t('title')}</h2><p className="mt-2 text-sm text-ink-muted">{t('intro')}</p></div>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SHIPPED.map(([k, icon]) => (<li key={k}><Card className="h-full p-6"><div className="mb-3 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand-dark"><Icon name={icon} /></span><h3 className="font-bold">{t(`items.${k}.title`)}</h3></div><p className="text-sm leading-relaxed text-ink-muted">{t(`items.${k}.desc`)}</p></Card></li>))}
      </ul>
    </Container></section></div>
  );
}

export async function SaHowSection() {
  const t = await getTranslations('sa.how');
  return (
    <section className="py-16 sm:py-24"><Container>
      <Head badge={t('badge')} intro={t('intro')}><Accent text={t('title')} /></Head>
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(([k, icon], n) => (<li key={k}><Card className="h-full"><div className="mb-5 flex items-start justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand-dark"><Icon name={icon} className="h-6 w-6" /></span><span aria-hidden="true" className="text-4xl font-black text-brand/20">0{n + 1}</span></div><h3 className="mb-2 font-bold">{t(`steps.${k}.title`)}</h3><p className="text-sm leading-relaxed text-ink-muted">{t(`steps.${k}.desc`)}</p></Card></li>))}
      </ol>
    </Container></section>
  );
}
