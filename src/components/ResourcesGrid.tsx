'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';

export interface CardItem { slug: string; href: string; title: string; description: string; date: string; iso: string; read: string; category: string; keywords: string[]; cover: string | null }
interface Labels { all: string; search: string; more: string; none: string; shown: string }

export default function ResourcesGrid({ items, categories, labels }: { items: CardItem[]; categories: string[]; labels: Labels }) {
  const [cat, setCat] = useState('');
  const [q, setQ] = useState('');
  const [n, setN] = useState(12);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter((a) => (!cat || a.category === cat) && (!s || (a.title + ' ' + a.description + ' ' + a.keywords.join(' ')).toLowerCase().includes(s)));
  }, [items, cat, q]);
  const chip = (on: boolean) => `rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${on ? 'border-brand bg-brand text-white' : 'border-brand/20 bg-white text-ink hover:border-brand/50'}`;
  return (
    <div lang="en">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group">
          <button type="button" aria-pressed={!cat} onClick={() => { setCat(''); setN(12); }} className={chip(!cat)}>{labels.all}</button>
          {categories.map((c) => (<button key={c} type="button" aria-pressed={cat === c} onClick={() => { setCat(c); setN(12); }} className={chip(cat === c)}>{c}</button>))}
        </div>
        <input type="search" value={q} onChange={(e) => { setQ(e.target.value); setN(12); }} placeholder={labels.search} aria-label={labels.search} className="min-h-[44px] w-full rounded-lg border border-brand/20 bg-white px-4 text-sm lg:w-72" />
      </div>
      {list.length === 0 && <p className="py-12 text-center text-ink-muted">{labels.none}</p>}
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.slice(0, n).map((a) => (
          <li key={a.slug}>
            <Link href={a.href} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand/10 bg-white transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg">
              <div aria-hidden="true" className="relative h-40 overflow-hidden bg-gradient-to-br from-[#0b1f14] to-brand-dark">
                {a.cover
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={a.cover} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  : <span className="absolute inset-0 flex items-center justify-center text-5xl font-extrabold text-white/15">{a.category.slice(0, 1)}</span>}
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-brand-dark">{a.category}</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs text-ink-muted"><time dateTime={a.iso}>{a.date}</time> · {a.read}</p>
                <h2 className="mt-2 text-lg font-bold leading-snug group-hover:underline">{a.title}</h2>
                <p className="mt-2 flex-1 text-sm text-ink-muted">{a.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">{a.keywords.slice(0, 3).map((k) => (<span key={k} className="rounded-full bg-brand/5 px-2.5 py-0.5 text-[11px] text-brand-dark">{k}</span>))}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-10 text-center">
        <p className="text-sm text-ink-muted" aria-live="polite">{labels.shown.replace('{n}', String(Math.min(n, list.length))).replace('{total}', String(list.length))}</p>
        {n < list.length && <button type="button" onClick={() => setN(n + 12)} className="mt-4 inline-flex min-h-[48px] items-center rounded-lg border-2 border-brand px-8 text-sm font-bold uppercase tracking-wider text-brand-dark hover:bg-brand hover:text-white">{labels.more}</button>}
      </div>
    </div>
  );
}
