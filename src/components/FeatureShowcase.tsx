'use client';
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

export interface ShowcaseItem { key: string; title: string; body: string; bullets: string[] }

const Row = ({ w = 'w-24', accent = false }: { w?: string; accent?: boolean }) => (
  <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
    <span className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${accent ? 'bg-amber-300' : 'bg-emerald-400'}`} /><span className={`h-2 rounded bg-white/70 ${w}`} /></span>
    <span className={`h-2 w-10 rounded ${accent ? 'bg-amber-300/80' : 'bg-emerald-400/80'}`} />
  </div>
);

/** Abstract, text-free UI illustrations (no product imagery). */
export function Mock({ k }: { k: string }): ReactNode {
  if (k === 'pos') return (<div className="space-y-2.5"><Row w="w-28" /><Row w="w-20" /><Row w="w-32" /><div className="flex items-center justify-between pt-3"><span className="h-3 w-16 rounded bg-white/60" /><span className="h-8 w-28 rounded-lg bg-emerald-400" /></div></div>);
  if (k === 'membership') return (<div className="grid grid-cols-[auto_1fr] items-center gap-5"><div className="grid h-24 w-24 grid-cols-7 gap-px rounded-lg bg-white p-1.5">{'1111111100000111011101011010111011101001011111100000011011110010101011101101110001011111110101101'.slice(0, 49).split('').map((c, i) => <span key={i} className={c === '1' ? 'bg-[#0b1f14]' : ''} />)}</div><div className="space-y-2"><span className="block h-3.5 w-32 rounded bg-white/80" /><span className="block h-2 w-24 rounded bg-white/40" /><span className="inline-block h-6 w-16 rounded-full bg-emerald-400/90" /></div></div>);
  if (k === 'inventory') return (<div className="space-y-2.5"><Row w="w-24" /><Row w="w-32" accent /><Row w="w-20" /><div className="flex h-16 items-end gap-1.5 pt-2">{[40, 64, 48, 80, 56, 72, 90].map((h, i) => <span key={i} className="flex-1 rounded-t bg-emerald-400/70" style={{ height: `${h}%` }} />)}</div></div>);
  if (k === 'compliance') return (<div className="space-y-2.5"><Row w="w-28" /><Row w="w-24" /><Row w="w-32" accent /><Row w="w-20" /></div>);
  return (<div className="space-y-3"><div className="space-y-2"><div className="flex justify-between"><span className="h-2 w-28 rounded bg-white/60" /><span className="h-2 w-16 rounded bg-white/60" /></div><div className="flex justify-between"><span className="h-2 w-24 rounded bg-white/40" /><span className="h-2 w-12 rounded bg-white/40" /></div></div><div className="flex items-end justify-between border-t border-white/15 pt-3"><span className="h-3.5 w-24 rounded bg-emerald-400" /><span className="h-5 w-20 rounded bg-emerald-400" /></div></div>);
}

export default function FeatureShowcase({ items }: { items: ShowcaseItem[] }) {
  const [i, setI] = useState(0);
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent) => {
    const d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + items.length) % items.length;
    setI(n); refs.current[n]?.focus();
  };
  const cur = items[i];
  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div role="tablist" aria-orientation="vertical" onKeyDown={onKey} className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
        {items.map((it, n) => (
          <button key={it.key} ref={(el) => { refs.current[n] = el; }} role="tab" id={`${id}-t${n}`} aria-selected={n === i} aria-controls={`${id}-p`} tabIndex={n === i ? 0 : -1} onClick={() => setI(n)}
            className={`min-h-[56px] shrink-0 rounded-xl border px-4 py-3 text-start text-sm font-bold transition-colors ${n === i ? 'border-brand/40 bg-brand/10 text-brand-dark' : 'border-brand/10 bg-white text-ink hover:border-brand/30'}`}>
            {it.title}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${id}-p`} aria-labelledby={`${id}-t${i}`} className="overflow-hidden rounded-2xl border border-brand/10 bg-white">
        <div aria-hidden="true" className="on-dark bg-gradient-to-br from-[#07120b] via-[#0b1f14] to-[#14532d] p-6 sm:p-8">
          <div className="mx-auto max-w-md rounded-2xl border border-white/15 bg-black/30 p-5"><Mock k={cur.key} /></div>
        </div>
        <div className="p-6 sm:p-8">
          <h3 className="text-2xl font-extrabold tracking-tight">{cur.title}</h3>
          <p className="mt-3 text-ink-muted">{cur.body}</p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {cur.bullets.map((b) => (
              <li key={b} className="flex gap-2 text-sm"><svg className="mt-0.5 h-5 w-5 shrink-0 text-brand" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0z" clipRule="evenodd" /></svg><span>{b}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
