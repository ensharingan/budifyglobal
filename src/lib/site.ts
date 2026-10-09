export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.budify.com').replace(/\/$/, '');
export const STATUS_URL = process.env.NEXT_PUBLIC_STATUS_URL || '';
export const abs = (path: string) => `${SITE_URL}${path}`;
