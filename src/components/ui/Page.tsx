import type { ReactNode } from 'react';

/** Renders the last word of a heading in the brand colour (skipped for single-word / unspaced scripts). */
export function Accent({ text }: { text: string }) {
  const i = text.lastIndexOf(' ');
  if (i < 1 || text.split(' ').length < 3) return <>{text}</>;
  return <>{text.slice(0, i + 1)}<span className="text-brand">{text.slice(i + 1)}</span></>;
}

export function Pill({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center rounded-full border border-brand/20 bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-dark">{children}</span>;
}

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-page px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function PageHeader({ title, intro, eyebrow, children }: { title: string; intro?: string; eyebrow?: string; children?: ReactNode }) {
  return (
    <div className="border-b border-line bg-gradient-to-b from-brand-soft to-white">
      <Container className="py-14 sm:py-20">
        {eyebrow && <Pill>{eyebrow}</Pill>}
        <h1 className="mt-4 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight [overflow-wrap:anywhere] sm:text-5xl lg:text-6xl"><Accent text={title} /></h1>
        {intro && <p className="mt-5 max-w-3xl text-lg text-ink-muted sm:text-xl">{intro}</p>}
        {children}
      </Container>
    </div>
  );
}

export function Section({ title, intro, children, id }: { title?: string; intro?: string; children: ReactNode; id?: string }) {
  return (
    <section id={id} className="py-14 sm:py-20">
      <Container>
        {title && <h2 className="text-3xl font-extrabold leading-tight tracking-tight [overflow-wrap:anywhere] sm:text-4xl"><Accent text={title} /></h2>}
        {intro && <p className="mt-3 max-w-3xl text-ink-muted">{intro}</p>}
        <div className={title ? 'mt-8' : ''}>{children}</div>
      </Container>
    </section>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-brand/10 bg-white p-6 transition-colors hover:border-brand/30 ${className}`}>{children}</div>;
}

export const btnPrimary = 'inline-flex min-h-[48px] items-center justify-center rounded-lg bg-brand px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-dark';
export const btnSecondary = 'inline-flex min-h-[48px] items-center justify-center rounded-lg border-2 border-brand bg-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-brand-dark transition-colors hover:bg-brand hover:text-white';

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
