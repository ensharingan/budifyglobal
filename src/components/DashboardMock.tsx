/** Decorative, text-free dashboard illustration with floating cards (abstract shapes only – no product imagery). */
const BARS = [38, 52, 44, 66, 58, 74, 62, 86, 70, 92, 80, 98];
const QR = '1111111100000111011101011010111011101001011111100000011011110010101011101101110001011111110101101'.slice(0, 49).split('').map((c) => c === '1');

export default function DashboardMock({ label }: { label: string }) {
  return (
    <div role="img" aria-label={label} className="relative mx-auto w-full max-w-xl py-8 lg:py-12">
      <div aria-hidden="true" className="absolute -right-10 -top-6 hidden h-[110%] w-[110%] bg-gradient-to-br from-[#eafaf0] via-[#cff1da] to-[#dff5b8] blob-shape lg:block" />
      <div aria-hidden="true" className="relative overflow-hidden rounded-2xl border border-line bg-white shadow-2xl">
        <div className="flex items-center gap-2 border-b border-line bg-surface-alt px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]" /><span className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]" /><span className="h-2.5 w-2.5 rounded-full bg-[#34d399]" />
          <span className="ms-3 h-4 w-40 rounded-md border border-line bg-white" />
        </div>
        <div className="grid grid-cols-[48px_1fr]">
          <div className="flex flex-col items-center gap-4 bg-brand py-4">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-sm font-black text-brand">B</span>
            {[0, 1, 2, 3, 4].map((i) => <span key={i} className={`h-4 w-4 rounded ${i === 0 ? 'bg-white' : 'bg-white/40'}`} />)}
          </div>
          <div className="bg-brand-soft p-4">
            <div className="mb-3 flex items-center justify-between"><span className="h-3 w-24 rounded bg-ink/80" /><span className="h-5 w-14 rounded-md bg-brand" /></div>
            <div className="mb-3 grid grid-cols-3 gap-2.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-xl border border-line bg-white p-2.5">
                  <span className="block h-1.5 w-10 rounded bg-ink-muted/40" />
                  <span className="mt-2 block h-3.5 w-14 rounded bg-ink" />
                  <span className="mt-1.5 block h-1.5 w-8 rounded bg-brand/70" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-[1.5fr_1fr] gap-2.5">
              <div className="rounded-xl border border-line bg-white p-3">
                <span className="mb-2 block h-2 w-20 rounded bg-ink/70" />
                <div className="flex h-24 items-end gap-1.5">
                  {BARS.map((b, i) => <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-brand to-[#4ade80]" style={{ height: `${b}%`, opacity: i === BARS.length - 1 ? 1 : 0.55 + i * 0.03 }} />)}
                </div>
              </div>
              <div className="rounded-xl border border-line bg-white p-3">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b border-line py-1.5 last:border-b-0">
                    <span className="h-1.5 rounded bg-ink-muted/40" style={{ width: 28 + (i % 3) * 8 }} /><span className="h-2 w-6 rounded bg-ink/70" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* floating card: membership card with QR pattern */}
      <div aria-hidden="true" className="bud-float absolute -start-2 bottom-2 w-44 rounded-2xl border border-line bg-white p-3 shadow-xl sm:-start-8">
        <div className="flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-brand/15" /><span className="h-2.5 w-16 rounded bg-ink/80" /></div>
        <div className="mx-auto mt-3 grid h-16 w-16 grid-cols-7 gap-px rounded-md border border-line p-1">
          {QR.map((on, i) => <span key={i} className={on ? 'bg-ink' : 'bg-transparent'} />)}
        </div>
        <span className="mx-auto mt-2 block h-2 w-12 rounded bg-brand/70" />
      </div>
      {/* floating card: status pill */}
      <div aria-hidden="true" className="bud-float absolute -top-1 end-0 flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 shadow-xl [animation-delay:1.5s] sm:-end-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white"><span className="h-2 w-2 rounded-full bg-white" /></span>
        <span className="space-y-1"><span className="block h-2 w-14 rounded bg-ink/80" /><span className="block h-1.5 w-20 rounded bg-brand/60" /></span>
      </div>
    </div>
  );
}
