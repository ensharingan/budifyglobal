import { getMarket } from '@/lib/compliance';

export type RecordKind = 'lead' | 'newsletter' | 'consent';

/** Region for a locale's country (compliance.config.json → markets.*.dataRegion). */
export function regionForCountry(country: string): string {
  return getMarket(country)?.dataRegion ?? 'eu';
}

/**
 * Persist a record in the visitor's data region by POSTing JSON to a region-specific webhook
 * (your CRM / database endpoint hosted in that region). Returns false when nothing is configured –
 * callers must then tell the visitor the submission failed, never pretend it was saved.
 */
export async function persist(kind: RecordKind, region: string, payload: Record<string, unknown>): Promise<boolean> {
  const key = `${kind === 'consent' ? 'CONSENT_LOG_WEBHOOK_URL' : 'LEAD_WEBHOOK_URL'}`;
  const url = kind === 'consent' ? process.env.CONSENT_LOG_WEBHOOK_URL : process.env[`${key}_${region.toUpperCase()}`] || process.env.LEAD_WEBHOOK_URL_DEFAULT;
  const body = JSON.stringify({ kind, region, receivedAt: new Date().toISOString(), ...payload });
  if (!url) {
    if (process.env.NODE_ENV !== 'production') { console.log(`[store:${kind}] (no webhook configured – dev only)`, body); return true; }
    if (kind === 'consent') { console.log(JSON.stringify({ type: 'consent-log', ...JSON.parse(body) })); return true; } // platform logs act as the default log sink
    console.error(`[store:${kind}] no webhook configured for region "${region}" – submission NOT stored`);
    return false;
  }
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body, signal: AbortSignal.timeout(8000) });
    if (!res.ok) { console.error(`[store:${kind}] webhook responded ${res.status}`); return false; }
    return true;
  } catch (e) {
    console.error(`[store:${kind}] webhook error`, e instanceof Error ? e.message : e);
    return false;
  }
}
