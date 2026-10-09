'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useConsent } from './ConsentManager';

/** "Your Privacy Choices" panel for the Do-Not-Sell/Share link target. */
export default function PrivacyChoices() {
  const t = useTranslations('legal.privacyChoices');
  const tc = useTranslations('cookie');
  const { analytics, marketing, gpcActive, save } = useConsent();
  const [a, setA] = useState(analytics);
  const [m, setM] = useState(marketing);
  const [done, setDone] = useState(false);
  const btn = 'min-h-[44px] rounded-md border-2 border-brand-dark bg-white px-4 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-soft';
  return (
    <div className="mt-4 rounded-lg border border-line bg-surface-alt p-5">
      <h3 className="font-semibold">{t('title')}</h3>
      {gpcActive && <p className="mt-2 rounded-md bg-warn-soft p-3 text-sm text-warn">{tc('gpc')}</p>}
      <div className="mt-3 space-y-3">
        <label className="flex items-center gap-3 text-sm"><input type="checkbox" className="h-6 w-6 accent-[rgb(21,128,61)]" checked={gpcActive ? false : a} disabled={gpcActive} onChange={(e) => setA(e.target.checked)} />{t('analytics')}</label>
        <label className="flex items-center gap-3 text-sm"><input type="checkbox" className="h-6 w-6 accent-[rgb(21,128,61)]" checked={gpcActive ? false : m} disabled={gpcActive} onChange={(e) => setM(e.target.checked)} />{t('marketing')}</label>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" className={btn} onClick={() => { save({ analytics: a, marketing: m }, 'privacy-page'); setDone(true); }}>{t('save')}</button>
        <button type="button" className={btn} onClick={() => { setA(false); setM(false); save({ analytics: false, marketing: false }, 'privacy-page'); setDone(true); }}>{t('optOutAll')}</button>
      </div>
      <p role="status" className="mt-3 text-sm font-medium text-brand-dark">{done ? t('saved') : ''}</p>
    </div>
  );
}
