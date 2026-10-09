'use client';
import { useEffect } from 'react';

declare global {
  interface Window { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void; plausible?: unknown }
}

const PLAUSIBLE = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const GA4 = process.env.NEXT_PUBLIC_GA4_ID;

/**
 * Loads analytics ONLY when `allowed` is true. Until then nothing is requested from any third party.
 * GA4 Consent Mode v2: the default state is "denied" for every storage type and is updated on decision;
 * the gtag.js file itself is not fetched until analytics consent exists.
 */
export default function AnalyticsLoader({ allowed }: { allowed: boolean }) {
  // Consent Mode default (denied) – defined without fetching any script
  useEffect(() => {
    if (!GA4) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag(...a: unknown[]) { (window.dataLayer as unknown[]).push(a); };
    window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500 });
  }, []);

  useEffect(() => {
    if (GA4) {
      window.gtag?.('consent', 'update', { analytics_storage: allowed ? 'granted' : 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    }
    if (!allowed) return;

    if (PLAUSIBLE && !document.getElementById('plausible-js')) {
      const s = document.createElement('script');
      s.id = 'plausible-js'; s.defer = true; s.dataset.domain = PLAUSIBLE; s.src = 'https://plausible.io/js/script.js';
      document.head.appendChild(s);
    }
    if (GA4 && !document.getElementById('ga4-js')) {
      const s = document.createElement('script');
      s.id = 'ga4-js'; s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4)}`;
      document.head.appendChild(s);
      window.gtag?.('js', new Date());
      window.gtag?.('config', GA4, { anonymize_ip: true, allow_google_signals: false, allow_ad_personalization_signals: false });
    }
  }, [allowed]);

  return null;
}
