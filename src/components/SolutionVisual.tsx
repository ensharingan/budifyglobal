import { saImage } from '@/lib/saImage';
import { Mock } from '@/components/FeatureShowcase';

const MAP: Record<string, string> = { dispensaries: 'pos', clubs: 'membership', groups: 'insights', 'white-label': 'finance' };

/** Photo/panel for a solution. Uses self-hosted SA visuals when the market allows them, otherwise a text-free UI illustration. */
export default function SolutionVisual({ type, sa, className = '' }: { type: string; sa: boolean; className?: string }) {
  const id = MAP[type] ?? 'pos';
  const src = sa ? saImage(id) : null;
  return (
    <div aria-hidden="true" className={`relative overflow-hidden rounded-2xl border border-brand/15 bg-[#0b1f14] shadow-xl ${className}`}>
      {src
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
        : <div className="flex h-full min-h-[16rem] items-center justify-center p-10"><div className="w-full max-w-sm"><Mock k={id} /></div></div>}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-brand/20 via-transparent to-transparent" />
    </div>
  );
}
