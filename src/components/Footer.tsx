import { getLocale, getTranslations } from 'next-intl/server';
import { LocaleLink } from './LocaleLink';
import BrandMark from './BrandMark';
import CookieSettingsButton from './compliance/CookieSettingsButton';
import { FOOTER_LINKS, MAIN_NAV } from '@/lib/nav';
import { marketOf } from '@/i18n/locales';

export default async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations();
  const market = marketOf(locale);
  const linkCls = 'inline-flex min-h-[32px] items-center rounded-sm text-sm text-ink-muted underline-offset-2 hover:text-ink hover:underline';
  const required = market.requiredLinks;
  const notices = Array.from(new Set(['footer.notice', ...market.requiredFooterText]));
  return (
    <footer className="mt-20 border-t border-line bg-surface-alt">
      <div className="mx-auto grid max-w-page gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <BrandMark />
          <p className="mt-3 text-sm text-ink-muted">{t('footer.tagline')}</p>
          <p className="mt-3 text-sm text-ink-muted">{t('common.b2bOnly')}</p>
        </div>
        <nav aria-label={t('footer.product')}>
          <h2 className="text-sm font-semibold">{t('footer.product')}</h2>
          <ul className="mt-3 space-y-1">
            {MAIN_NAV.map((n) => <li key={n.id}><LocaleLink className={linkCls} href={n.href}>{t(`nav.${n.key}`)}</LocaleLink></li>)}
            <li><LocaleLink className={linkCls} href="/case-studies">{t('nav.caseStudies')}</LocaleLink></li>
          </ul>
        </nav>
        <nav aria-label={t('footer.company')}>
          <h2 className="text-sm font-semibold">{t('footer.company')}</h2>
          <ul className="mt-3 space-y-1">
            <li><LocaleLink className={linkCls} href="/contact">{t('nav.bookDemo')}</LocaleLink></li>
            <li><LocaleLink className={linkCls} href="/security">{t('footer.links.security')}</LocaleLink></li>
            <li><LocaleLink className={linkCls} href="/status">{t('footer.links.status')}</LocaleLink></li>
            <li><LocaleLink className={linkCls} href="/sub-processors">{t('footer.links.subProcessors')}</LocaleLink></li>
            <li><LocaleLink className={linkCls} href="/regions">{t('footer.region')}</LocaleLink></li>
          </ul>
        </nav>
        <nav aria-label={t('footer.legalTitle')}>
          <h2 className="text-sm font-semibold">{t('footer.legalTitle')}</h2>
          <ul className="mt-3 space-y-1">
            {required.map((k) => {
              const def = FOOTER_LINKS[k];
              return (
                <li key={k}>
                  {def.action === 'cookieSettings'
                    ? <CookieSettingsButton className={linkCls + ' underline'} />
                    : <LocaleLink className={linkCls} href={def.href!}>{t(`footer.links.${def.labelKey}`)}</LocaleLink>}
                </li>
              );
            })}
            <li><LocaleLink className={linkCls} href="/legal">{t('footer.links.legalHub')}</LocaleLink></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto max-w-page space-y-2 px-4 py-6 text-sm text-ink-muted sm:px-6">
          {notices.map((k) => <p key={k}>{t(k)}</p>)}
          <p>{t('footer.copyright', { year: new Date().getUTCFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
}
