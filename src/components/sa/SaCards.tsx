'use client';
import { useState } from 'react';

/** Tap-to-flip digital membership card (front: member details, back: QR check-in). Illustrative sample card – no real member data. */
export default function SaCards({ front, back, altFront, altBack, hint }: { front: string; back: string; altFront: string; altBack: string; hint: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="mx-auto w-full max-w-xl">
      <button type="button" onClick={() => setFlipped((f) => !f)} aria-pressed={flipped} className="group block w-full [perspective:1400px] focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/40 rounded-3xl">
        <span className="relative block aspect-[1200/754] w-full transition-transform duration-700 [transform-style:preserve-3d] motion-reduce:transition-none" style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={front} alt={altFront} loading="lazy" className="absolute inset-0 h-full w-full rounded-3xl shadow-2xl [backface-visibility:hidden]" style={{ filter: 'drop-shadow(0 20px 40px rgba(21,128,61,.35))' }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={back} alt={altBack} loading="lazy" className="absolute inset-0 h-full w-full rounded-3xl shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]" style={{ filter: 'drop-shadow(0 20px 40px rgba(21,128,61,.35))' }} />
        </span>
      </button>
      <p className="mt-5 text-center text-sm font-semibold text-brand-dark">{hint}</p>
    </div>
  );
}
