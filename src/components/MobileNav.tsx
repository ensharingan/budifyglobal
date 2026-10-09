'use client';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

export interface NavItem { href: string; label: string }

export default function MobileNav({ items, cta }: { items: NavItem[]; cta: NavItem }) {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);
  return (
    <div className="lg:hidden">
      <button ref={btn} type="button" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((o) => !o)}
        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-line px-3 text-sm font-medium">
        <span className="sr-only">{open ? t('closeMenu') : t('menu')}</span>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <nav id="mobile-nav" aria-label={t('primary')} className="absolute inset-x-0 top-full border-b border-line bg-white p-4 shadow-lg">
          <ul className="mx-auto flex max-w-page flex-col gap-1">
            {items.map((i) => (
              <li key={i.href}><a href={i.href} onClick={() => setOpen(false)} className="block min-h-[44px] rounded-md px-3 py-3 font-medium hover:bg-surface-alt">{i.label}</a></li>
            ))}
            <li><a href={cta.href} onClick={() => setOpen(false)} className="mt-2 block min-h-[44px] rounded-md bg-brand-dark px-3 py-3 text-center font-semibold text-white">{cta.label}</a></li>
          </ul>
        </nav>
      )}
    </div>
  );
}
