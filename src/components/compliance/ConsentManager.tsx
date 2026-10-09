'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { useCompliance } from './ComplianceProvider';
import { strictestConsent } from '@/lib/consent/modes';
import type { ConsentModel } from '@/lib/compliance/types';
import { browserPrivacySignals, newId, readConsent, writeConsent, type ConsentRecord } from '@/lib/consent/storage';
import AnalyticsLoader from './AnalyticsLoader';
import { LocaleLink } from '../LocaleLink';

export const OPEN_SETTINGS_EVENT = 'bud:open-cookie-settings';
export const AGE_OK_EVENT = 'bud:age-ok';

interface ConsentCtx {
  analytics: boolean;
  marketing: boolean;
  ready: boolean;
  mode: ConsentModel;
  gpcActive: boolean;
  save: (c: { analytics: boolean; marketing: boolean }, source?: ConsentRecord['source']) => void;
  openSettings: () => void;
}
const Ctx = createContext<ConsentCtx | null>(null);
export function useConsent() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useConsent outside ConsentManager');
  return v;
}

function logConsent(rec: ConsentRecord, locale: string, mode: ConsentModel, geo: string | null) {
  try {
    const body = JSON.stringify({ ...rec, locale, mode, geo });
    if (navigator.sendBeacon) navigator.sendBeacon('/api/consent', new Blob([body], { type: 'application/json' }));
    else void fetch('/api/consent', { method: 'POST', body, headers: { 'content-type': 'application/json' }, keepalive: true });
  } catch { /* logging must never break the UI */ }
}

