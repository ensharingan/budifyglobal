#!/usr/bin/env node
// Validates messages/*.json against messages/en.json (source of truth).
// - full languages: every key present, same placeholders, same array lengths
// - core languages: core namespaces must be complete; other keys optional (fall back to en at runtime)
// - overrides: may only contain keys that exist in en
// Usage: node scripts/check-i18n.mjs [--lang xx]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cfg = JSON.parse(fs.readFileSync(path.join(root, 'scripts/i18n.config.json'), 'utf8'));
const compliance = JSON.parse(fs.readFileSync(path.join(root, 'compliance.config.json'), 'utf8'));
const onlyLang = process.argv.includes('--lang') ? process.argv[process.argv.indexOf('--lang') + 1] : null;

const errors = [];
const warns = [];
const err = (m) => errors.push(m);

function readJson(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { err(`${path.relative(root, p)}: invalid JSON – ${e.message}`); return null; }
}
function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    if (cfg.ignoreKeyPrefixes.some((p) => k.startsWith(p)) && prefix === '') continue;
    const key = prefix ? `${prefix}.${k}` : k;
    if (Array.isArray(v)) {
      out[key] = v;
    } else if (v && typeof v === 'object') flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}
const placeholders = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
function leafStrings(v) { return Array.isArray(v) ? v.flatMap((x) => (typeof x === 'object' ? Object.values(x) : [x])) : [v]; }

const en = readJson(path.join(root, 'messages/en.json'));
if (!en) { report(); }
const enFlat = flatten(en);

function compareLang(lang, file, mode) {
  const data = readJson(file);
  if (!data) return;
  const flat = flatten(data);
  const rel = path.relative(root, file);
  for (const key of Object.keys(flat)) {
    if (!(key in enFlat)) { err(`${rel}: unknown key "${key}" (not in en.json)`); continue; }
    const a = enFlat[key], b = flat[key];
    if (Array.isArray(a) !== Array.isArray(b)) { err(`${rel}: "${key}" type mismatch (array vs string)`); continue; }
    if (Array.isArray(a) && a.length !== b.length) err(`${rel}: "${key}" array length ${b.length} ≠ ${a.length}`);
    if (typeof b === 'string' && b.trim() === '') err(`${rel}: "${key}" is empty`);
    const pa = leafStrings(a).map(placeholders).join('|');
    const pb = leafStrings(b).map(placeholders).join('|');
    if (pa !== pb) err(`${rel}: "${key}" placeholders differ (en: ${pa || '–'} / ${lang}: ${pb || '–'})`);
  }
  if (mode === 'full') {
    let pending = 0;
    for (const key of Object.keys(enFlat)) if (!(key in flat)) {
      if ((cfg.englishOnlyNamespaces ?? []).some((ns) => key.startsWith(ns + '.'))) { pending++; continue; }
      err(`${rel}: missing key "${key}"`);
    }
    if (pending) warns.push(`${rel}: ${pending} keys in English-only namespaces (${(cfg.englishOnlyNamespaces ?? []).join(', ')}) fall back to English – translate before launch`);
  } else if (mode === 'core') {
    for (const key of Object.keys(enFlat)) {
      if (cfg.coreNamespaces.some((ns) => key === ns || key.startsWith(ns + '.')) && !(key in flat)) err(`${rel}: missing core key "${key}"`);
    }
  }
}

const langsInUse = new Set();
for (const m of Object.values(compliance.markets)) for (const l of m.languages) langsInUse.add(l.split('-')[0]);

for (const lang of langsInUse) {
  if (onlyLang && lang !== onlyLang) continue;
  const file = path.join(root, `messages/${lang}.json`);
  if (!fs.existsSync(file)) { err(`messages/${lang}.json is missing (language used by a market)`); continue; }
  const mode = cfg.full.includes(lang) ? 'full' : cfg.core.includes(lang) ? 'core' : 'partial';
  if (mode === 'partial') warns.push(`messages/${lang}.json is not listed in scripts/i18n.config.json (full/core)`);
  if (lang !== 'en') compareLang(lang, file, mode);
}
const ovDir = path.join(root, 'messages/overrides');
if (fs.existsSync(ovDir) && !onlyLang) {
  for (const f of fs.readdirSync(ovDir).filter((f) => f.endsWith('.json'))) compareLang(f.replace('.json', ''), path.join(ovDir, f), 'override');
}

// Slug dictionaries must be injective per language.
const slugs = readJson(path.join(root, 'src/i18n/slugs.json'));
if (slugs) {
  for (const [lang, dict] of Object.entries(slugs)) {
    const seen = new Map();
    for (const [id, slug] of Object.entries(dict)) {
      if (seen.has(slug)) err(`slugs.json[${lang}]: "${slug}" used for both "${seen.get(slug)}" and "${id}"`);
      seen.set(slug, id);
      if (!/^[a-z0-9-]+$/.test(slug)) err(`slugs.json[${lang}]: slug "${slug}" must be lowercase ASCII`);
    }
  }
}

function report() {
  for (const w of warns) console.warn('⚠ ' + w);
  if (errors.length) {
    console.error(`\ni18n check FAILED (${errors.length} problem${errors.length === 1 ? '' : 's'}):`);
    for (const e of errors.slice(0, 80)) console.error(' ✖ ' + e);
    if (errors.length > 80) console.error(` … and ${errors.length - 80} more`);
    process.exit(1);
  }
  console.log(`i18n check passed (${Object.keys(enFlat || {}).length} source keys).`);
}
report();
