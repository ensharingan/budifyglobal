import { getTranslations } from 'next-intl/server';
import { LocaleLink } from '@/components/LocaleLink';
import { Container, btnPrimary, btnSecondary } from '@/components/ui/Page';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  return (
    <Container className="py-24 text-center">
      <p className="text-sm font-semibold text-brand-dark">404</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{t('title')}</h1>
      <p className="mt-3 text-ink-muted">{t('body')}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <LocaleLink href="/" className={btnPrimary}>{t('home')}</LocaleLink>
        <LocaleLink href="/regions" className={btnSecondary}>{t('regions')}</LocaleLink>
      </div>
    </Container>
  );
}
