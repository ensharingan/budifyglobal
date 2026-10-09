import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import '@fontsource-variable/inter/wght.css';
import '@fontsource/noto-sans-thai/400.css';
import '@fontsource/noto-sans-thai/600.css';
import '@fontsource/noto-sans-thai/700.css';
import '../globals.css';
import { LOCALES, countryOf, dirOf, isLocale, marketOf, minAgeOf } from '@/i18n/locales';
import { clientConsentMaps, complianceConfig } from '@/lib/compliance';
import { ComplianceProvider } from '@/components/compliance/ComplianceProvider';
import ConsentManager from '@/components/compliance/ConsentManager';
import AgeGate from '@/components/compliance/AgeGate';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { SITE_URL } from '@/lib/site';
import { pickMessages } from '@/lib/pick';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: 'Budify',
    icons: { icon: '/icon.svg' },
    formatDetection: { telephone: false, email: false, address: false },
    other: { 'content-language': locale }
  };
}

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#15803d' };

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const messages = (await getMessages()) as Record<string, unknown>;
  const t = await getTranslations('common');
  const market = marketOf(locale);
  const country = countryOf(locale);
  const minAge = minAgeOf(locale);

  const clientCompliance = {
    locale, country, minAge,
    consentModel: market.consentModel,
    honorGpc: market.honorGpc,
    consentVersion: complianceConfig.consentVersion,
    positioning: market.positioning,
    solutions: market.solutions,
    requiredLinks: market.requiredLinks,
    forms: market.forms,
    currency: market.currency,
    ...clientConsentMaps()
  };

  return (
    <html lang={locale} dir={dirOf(locale)} data-min-age={minAge} suppressHydrationWarning>
      <head>
        {/* synchronous on purpose: prevents the operator gate flashing for returning visitors */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/gate-init.js" />
      </head>
      <body>
        <NextIntlClientProvider
          locale={locale}
          messages={pickMessages(messages, ['cookie', 'ageGate', 'selector', 'nav', 'contact', 'pricing', 'common', 'legal.privacyChoices'])}
          timeZone="UTC"
        >
          <ComplianceProvider value={clientCompliance}>
            <ConsentManager>
              <a href="#main" className="skip-link">{t('skipToContent')}</a>
              <div id="site-root">
                <Header />
                <main id="main" tabIndex={-1}>{children}</main>
                <Footer />
              </div>
              <AgeGate />
            </ConsentManager>
          </ComplianceProvider>
        </NextIntlClientProvider>
        <JsonLd data={[
          { '@context': 'https://schema.org', '@type': 'Organization', name: 'Budify', url: SITE_URL, logo: `${SITE_URL}/icon.svg`, description: 'B2B software for regulated cannabis operators. Software only.' },
          { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Budify', url: SITE_URL, inLanguage: locale }
        ]} />
      </body>
    </html>
  );
}
