import Link from 'next/link';
import { useLocale } from 'next-intl';
import type { ComponentProps } from 'react';
import { localizedPath } from '@/i18n/paths';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string };

/** Link that takes an INTERNAL path ("/legal/privacy#x") and renders the localized, locale-prefixed URL. */
export function LocaleLink({ href, ...rest }: Props) {
  const locale = useLocale();
  return <Link href={localizedPath(locale, href)} {...rest} />;
}
