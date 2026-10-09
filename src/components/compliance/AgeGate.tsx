'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCompliance } from './ComplianceProvider';
import { AGE_COOKIE, getCookie, setCookie } from '@/lib/consent/storage';
import { AGE_OK_EVENT } from './ConsentManager';
import BrandMark from '../BrandMark';

/**
 * Operator / age confirmation. Self-declaration gate (no ID check).
 * - Content stays in the DOM (crawlers and assistive tech can still reach it once the gate is passed);
 *   while open, #site-root is `inert` so keyboard and screen-reader users cannot reach content behind it.
 * - The choice is stored in a first-party, strictly-necessary cookie only AFTER the visitor presses "Enter site".
 */
export default function AgeGate() {
  const t = useTranslations('ageGate');
  const { minAge } = useCompliance();
  const [open, setOpen] = useState(true);
  const [checked, setChecked] = useState(false);
  const [showErr, setShowErr] = useState(false);
  const [denied, setDenied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const pass = useCallback(() => {
    document.documentElement.dataset.gate = 'ok';
    setOpen(false);
    window.dispatchEvent(new Event(AGE_OK_EVENT));
  }, []);

  useEffect(() => {
    const v = getCookie(AGE_COOKIE);
    if (v && Number(v.split(':')[0]) >= minAge) pass();
    else document.documentElement.dataset.gate = '';
  }, [minAge, pass]);

  useEffect(() => {
    const root = document.getElementById('site-root');
    if (root) (root as HTMLElement & { inert: boolean }).inert = open;
    if (open) ref.current?.querySelector<HTMLElement>('input,button')?.focus();
    else document.getElementById('main')?.focus({ preventScroll: true });
  }, [open, denied]);

  useEffect(() => {
    if (!open) return;
    const el = ref.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !el) return;
      const f = el.querySelectorAll<HTMLElement>('input,button');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, denied]);

  if (!open) return null;

  const enter = () => {
    if (!checked) { setShowErr(true); return; }
    setCookie(AGE_COOKIE, `${minAge}:${Date.now()}`, { days: 30 });
    pass();
  };

  return (
    <div data-age-gate className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/90 p-4">
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="age-title" aria-describedby="age-body"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <BrandMark className="text-ink" />
        {!denied ? (
          <>
            <h2 id="age-title" className="mt-5 text-xl font-bold">{t('title')}</h2>
            <p id="age-body" className="mt-2 text-sm text-ink-muted">{t('body')}</p>
            <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm">
              <input type="checkbox" className="mt-0.5 h-6 w-6 shrink-0 accent-[rgb(21,128,61)]" checked={checked}
                aria-invalid={showErr && !checked} aria-describedby={showErr && !checked ? 'age-err' : undefined}
                onChange={(e) => { setChecked(e.target.checked); setShowErr(false); }} />
              <span>{t('checkbox', { age: minAge })}</span>
            </label>
            {showErr && !checked && <p id="age-err" role="alert" className="mt-2 text-sm font-medium text-red-800">{t('mustConfirm')}</p>}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={enter} className="min-h-[44px] flex-1 rounded-md bg-brand-dark px-4 py-2 font-semibold text-white hover:bg-brand">{t('enter')}</button>
              <button type="button" onClick={() => setDenied(true)} className="min-h-[44px] flex-1 rounded-md border-2 border-ink-muted bg-white px-4 py-2 font-semibold text-ink hover:bg-surface-alt">{t('leave')}</button>
            </div>
            <p className="mt-4 text-xs text-ink-muted">{t('cookieNote')}</p>
          </>
        ) : (
          <>
            <h2 id="age-title" className="mt-5 text-xl font-bold">{t('leftTitle')}</h2>
            <p id="age-body" className="mt-2 text-sm text-ink-muted">{t('leftBody', { age: minAge })}</p>
            <button type="button" onClick={() => setDenied(false)} className="mt-6 min-h-[44px] rounded-md border-2 border-ink-muted bg-white px-4 py-2 font-semibold hover:bg-surface-alt">{t('reconsider')}</button>
          </>
        )}
      </div>
    </div>
  );
}
