'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useLocale, useTranslations } from 'next-intl';
import { LOCALE_COOKIE } from '@/i18n/locales-shared';
import { setCookie } from '@/lib/consent/storage';
import { localizedPath, toInternalSegments } from '@/i18n/paths';

export interface RegionOption { country: string; locales: { locale: string; native: string; lang: string }[] }

export function useSwitchLocale() {
  const router = useRouter();
  const pathname = usePathname();
  const current = useLocale();
  return (target: string) => {
    // Remember the visitor's explicit choice (strictly necessary: it only stores the locale code).
    setCookie(LOCALE_COOKIE, target, { days: 365 });
    const segs = pathname.split('/').filter(Boolean).slice(1); // drop current locale
    const internal = toInternalSegments(current.split('-')[0], segs);
    router.push(localizedPath(target, '/' + internal.join('/')));
  };
}

export default function RegionSelector({ options }: { options: RegionOption[] }) {
  const t = useTranslations('selector');
  const locale = useLocale();
  const [country0, lang0] = [locale.split('-')[1], locale.split('-')[0]];
  const switchLocale = useSwitchLocale();
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState(country0);
  const [chosen, setChosen] = useState(locale);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const names = new Intl.DisplayNames([locale], { type: 'region' });

  const langs = options.find((o) => o.country === country)?.locales ?? [];
  useEffect(() => { if (!langs.some((l) => l.locale === chosen)) setChosen(langs[0]?.locale ?? locale); }, [country]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return;
    ref.current?.querySelector<HTMLElement>('select')?.focus();
    const el = ref.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); btnRef.current?.focus(); }
      if (e.key !== 'Tab' || !el) return;
      const f = el.querySelectorAll<HTMLElement>('select,button');
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const field = 'mt-1 block min-h-[44px] w-full rounded-md border border-ink-muted bg-white px-3 py-2 text-base';
  return (
    <>
      <button ref={btnRef} type="button" onClick={() => { setCountry(country0); setChosen(locale); setOpen(true); }}
        aria-haspopup="dialog" aria-label={t('button', { country: names.of(country0) ?? country0, language: langs.find((l) => l.locale === locale)?.native ?? lang0 })}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-medium hover:bg-surface-alt">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" /></svg>
        <span aria-hidden="true">{country0} · {lang0.toUpperCase()}</span>
      </button>
      {/* Portal to <body>: the header uses backdrop-blur, which makes it the containing block for
          position:fixed children and would otherwise clip/size the modal to the header. */}
      {open && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[75] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="sel-title" className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 id="sel-title" className="text-lg font-semibold">{t('title')}</h2>
            <p className="mt-2 text-sm text-ink-muted">{t('intro')}</p>
            <div className="mt-4">
              <label className="block text-sm font-medium">{t('country')}
                <select className={field} value={country} onChange={(e) => setCountry(e.target.value)}>
                  {options.map((o) => <option key={o.country} value={o.country}>{names.of(o.country) ?? o.country}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium">{t('language')}
                <select className={field} value={chosen} onChange={(e) => setChosen(e.target.value)}>
                  {langs.map((l) => <option key={l.locale} value={l.locale} lang={l.lang}>{l.native}</option>)}
                </select>
              </label>
            </div>
            <p className="mt-4 text-xs text-ink-muted">{t('remember')}</p>
            <div className="mt-5 flex gap-3">
              <button type="button" className="min-h-[44px] flex-1 rounded-lg bg-brand px-4 py-2 text-sm font-bold uppercase tracking-wider text-white hover:bg-brand-dark" onClick={() => { setOpen(false); switchLocale(chosen); }}>{t('go')}</button>
              <button type="button" className="min-h-[44px] flex-1 rounded-md border-2 border-ink-muted px-4 py-2 font-semibold hover:bg-surface-alt" onClick={() => { setOpen(false); btnRef.current?.focus(); }}>{t('close')}</button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
