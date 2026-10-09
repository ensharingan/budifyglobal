'use client';
import { LOCALE_COOKIE } from '@/i18n/locales-shared';
import { setCookie } from '@/lib/consent/storage';

/** Plain links (crawlable); clicking also remembers the explicit choice. */
export default function RegionLinks({ items }: { items: { locale: string; href: string; label: string; lang: string }[] }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {items.map((i) => (
        <li key={i.locale}>
          <a href={i.href} lang={i.lang} hrefLang={i.locale} onClick={() => setCookie(LOCALE_COOKIE, i.locale, { days: 365 })}
            className="inline-flex min-h-[44px] items-center rounded-md border-2 border-brand-dark px-4 font-semibold text-brand-dark hover:bg-brand-soft">{i.label}</a>
        </li>
      ))}
    </ul>
  );
}
