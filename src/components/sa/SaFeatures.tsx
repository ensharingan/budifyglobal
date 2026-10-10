'use client';
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { Mock } from '../FeatureShowcase';
import Icon, { type IconName } from './Icon';

export interface SaFeature { key: string; icon: IconName; title: string; short: string; desc: string; bullets: string[]; image: string | null }

export default function SaFeatures({ items }: { items: SaFeature[] }) {
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
  const a = items[i];
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div role="tablist" aria-orientation="vertical" onKeyDown={onKey} className="flex flex-none gap-2 overflow-x-auto pb-1 lg:w-80 lg:flex-col lg:overflow-visible">
        {items.map((f, n) => (
          <button key={f.key} ref={(el) => { refs.current[n] = el; }} role="tab" id={`${id}-t${n}`} aria-selected={n === i} aria-controls={`${id}-p`} tabIndex={n === i ? 0 : -1} onClick={() => setI(n)}
            className={`group min-w-[15rem] shrink-0 rounded-xl border px-5 py-4 text-start transition-colors lg:min-w-0 ${n === i ? 'border-brand/40 bg-brand/10' : 'border-brand/10 bg-white hover:border-brand/30'}`}>
            <span className="flex items-center gap-3">
              <span className={`flex h-8 w-8 flex-none items-center justify-center rounded-lg ${n === i ? 'bg-brand/20 text-brand-dark' : 'bg-brand/5 text-ink-muted group-hover:bg-brand/10'}`}><Icon name={f.icon} className="h-4 w-4" /></span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-ink">{f.title}</span>
                <span className={`mt-0.5 block text-xs ${n === i ? 'text-brand-dark' : 'text-ink-muted'}`}>{f.short}</span>
              </span>
            </span>
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${id}-p`} aria-labelledby={`${id}-t${i}`} className="flex-1 overflow-hidden rounded-2xl border border-brand/10 bg-white">
        <div className="relative h-64 overflow-hidden bg-[#0b1f14] lg:h-72">
          {/* decorative: alt intentionally empty – the heading below names the feature */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {a.image
            ? <img key={a.key} src={a.image} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
            : <div className="flex h-full items-center justify-center p-8"><div className="w-full max-w-sm"><Mock k={a.key} /></div></div>}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
        </div>
        <div className="p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand-dark"><Icon name={a.icon} /></span>
            <h3 className="text-2xl font-extrabold tracking-tight">{a.title}</h3>
          </div>
          <p className="mb-6 text-ink-muted">{a.desc}</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {a.bullets.map((b) => (<li key={b} className="flex items-center gap-2 text-sm"><svg aria-hidden="true" className="h-4 w-4 flex-none text-brand" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0z" clipRule="evenodd" /></svg>{b}</li>))}
          </ul>
        </div>
      </div>
    </div>
  );
}
