import slugs from './slugs.json';
const langOf = (locale: string) => locale.split('-')[0];

type Dict = Record<string, string>;
const DICTS = slugs as Record<string, Dict>;
const EN = DICTS.en;

function dictFor(lang: string): Dict { return { ...EN, ...(DICTS[lang] ?? {}) }; }
const reverseCache = new Map<string, Record<string, string>>();
function reverseFor(lang: string): Record<string, string> {
  let r = reverseCache.get(lang);
  if (!r) { r = Object.fromEntries(Object.entries(dictFor(lang)).map(([id, slug]) => [slug, id])); reverseCache.set(lang, r); }
  return r;
}

/** "/legal/privacy" → "/de-DE/rechtliches/datenschutz" */
export function localizedPath(locale: string, internalPath: string): string {
  const d = dictFor(langOf(locale));
  const [pathPart, hash] = internalPath.split('#');
  const segs = pathPart.split('/').filter(Boolean).map((s) => d[s] ?? s);
  return `/${locale}${segs.length ? '/' + segs.join('/') : ''}${hash ? '#' + hash : ''}`;
}

/** ["rechtliches","datenschutz"] (+ lang) → ["legal","privacy"] */
export function toInternalSegments(lang: string, segments: string[]): string[] {
  const rev = reverseFor(lang);
  return segments.map((s) => rev[s] ?? s);
}
/** True when `segments` already use the canonical localized form for `lang`. */
export function toLocalizedSegments(lang: string, internal: string[]): string[] {
  const d = dictFor(lang);
  return internal.map((s) => d[s] ?? s);
}
export function allInternalIds(): string[] { return Object.keys(EN); }
