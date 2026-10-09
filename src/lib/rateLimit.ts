// Minimal in-memory sliding-window limiter. Good enough per serverless instance as a first line of defence;
// for production-grade limits back it with Vercel KV / Upstash (see README → Security hardening).
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - recent[0])) / 1000) };
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  return { ok: true, retryAfter: 0 };
}

export function clientKey(req: Request): string {
  const xf = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return xf || req.headers.get('x-real-ip') || 'unknown';
}
