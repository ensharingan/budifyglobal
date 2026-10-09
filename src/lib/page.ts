import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { isLocale } from '@/i18n/locales';
import { buildMetadata } from './seo';

/** Validates the locale param and enables static rendering for it. Call first in every page. */
export async function initLocale(params: Promise<{ locale: string }>): Promise<string> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  return locale;
}

export async function pageMeta(params: Promise<{ locale: string }>, metaKey: string, internalPath: string): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return buildMetadata({
    locale, internalPath,
    title: t(`${metaKey}.title`), description: t(`${metaKey}.description`), siteName: t('siteName'),
    titleTemplate: metaKey === 'home' ? undefined : t('titleTemplate')
  });
}
