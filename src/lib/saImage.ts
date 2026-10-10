import fs from 'node:fs';
import path from 'node:path';
import visuals from '@root/content/sa-visuals.json';

/** Resolves a visual to a self-hosted copy in /public/sa (created by `npm run fetch-images`) or the remote URL as fallback. */
export function saImage(id: string, remote: string): string {
  for (const ext of ['jpg', 'png', 'webp']) {
    if (fs.existsSync(path.join(process.cwd(), 'public', 'sa', `${id}.${ext}`))) return `/sa/${id}.${ext}`;
  }
  return remote;
}
export const SA = visuals as { features: Record<string, string>; about: string; mobile: string[] };