export default function ConsentManager({ children }: { children?: ReactNode }) {
  const t = useTranslations('cookie');
  const c = useCompliance();

  const [geo, setGeo] = useState<string | null>(null);
  const [geoDone, setGeoDone] = useState(false);
  const [record, setRecord] = useState<ConsentRecord | null>(null);
  const [mounted, setMounted] = useState(false);
  const [ageOk, setAgeOk] = useState(false);
  const [panel, setPanel] = useState(false);
  const [draft, setDraft] = useState({ analytics: false, marketing: false });
  const [live, setLive] = useState('');
  const [signals, setSignals] = useState({ gpc: false, dnt: false });
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  // Effective mode = strictest of (page's market, visitor's IP country)
  const mode = useMemo<ConsentModel>(
    () => strictestConsent(c.consentModel, geoDone ? (geo ? c.consentByCountry[geo.toUpperCase()] ?? 'opt-in' : 'opt-in') : c.consentModel),
    [c.consentModel, c.consentByCountry, geo, geoDone]
  );
  const honorsSignals = c.honorGpc || (geoDone && !!geo && c.gpcCountries.includes(geo.toUpperCase()));
  const gpcActive = honorsSignals && (signals.gpc || signals.dnt);

  useEffect(() => {
    setMounted(true);
    setRecord(readConsent());
    setSignals(browserPrivacySignals());
    setAgeOk(document.documentElement.dataset.gate === 'ok');
    const onAge = () => setAgeOk(true);
    window.addEventListener(AGE_OK_EVENT, onAge);
    const ctrl = new AbortController();
    fetch('/api/geo', { signal: ctrl.signal, cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { country: null }))
      .then((j: { country: string | null }) => setGeo(j.country ?? null))
      .catch(() => undefined)
      .finally(() => setGeoDone(true));
    return () => { window.removeEventListener(AGE_OK_EVENT, onAge); ctrl.abort(); };
  }, []);

  const valid = record && record.v === c.consentVersion ? record : null;

  // GPC / DNT: record once as a denial (no banner needed for sale/share; analytics also off)
  useEffect(() => {
    if (!mounted || !geoDone || !gpcActive) return;
    if (valid && valid.source === 'gpc') return;
    const rec: ConsentRecord = { v: c.consentVersion, id: valid?.id ?? newId(), ts: new Date().toISOString(), analytics: false, marketing: false, source: 'gpc' };
    writeConsent(rec); setRecord(rec); logConsent(rec, c.locale, mode, geo);
  }, [mounted, geoDone, gpcActive, valid, c.consentVersion, c.locale, mode, geo]);

  // Effective permission
  const defaultAllowed = mode !== 'opt-in'; // opt-out / notice-only regions: analytics on until the visitor says no
  const analytics = !mounted || !geoDone ? false : gpcActive ? false : valid ? valid.analytics : defaultAllowed;
  const marketing = !mounted || !geoDone ? false : gpcActive ? false : valid ? valid.marketing : false;

  const save = useCallback(
    (choice: { analytics: boolean; marketing: boolean }, source: ConsentRecord['source'] = 'banner') => {
      const rec: ConsentRecord = { v: c.consentVersion, id: record?.id ?? newId(), ts: new Date().toISOString(), analytics: choice.analytics, marketing: choice.marketing, source };
      writeConsent(rec); setRecord(rec); setPanel(false);
      logConsent(rec, c.locale, mode, geo);
      setLive(t('saved'));
      if (!choice.analytics) clearAnalyticsCookies();
      openerRef.current?.focus?.();
    },
    [c.consentVersion, c.locale, mode, geo, record?.id, t]
  );

  const openSettings = useCallback(() => {
    openerRef.current = document.activeElement as HTMLElement | null;
    setDraft({ analytics, marketing });
    setPanel(true);
  }, [analytics, marketing]);

  useEffect(() => {
    const h = () => openSettings();
    window.addEventListener(OPEN_SETTINGS_EVENT, h);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, h);
  }, [openSettings]);

  // Banner shows after the operator gate has been passed and until a valid decision exists
  const showBanner = mounted && geoDone && ageOk && !valid && !panel && !gpcActive;

  // Modal behaviour for the preferences panel: focus trap + Esc
  useEffect(() => {
    if (!panel) return;
    const el = dialogRef.current;
    el?.querySelector<HTMLElement>('input:not([disabled]),button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setPanel(false); openerRef.current?.focus?.(); }
      if (e.key !== 'Tab' || !el) return;
      const f = el.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled])');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [panel]);

  const ctx = useMemo<ConsentCtx>(
    () => ({ analytics, marketing, ready: mounted && geoDone, mode, gpcActive, save, openSettings }),
    [analytics, marketing, mounted, geoDone, mode, gpcActive, save, openSettings]
  );

  const bodyKey = mode === 'opt-in' ? 'body' : mode === 'opt-out' ? 'bodyOptOut' : 'bodyNotice';
  // Equal prominence: Accept / Reject / Customize share one style and size.
  const btn = 'inline-flex min-h-[44px] min-w-[44px] flex-1 items-center justify-center rounded-md border-2 border-brand-dark bg-white px-4 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-soft sm:flex-none';

  return (
    <Ctx.Provider value={ctx}>
      {children}
      <AnalyticsLoader allowed={analytics} />
      <div role="status" aria-live="polite" className="sr-only">{live}</div>

      {showBanner && (
        <section role="dialog" aria-modal="false" aria-labelledby="cookie-title" aria-describedby="cookie-body"
          className="fixed inset-x-0 bottom-0 z-[60] border-t border-line bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,.12)]">
          <div className="mx-auto flex max-w-page flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <h2 id="cookie-title" className="text-base font-semibold">{t('title')}</h2>
              <p id="cookie-body" className="mt-1 text-sm text-ink-muted">
                {t(bodyKey)}{' '}
                <LocaleLink href="/legal/cookies" className="underline">{t('readPolicy')}</LocaleLink>
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3 lg:flex-nowrap">
              <button type="button" className={btn} onClick={() => save({ analytics: true, marketing: true })}>{t('acceptAll')}</button>
              <button type="button" className={btn} onClick={() => save({ analytics: false, marketing: false })}>{t('rejectAll')}</button>
              <button type="button" className={btn} onClick={openSettings}>{t('customize')}</button>
            </div>
          </div>
        </section>
      )}

      {panel && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="cookie-panel-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-xl bg-white p-6 shadow-xl sm:rounded-xl">
            <div className="flex items-start justify-between gap-4">
              <h2 id="cookie-panel-title" className="text-lg font-semibold">{t('settings')}</h2>
              <button type="button" className="min-h-[44px] min-w-[44px] rounded-md text-2xl leading-none" aria-label={t('close')}
                onClick={() => { setPanel(false); openerRef.current?.focus?.(); }}>×</button>
            </div>
            <p className="mt-2 text-sm text-ink-muted">{t('withdraw')}</p>
            {gpcActive && <p className="mt-3 rounded-md bg-warn-soft p-3 text-sm text-warn">{t('gpc')}</p>}
            <ul className="mt-4 space-y-4">
              <li className="rounded-lg border border-line p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold">{t('necessary.title')}</h3>
                  <span className="text-sm font-medium text-brand-dark">{t('alwaysOn')}</span>
                </div>
                <p className="mt-1 text-sm text-ink-muted">{t('necessary.desc')}</p>
              </li>
              {(['analytics', 'marketing'] as const).map((k) => (
                <li key={k} className="rounded-lg border border-line p-4">
                  <label className="flex cursor-pointer items-center justify-between gap-3">
                    <span className="font-semibold">{t(`${k}.title`)}</span>
                    <input type="checkbox" role="switch" className="h-6 w-11 cursor-pointer accent-[rgb(21,128,61)]" checked={gpcActive ? false : draft[k]} disabled={gpcActive}
                      onChange={(e) => setDraft((d) => ({ ...d, [k]: e.target.checked }))} aria-describedby={`cookie-${k}-desc`} />
                  </label>
                  <p id={`cookie-${k}-desc`} className="mt-1 text-sm text-ink-muted">{t(`${k}.desc`)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className={btn} onClick={() => save({ analytics: true, marketing: true }, 'settings')}>{t('acceptAll')}</button>
              <button type="button" className={btn} onClick={() => save({ analytics: false, marketing: false }, 'settings')}>{t('rejectAll')}</button>
              <button type="button" className={btn} onClick={() => save(draft, 'settings')}>{t('save')}</button>
            </div>
            <p className="mt-4 text-xs text-ink-muted">
              <LocaleLink href="/legal/cookies" className="underline">{t('readPolicy')}</LocaleLink>
            </p>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

function clearAnalyticsCookies() {
  try {
    document.cookie.split('; ').forEach((c) => {
      const name = c.split('=')[0];
      if (/^_ga|^_gid|^_gat|^_gcl/.test(name)) {
        const hosts = [location.hostname, '.' + location.hostname.split('.').slice(-2).join('.')];
        document.cookie = `${name}=; Path=/; Max-Age=0`;
        hosts.forEach((h) => (document.cookie = `${name}=; Path=/; Domain=${h}; Max-Age=0`));
      }
    });
  } catch { /* ignore */ }
}
