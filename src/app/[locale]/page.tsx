import { getTranslations } from 'next-intl/server';
import { initLocale, pageMeta } from '@/lib/page';
import { marketOf } from '@/i18n/locales';
import { LocaleLink } from '@/components/LocaleLink';
import { Container, Section, Card, Accent, Pill, btnPrimary, btnSecondary, Notice } from '@/components/ui/Page';
import FeatureShowcase, { type ShowcaseItem } from '@/components/FeatureShowcase';
import DashboardMock, { type MockText } from '@/components/DashboardMock';
import JsonLd from '@/components/JsonLd';
import { SITE_URL } from '@/lib/site';
import { localizedPath } from '@/i18n/paths';
import pricing from '@root/content/pricing.json';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { return pageMeta(params, 'home', '/'); }

const SHOW = ['pos', 'membership', 'inventory', 'compliance', 'finance'] as const;
const HAS_ASSOC = new Set(['pos', 'finance']);

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await initLocale(params);
  const t = await getTranslations();
  const market = marketOf(locale);
  const pos = market.positioning;
  const heroTitle = t(`hero.title.${pos}`);
  const longest = Math.max(...heroTitle.split(/\s+/).map((w) => w.length));
  const heroSize = longest >= 24 ? 'text-3xl sm:text-4xl lg:text-[2.1rem] xl:text-[2.3rem]' : longest >= 16 ? 'text-4xl sm:text-5xl lg:text-[2.9rem]' : 'text-4xl sm:text-5xl lg:text-[3.6rem]';
  const showItems: ShowcaseItem[] = SHOW.map((k) => {
    const base = HAS_ASSOC.has(k) && pos === 'association' ? `features.items.${k}.assoc` : `features.items.${k}`;
    return { key: k, title: t(`${base}.title`), body: t(`${base}.body`), bullets: t.raw(`${base}.bullets`) as string[] };
  });
  const money = (n: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: market.currency, maximumFractionDigits: 0 }).format(n);
  const mock: MockText = {
    label: t('hero.mockLabel'), glance: t('mock.glance'), newSale: t('mock.newSale'), revenue: t('mock.revenue'), members: t('mock.members'), openTabs: t('mock.openTabs'),
    salesWeek: t('mock.salesWeek'), recent: t('mock.recent'), memberCard: t('mock.memberCard'), tier: t('mock.tier'), active: t('mock.active'), posActive: t('mock.posActive'), terminals: t('mock.terminals'), sample: t('mock.sample'),
    kpis: [[t('mock.revenue'), money(4480), '+18.4%'], [t('mock.members'), '1,284', '+42'], [t('mock.openTabs'), '12', money(640)]],
    rows: [[t('mock.gold'), money(84)], [t('mock.silver'), money(37)], [t('mock.walkin'), money(52)], [t('mock.gold'), money(19)]]
  };
  const ABOUT = ['c1', 'c2', 'c3', 'c4'] as const;
  const lowest = (pricing.plans.starter.prices as Record<string, number>)[market.currency];

  return (
    <>
      <section className="overflow-hidden bg-white">
        <Container className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.02fr_1fr]">
          <div className="min-w-0">
            <Pill>{t('hero.eyebrow')}</Pill>
            <h1 className={`hyphens-auto [overflow-wrap:anywhere] mt-5 font-extrabold leading-[1.06] tracking-tight ${heroSize}`}><Accent text={heroTitle} /></h1>
            <p className="mt-6 max-w-xl text-lg text-ink-muted lg:text-xl">{t(`hero.subtitle.${pos}`)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LocaleLink href="/contact" className={btnPrimary}>{t('hero.ctaPrimary')}</LocaleLink>
              <LocaleLink href="/features" className={btnSecondary}>{t('hero.ctaSecondary')}</LocaleLink>
            </div>
            <p className="mt-8 max-w-md border-t border-line pt-6 text-sm text-ink-muted">{t('hero.disclaimer')}</p>
          </div>
          <DashboardMock m={mock} />
        </Container>
      </section>

      <div className="bg-brand-soft"><section className="py-14 sm:py-20"><Container className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div aria-hidden="true" className="relative min-h-[320px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#07120b] via-[#0b1f14] to-[#14532d] p-6">
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(74,222,128,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(74,222,128,.25)_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white/95 p-5 shadow-xl">
            <div className="flex items-center justify-between text-sm font-bold"><span>{t('mock.revenue')}</span><span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs text-brand-dark">+18.4%</span></div>
            <div className="mt-2 text-3xl font-extrabold tracking-tight">{money(4480)}</div>
            <div className="mt-3 h-2 rounded-full bg-brand/10"><div className="h-2 w-3/4 rounded-full bg-brand" /></div>
          </div>
        </div>
        <div>
          <Pill>{t('about.badge')}</Pill>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{t('about.title')}</h2>
          <p className="mt-4 text-ink-muted">{t('about.body')}</p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {ABOUT.map((c) => (<li key={c}><Card className="h-full p-5"><h3 className="font-bold">{t(`about.${c}t`)}</h3><p className="mt-1.5 text-sm text-ink-muted">{t(`about.${c}b`)}</p></Card></li>))}
          </ul>
        </div>
      </Container></section></div>

      <Section title={t('home.pillarsTitle')} intro={t('home.pillarsIntro')}>
        <FeatureShowcase items={showItems} />
      </Section>

      <div className="bg-brand-soft"><Section title={t('home.audienceTitle')} intro={t('home.audienceIntro')}>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {market.solutions.map((s) => (
            <li key={s}><Card className="flex h-full flex-col">
              <h3 className="font-semibold">{t(`solutions.items.${s}.title`)}</h3>
              <p className="mt-2 flex-1 text-sm text-ink-muted">{t(`solutions.items.${s}.summary`)}</p>
              <LocaleLink href={`/solutions/${s}`} className="mt-4 inline-flex min-h-[44px] items-center font-semibold text-brand-dark underline">{t('common.learnMore')}<span className="sr-only">: {t(`solutions.items.${s}.title`)}</span></LocaleLink>
            </Card></li>
          ))}
        </ul>
      </Section></div>

      <Section>
        <div className="grid gap-8 rounded-3xl bg-brand-dark p-8 text-white on-dark sm:p-12 lg:grid-cols-[2fr_1fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t('home.complianceTitle')}</h2>
            <p className="mt-3 max-w-2xl text-green-50">{t('home.complianceBody')}</p>
          </div>
          <div className="lg:text-end">
            <LocaleLink href="/compliance" className="inline-flex min-h-[48px] items-center rounded-lg bg-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-brand-dark hover:bg-brand-soft">{t('home.complianceCta')}</LocaleLink>
          </div>
        </div>
      </Section>

      <Section>
        <Card className="text-center">
          <h2 className="text-2xl font-bold">{t('home.ctaTitle')}</h2>
          <p className="mx-auto mt-2 max-w-xl text-ink-muted">{t('home.ctaBody')}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <LocaleLink href="/contact" className={btnPrimary}>{t('common.bookDemo')}</LocaleLink>
            <LocaleLink href="/pricing" className={btnSecondary}>{t('common.viewPricing')}</LocaleLink>
          </div>
        </Card>
        <div className="mt-6"><Notice>{t('common.b2bOnly')}</Notice></div>
      </Section>

      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Budify',
        applicationCategory: 'BusinessApplication', operatingSystem: 'Web, Android',
        url: SITE_URL + localizedPath(locale, '/'), inLanguage: locale,
        description: t('meta.home.description'),
        offers: { '@type': 'Offer', price: String(lowest), priceCurrency: market.currency, priceSpecification: { '@type': 'UnitPriceSpecification', price: String(lowest), priceCurrency: market.currency, unitText: 'MONTH' } }
      }} />
    </>
  );
}
