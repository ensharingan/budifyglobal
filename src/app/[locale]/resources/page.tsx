import { getTranslations } from 'next-intl/server';
import { initLocale, pageMeta } from '@/lib/page';
import { countryOf, marketOf } from '@/i18n/locales';
import { localizedPath } from '@/i18n/paths';
import { LocaleLink } from '@/components/LocaleLink';
import ResourcesGrid, { type CardItem } from '@/components/ResourcesGrid';
import { coverFor } from '@/lib/articleCover';
import { PageHeader, Container, Notice, btnPrimary } from '@/components/ui/Page';
import { articlesFor, CATEGORIES } from '@root/content/articles';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { return pageMeta(params, 'resources', '/resources'); }

export default async function Resources({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await initLocale(params);
  const t = await getTranslations('resources');
  const c = await getTranslations();
  const sa = marketOf(locale).visuals === 'sa';
  const fmt = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' });
  const list = articlesFor(countryOf(locale));
  const items: CardItem[] = list.map((a) => ({
    slug: a.slug, href: localizedPath(locale, `/resources/${a.slug}`), title: a.title, description: a.description,
    date: fmt.format(new Date(a.published)), iso: a.published, read: t('readTime', { minutes: a.minutes }),
    category: a.category ?? 'Guides', keywords: a.keywords ?? [], cover: coverFor(a.category, sa)
  }));
  const cats = CATEGORIES.filter((k) => items.some((i) => i.category === k));
  const [feat, ...rest] = items;
  return (
    <>
      <PageHeader title={t('title')} intro={t('intro')} />
      <section className="py-12 sm:py-16"><Container>
        {locale.split('-')[0] !== 'en' && <div className="mb-6"><Notice>{t('englishOnly')}</Notice></div>}
        {feat && (
          <a href={feat.href} lang="en" className="group mb-12 grid overflow-hidden rounded-2xl border border-brand/15 bg-white shadow-sm transition-shadow hover:shadow-xl lg:grid-cols-2">
            <div aria-hidden="true" className="relative min-h-[16rem] bg-gradient-to-br from-[#0b1f14] to-brand-dark">
              {feat.cover
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={feat.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
                : <span className="absolute inset-0 flex items-center justify-center text-8xl font-extrabold text-white/15">{feat.category.slice(0, 1)}</span>}
            </div>
            <div className="p-8 sm:p-10">
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand-dark">{feat.category}</span>
              <h2 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight group-hover:underline sm:text-4xl">{feat.title}</h2>
              <p className="mt-4 text-ink-muted">{feat.description}</p>
              <p className="mt-4 text-xs text-ink-muted">{feat.date} · {feat.read}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">{feat.keywords.slice(0, 4).map((k) => (<span key={k} className="rounded-full bg-brand/5 px-2.5 py-0.5 text-xs text-brand-dark">{k}</span>))}</div>
            </div>
          </a>
        )}
        <ResourcesGrid items={rest} categories={cats} labels={{ all: 'All topics', search: 'Search guides', more: 'Load more', none: 'No guides match your search.', shown: 'Showing {n} of {total} guides' }} />
      </Container></section>
      <section className="bg-brand-dark py-16 text-white sm:py-20"><Container className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{c('home.ctaTitle')}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-white/80">{c('home.ctaBody')}</p>
        <div className="mt-8"><LocaleLink href="/contact" className={`${btnPrimary} !bg-white !text-brand-dark hover:!bg-brand-soft`}>{c('common.bookDemo')}</LocaleLink></div>
      </Container></section>
    </>
  );
}
