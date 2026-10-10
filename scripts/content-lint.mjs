#!/usr/bin/env node
// Fails the build if copy contains banned claims or images carry banned imagery tags.
//  - global.bannedClaims apply everywhere; markets.*.bannedClaims also apply to that market's languages
//  - images must be declared in content/images.manifest.json with tags; banned tags fail the build
import fs from 'node:fs';
import path from 'node:path';
import { compliance, readJson, flatten, walk, root, rel, reporter } from './lib.mjs';

const { err, warn, done } = reporter('content lint');
const cfg = compliance();

function matcher(term) {
  const t = term.toLowerCase();
  // Non-Latin scripts (e.g. Thai) have no word boundaries → plain substring
  if (/[^\u0000-ɏ]/.test(t)) return (s) => s.includes(t);
  const re = new RegExp(`(?<![\\p{L}\\p{N}])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')}(?![\\p{L}\\p{N}])`, 'iu');
  return (s) => re.test(s);
}
const globalTerms = cfg.global.bannedClaims.map((t) => ({ t, test: matcher(t), scope: 'global' }));
const termsForLang = (lang) => {
  const out = [...globalTerms];
  for (const [cc, m] of Object.entries(cfg.markets)) {
    if (m.languages.some((l) => l.split('-')[0] === lang)) for (const t of m.bannedClaims) out.push({ t, test: matcher(t), scope: cc });
  }
  return out;
};

// 1) message files
for (const f of walk(path.join(root, 'messages'), ['.json'])) {
  const lang = path.basename(f).split(/[.-]/)[0];
  const terms = termsForLang(lang);
  const flat = flatten(JSON.parse(fs.readFileSync(f, 'utf8')));
  for (const [key, val] of Object.entries(flat)) {
    if (typeof val !== 'string' || key.startsWith('_meta')) continue;
    for (const { t, test, scope } of terms) if (test(val.toLowerCase())) err(`${rel(f)} → ${key}: banned term "${t}" (${scope})`);
  }
}

// 2) English content & templates
const textFiles = [...walk(path.join(root, 'content'), ['.ts', '.json'], ['images.manifest.json', 'sa-visuals.json']), ...walk(path.join(root, 'src'), ['.ts', '.tsx']), ...walk(path.join(root, 'public'), ['.txt', '.md'])];
for (const f of textFiles) {
  const src = fs.readFileSync(f, 'utf8').toLowerCase();
  const terms = termsForLang('en');
  for (const { t, test, scope } of terms) if (test(src)) err(`${rel(f)}: banned term "${t}" (${scope})`);
}

// 2b) translated articles: apply banned terms for that language
for (const f of walk(path.join(root, 'content', 'articles', 'translations'), ['.json'])) {
  const lang = path.basename(f).split('-')[0];
  const terms = termsForLang(lang);
  const flat = flatten(JSON.parse(fs.readFileSync(f, 'utf8')));
  for (const [key, val] of Object.entries(flat)) {
    if (typeof val !== 'string') continue;
    for (const { t, test, scope } of terms) if (test(val.toLowerCase())) err(`${rel(f)} → ${key}: banned term "${t}" (${scope})`);
  }
}

// 3) imagery
const manifest = readJson('content/images.manifest.json');
const banned = new Set(cfg.global.bannedImageryTags.map((t) => t.toLowerCase()));
const allowed = new Set(cfg.global.allowedImageryTags.map((t) => t.toLowerCase()));
const declared = new Map();
for (const img of manifest.images) {
  declared.set(img.path, img);
  if (!img.alt && !img.decorative) err(`images.manifest: ${img.path} needs alt text (or decorative: true)`);
  if (!img.tags?.length) err(`images.manifest: ${img.path} has no tags`);
  for (const tag of img.tags ?? []) {
    if (banned.has(tag.toLowerCase())) err(`images.manifest: ${img.path} has banned imagery tag "${tag}"`);
    else if (!allowed.has(tag.toLowerCase())) err(`images.manifest: ${img.path} tag "${tag}" is not in allowedImageryTags`);
  }
  if (!fs.existsSync(path.join(root, img.path))) err(`images.manifest: ${img.path} does not exist`);
}
for (const f of walk(path.join(root, 'public'), ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.svg'], [path.join('public', 'sa')])) {
  const r = rel(f);
  if (!declared.has(r)) err(`${r} is not declared in content/images.manifest.json`);
  for (const tok of path.basename(f).toLowerCase().split(/[^a-z0-9]+/)) if (banned.has(tok)) err(`${r}: filename contains banned imagery word "${tok}"`);
}
// any /images/… reference in source must be declared
for (const f of walk(path.join(root, 'src'), ['.ts', '.tsx'])) {
  const s = fs.readFileSync(f, 'utf8');
  for (const m of s.matchAll(/['"`](\/images\/[^'"`]+)['"`]/g)) if (!declared.has('public' + m[1])) err(`${rel(f)}: references ${m[1]} which is not in the images manifest`);
  if (/<img\b/.test(s) && !/alt=/.test(s)) err(`${rel(f)}: <img> without alt`);
}
// 4) cannabis-themed 'sa' visuals (explicitly requested by the owner): warn, and fail under STRICT_LAUNCH until counsel approval is recorded
const saMarkets = Object.entries(cfg.markets).filter(([, m]) => m.visuals === 'sa').map(([k]) => k);
if (saMarkets.length && fs.existsSync(path.join(root, 'content/sa-visuals.json'))) {
  const msg = `cannabis-themed 'sa' visuals are enabled for: ${saMarkets.join(', ')} – requires counsel approval (global.cannabisImageryApproval)`;
  if (process.env.STRICT_LAUNCH === '1' && /TO BE COMPLETED/.test(cfg.global.cannabisImageryApproval ?? '[TO BE COMPLETED]')) err(msg); else warn(msg);
}
done();
