import { getRequestConfig } from 'next-intl/server';
import { DEFAULT_LOCALE, isLocale } from './locales';
import { loadMessages } from './messages';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;
  return {
    locale,
    messages: loadMessages(locale) as Record<string, never>,
    timeZone: 'UTC',
    onError(error) {
      if (process.env.NODE_ENV !== 'production') console.warn('[i18n]', error.message);
    },
    getMessageFallback({ namespace, key }) {
      return `${namespace ? namespace + '.' : ''}${key}`;
    }
  };
});
