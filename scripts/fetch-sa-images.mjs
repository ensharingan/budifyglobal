#!/usr/bin/env node
// Downloads the photographic 'sa' visuals (content/sa-visuals.json) into public/sa/ so they are self-hosted
// (no third-party requests before consent). Run on a machine with normal internet access: npm run fetch-images
import fs from 'node:fs';
import path from 'node:path';
import { readJson, root } from './lib.mjs';

const v = readJson('content/sa-visuals.json');
const jobs = [
  ...Object.entries(v.features),
  ['about', v.about],
  ['mobile-1', v.mobile[0]],
  ['mobile-2', v.mobile[1]]
];
const out = path.join(root, 'public', 'sa');
fs.mkdirSync(out, { recursive: true });
let ok = 0;
for (const [id, url] of jobs) {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const type = res.headers.get('content-type') || '';
    const ext = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : 'jpg';
    fs.writeFileSync(path.join(out, `${id}.${ext}`), Buffer.from(await res.arrayBuffer()));
    console.log('saved', id + '.' + ext); ok++;
  } catch (e) { console.error('FAILED', id, String(e)); }
}
console.log(`${ok}/${jobs.length} images saved to public/sa/ – commit them, then redeploy.`);
