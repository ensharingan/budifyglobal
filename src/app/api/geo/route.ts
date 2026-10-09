import { NextResponse } from 'next/server';
export const runtime = 'edge';

/** Returns the visitor's IP-derived country (ISO-3166 alpha-2) from the platform header. Nothing is stored. */
export async function GET(req: Request) {
  const raw = req.headers.get('x-vercel-ip-country') ?? req.headers.get('cf-ipcountry');
  const country = raw && /^[A-Za-z]{2}$/.test(raw) ? raw.toUpperCase() : null;
  return NextResponse.json({ country }, { headers: { 'Cache-Control': 'no-store' } });
}
