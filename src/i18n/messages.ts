// Message loading with fallback chain: en → language → (en-GB spelling for non-US English is the base) → locale override.
// Static imports keep this edge/bundler friendly (no dynamic fs access).
import en from '../../messages/en.json';
import es from '../../messages/es.json';
import fr from '../../messages/fr.json';
import de from '../../messages/de.json';
import nl from '../../messages/nl.json';
import it from '../../messages/it.json';
import ca from '../../messages/ca.json';
import af from '../../messages/af.json';
import zu from '../../messages/zu.json';
import th from '../../messages/th.json';
import enUS from '../../messages/overrides/en-US.json';
import deCH from '../../messages/overrides/de-CH.json';
import { langOf } from './locales';

type Msg = Record<string, unknown>;
const LANGS: Record<string, Msg> = { en, es, fr, de, nl, it, ca, af, zu, th } as Record<string, Msg>;
const OVERRIDES: Record<string, Msg> = { 'en-US': enUS, 'de-CH': deCH } as Record<string, Msg>;

function isObj(v: unknown): v is Msg { return !!v && typeof v === 'object' && !Array.isArray(v); }
export function deepMerge(base: Msg, over: Msg): Msg {
  const out: Msg = { ...base };
  for (const [k, v] of Object.entries(over)) {
    if (k === '_meta') continue;
    out[k] = isObj(v) && isObj(out[k]) ? deepMerge(out[k] as Msg, v) : v;
  }
  return out;
}

export function loadMessages(locale: string): Msg {
  const lang = langOf(locale);
  let m: Msg = LANGS.en;
  if (lang !== 'en' && LANGS[lang]) m = deepMerge(m, LANGS[lang]);
  if (OVERRIDES[locale]) m = deepMerge(m, OVERRIDES[locale]);
  return m;
}
