import { getLocale, getTranslations } from 'next-intl/server';
import { LocaleLink } from './LocaleLink';
import RegionSelector, { type RegionOption } from './RegionSelector';
import MobileNav from './MobileNav';
import BrandMark from './BrandMark';
import { MAIN_NAV } from '@/lib/nav';
import { MARKETS, complianceConfig } from '@/lib/compliance';
import { localizedPath } from '@/i18n/paths';

export default async function Header() {
  const locale = await getLocale();
  const t = await getTranslations('nav');
  const options: RegionOption[] = Object.entries(MARKETS).map(([country, m]) => ({
    country,
    locales: m.languages.map((l) => ({ locale: l, lang: l.split('-')[0], native: complianceConfig.languages[l.split('-')[0]].native }))
  }));
  const items = MAIN_NAV.map((n) => ({ href: localizedPath(locale, n.href), label: t(n.key) }));
  const cta = { href: localizedPath(locale, '/contact'), label: t('bookDemo') };
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="relative mx-auto flex h-16 max-w-page items-center justify-between gap-4 px-4 sm:px-6">
        <LocaleLink href="/" aria-label={t('home')} className="rounded-md"><BrandMark /></LocaleLink>
        <nav aria-label={t('primary')} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {items.map((i) => (
              <li key={i.href}><a href={i.href} className="inline-flex min-h-[44px] items-center rounded-md px-3 text-sm font-semibold text-ink hover:text-brand-dark">{i.label}</a></li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <RegionSelector options={options} />
          <a href={cta.href} className="hidden min-h-[44px] items-center rounded-lg bg-brand px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-brand-dark lg:inline-flex">{cta.label}</a>
          <MobileNav items={items} cta={cta} />
        </div>
      </div>
    </header>
  );
}
