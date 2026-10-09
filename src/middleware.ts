import { NextResponse, type NextRequest } from 'next/server';
import { LOCALES, LOCALE_COOKIE, isLocale, langOf } from '@/i18n/locales';
import { negotiateLocale, LANG_PRIMARY } from '@/i18n/negotiate';
import { toInternalSegments, toLocalizedSegments } from '@/i18n/paths';

/**
 * Edge middleware:
 *  - URLs without a locale  → redirect to the negotiated locale (cookie > IP country > Accept-Language > default)
 *  - /{locale}/localized-slug → rewrite to the internal route; non-canonical slugs → 308 to the canonical one
 *  - NEVER changes the locale of a URL that already carries one (no auto-redirect after the user has chosen)
 *  - NEVER blocks by geography
 */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];

  // 1) exact locale present
  if (first && isLocale(first)) {
    const lang = langOf(first);
    const rest = segments.slice(1);
    const internal = toInternalSegments(lang, rest);
    const canonical = toLocalizedSegments(lang, internal);
    if (canonical.join('/') !== rest.join('/')) {
      const url = req.nextUrl.clone();
      url.pathname = `/${first}${canonical.length ? '/' + canonical.join('/') : ''}`;
      return NextResponse.redirect(url, 308);
    }
    if (internal.join('/') !== rest.join('/')) {
      const url = req.nextUrl.clone();
      url.pathname = `/${first}/${internal.join('/')}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // 2) locale in the wrong case (/en-us/…) → canonical case
  const ci = first ? LOCALES.find((l) => l.toLowerCase() === first.toLowerCase()) : undefined;
  if (ci) {
    const url = req.nextUrl.clone();
    url.pathname = `/${ci}${segments.length > 1 ? '/' + segments.slice(1).join('/') : ''}`;
    return NextResponse.redirect(url, 308);
  }

  // 3) bare language (/de, /fr) → best locale for that language
  if (first && LANG_PRIMARY[first.toLowerCase()]) {
    const geo = req.headers.get('x-vercel-ip-country') ?? req.headers.get('cf-ipcountry');
    const lang = first.toLowerCase();
    const candidates = LOCALES.filter((l) => langOf(l) === lang);
    const byGeo = geo ? candidates.find((l) => l.endsWith('-' + geo.toUpperCase())) : undefined;
    const target = byGeo ?? (candidates.includes(LANG_PRIMARY[lang]) ? LANG_PRIMARY[lang] : candidates[0]);
    const url = req.nextUrl.clone();
    url.pathname = `/${target}${segments.length > 1 ? '/' + segments.slice(1).join('/') : ''}`;
    return noStore(NextResponse.redirect(url, 307));
  }

  // 4) no locale → negotiate a default
  const geo = req.headers.get('x-vercel-ip-country') ?? req.headers.get('cf-ipcountry');
  const locale = negotiateLocale({
    cookie: req.cookies.get(LOCALE_COOKIE)?.value,
    geo,
    acceptLanguage: req.headers.get('accept-language')
  });
  const internal = toInternalSegments(langOf(locale), segments);
  const canonical = toLocalizedSegments(langOf(locale), internal);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${canonical.length ? '/' + canonical.join('/') : ''}`;
  url.search = search;
  return noStore(NextResponse.redirect(url, 307));
}

function noStore(res: NextResponse) {
  res.headers.set('Cache-Control', 'private, no-store');
  res.headers.set('Vary', 'Accept-Language, Cookie');
  return res;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
