import fs from 'node:fs';
import path from 'node:path';
import visuals from '@root/content/sa-visuals.json';

/** Returns a self-hosted copy in /public/sa (created by `npm run fetch-images`), or null so the UI shows its built-in illustration. Never hotlinks. */
export function saImage(id: string, _remote?: string): string | null {
  for (const ext of ['jpg', 'png', 'webp']) {
    if (fs.existsSync(path.join(process.cwd(), 'public', 'sa', `${id}.${ext}`))) return `/sa/${id}.${ext}`;
  }
  return null;
}
export const SA = visuals as { features: Record<string, string>; about: string; mobile: string[] };
