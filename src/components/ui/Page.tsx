import type { ReactNode } from 'react';

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-page px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function PageHeader({ title, intro, eyebrow, children }: { title: string; intro?: string; eyebrow?: string; children?: ReactNode }) {
  return (
    <div className="border-b border-line bg-gradient-to-b from-brand-soft to-white">
      <Container className="py-14 sm:py-20">
        {eyebrow && <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">{eyebrow}</p>}
        <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-3xl text-lg text-ink-muted">{intro}</p>}
        {children}
      </Container>
    </div>
  );
}

export function Section({ title, intro, children, id }: { title?: string; intro?: string; children: ReactNode; id?: string }) {
  return (
    <section id={id} className="py-12 sm:py-16">
      <Container>
        {title && <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>}
        {intro && <p className="mt-3 max-w-3xl text-ink-muted">{intro}</p>}
        <div className={title ? 'mt-8' : ''}>{children}</div>
      </Container>
    </section>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-line bg-white p-6 shadow-sm ${className}`}>{children}</div>;
}

export const btnPrimary = 'inline-flex min-h-[48px] items-center justify-center rounded-md bg-brand-dark px-6 py-3 font-semibold text-white hover:bg-brand';
export const btnSecondary = 'inline-flex min-h-[48px] items-center justify-center rounded-md border-2 border-brand-dark bg-white px-6 py-3 font-semibold text-brand-dark hover:bg-brand-soft';

export function Notice({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warn' }) {
  return <p role="note" className={`rounded-md p-4 text-sm font-medium ${tone === 'warn' ? 'bg-warn-soft text-warn' : 'bg-brand-soft text-brand-dark'}`}>{children}</p>;
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((b) => (
        <li key={b} className="flex gap-2 text-sm">
          <svg className="mt-0.5 h-5 w-5 shrink-0 text-brand" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0z" clipRule="evenodd" /></svg>
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}
