/**
 * Bot protection that never bypasses or defeats a CAPTCHA:
 *  1. honeypot field (hidden from people, tempting to bots)
 *  2. minimum fill time (forms submitted < 3 s after render are rejected)
 *  3. optional Cloudflare Turnstile (privacy-friendly challenge) when keys are configured
 */
export async function checkBot(input: { hp?: unknown; renderedAt?: unknown; token?: unknown; ip?: string }): Promise<'ok' | 'bot'> {
  if (typeof input.hp === 'string' && input.hp.trim() !== '') return 'bot';
  const t = Number(input.renderedAt);
  if (!Number.isFinite(t) || Date.now() - t < 3000 || Date.now() - t > 6 * 3600_000) return 'bot';
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (secret) {
    if (typeof input.token !== 'string' || !input.token) return 'bot';
    try {
      const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret, response: input.token, ...(input.ip ? { remoteip: input.ip } : {}) }),
        signal: AbortSignal.timeout(6000)
      });
      const j = (await res.json()) as { success?: boolean };
      if (!j.success) return 'bot';
    } catch { return 'bot'; }
  }
  return 'ok';
}

export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return false;
  try {
    const o = new URL(origin).host;
    const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host');
    return o === host;
  } catch { return false; }
}
