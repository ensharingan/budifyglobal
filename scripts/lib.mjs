import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const rel = (p) => path.relative(root, p);
export const readJson = (f) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
export const compliance = () => readJson('compliance.config.json');

export function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (Array.isArray(v)) v.forEach((x, i) => (x && typeof x === 'object' ? flatten(x, `${key}[${i}]`, out) : (out[`${key}[${i}]`] = x)));
    else if (v && typeof v === 'object') flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

export function walk(dir, exts, skip = []) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (skip.some((s) => p.includes(s))) continue;
    if (e.isDirectory()) out.push(...walk(p, exts, skip));
    else if (!exts || exts.some((x) => e.name.endsWith(x))) out.push(p);
  }
  return out;
}

export function reporter(name) {
  const errors = [], warns = [];
  return {
    err: (m) => errors.push(m),
    warn: (m) => warns.push(m),
    done() {
      for (const w of warns) console.warn('⚠ ' + w);
      if (errors.length) {
        console.error(`\n${name} FAILED (${errors.length} problem${errors.length === 1 ? '' : 's'}):`);
        for (const e of errors.slice(0, 100)) console.error(' ✖ ' + e);
        if (errors.length > 100) console.error(` … and ${errors.length - 100} more`);
        process.exit(1);
      }
      console.log(`${name} passed${warns.length ? ` (${warns.length} warning${warns.length === 1 ? '' : 's'})` : ''}.`);
    }
  };
}
