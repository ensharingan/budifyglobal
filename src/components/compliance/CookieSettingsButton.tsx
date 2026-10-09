'use client';
import { useTranslations } from 'next-intl';
import { OPEN_SETTINGS_EVENT } from './ConsentManager';

export default function CookieSettingsButton({ className }: { className?: string }) {
  const t = useTranslations('cookie');
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))}>
      {t('settings')}
    </button>
  );
}
