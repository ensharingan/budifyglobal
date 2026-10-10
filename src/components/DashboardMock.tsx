export interface MockText {
  label: string; glance: string; newSale: string; revenue: string; members: string; openTabs: string; salesWeek: string; recent: string;
  rows: [string, string][]; kpis: [string, string, string][]; memberCard: string; tier: string; active: string; posActive: string; terminals: string; sample: string;
}
const BARS = [38, 52, 44, 66, 58, 74, 62, 86, 70, 92, 80, 98];
const QR = '1111111100000111011101011010111011101001011111100000011011110010101011101101110001011111110101101'.slice(0, 49).split('').map((c) => c === '1');

/** Illustrative dashboard (sample figures, no product imagery) with floating cards, in the style of the Budify SA hero. */
export default function DashboardMock({ m }: { m: MockText }) {
  return (
    <div className="relative mx-auto w-full max-w-xl py-8 lg:py-12">
      <div aria-hidden="true" className="absolute -right-10 -top-6 hidden h-[110%] w-[110%] bg-gradient-to-br from-[#eafaf0] via-[#cff1da] to-[#dff5b8] blob-shape lg:block" />
      <figure role="group" aria-label={m.label} className="relative m-0">
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-2xl">
          <div className="flex items-center gap-2 border-b border-line bg-surface-alt px-4 py-3">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#f87171]" /><span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]" /><span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#34d399]" />
            <span className="ms-3 rounded-md border border-line bg-white px-3 py-0.5 text-[10px] text-ink-muted">app.budify.com / dashboard</span>
          </div>
          <div className="grid grid-cols-[48px_1fr]">
            <div aria-hidden="true" className="flex flex-col items-center gap-4 bg-brand py-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-sm font-black text-brand">B</span>
              {[0, 1, 2, 3, 4].map((i) => <span key={i} className={`h-4 w-4 rounded ${i === 0 ? 'bg-white' : 'bg-white/40'}`} />)}
            </div>
            <div className="bg-brand-soft p-4">
              <div className="mb-3 flex items-center justify-between gap-2"><span className="text-xs font-extrabold">{m.glance}</span><span className="rounded-md bg-brand px-2.5 py-1 text-[10px] font-bold text-white">{m.newSale}</span></div>
              <div className="mb-3 grid grid-cols-3 gap-2.5">
                {m.kpis.map(([l, v, d]) => (
                  <div key={l} className="rounded-xl border border-line bg-white p-2.5">
                    <div className="text-[9px] text-ink-muted">{l}</div><div className="text-sm font-extrabold leading-tight">{v}</div><div className="text-[9px] font-bold text-brand">{d}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-[1.5fr_1fr] gap-2.5">
                <div className="rounded-xl border border-line bg-white p-3">
                  <div className="mb-2 text-[10px] font-bold">{m.salesWeek}</div>
                  <div aria-hidden="true" className="flex h-24 items-end gap-1.5">{BARS.map((b, i) => <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-brand to-[#4ade80]" style={{ height: `${b}%`, opacity: i === BARS.length - 1 ? 1 : 0.55 + i * 0.03 }} />)}</div>
                </div>
                <div className="rounded-xl border border-line bg-white p-3">
                  <div className="mb-1 text-[10px] font-bold">{m.recent}</div>
                  {m.rows.map(([n, a], i) => <div key={i} className="flex items-center justify-between gap-2 border-b border-line py-1.5 text-[10px] last:border-b-0"><span className="text-ink-muted">{n}</span><span className="font-bold">{a}</span></div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bud-float absolute -start-2 bottom-4 w-40 rounded-2xl border border-line bg-white p-3 shadow-xl sm:-start-8">
          <div className="flex items-center gap-2"><span aria-hidden="true" className="h-6 w-6 rounded-full bg-brand/15" /><span><span className="block text-[11px] font-bold leading-tight">{m.memberCard}</span><span className="block text-[10px] text-ink-muted">{m.tier}</span></span></div>
          <div aria-hidden="true" className="mx-auto mt-3 grid h-16 w-16 grid-cols-7 gap-px rounded-md border border-line p-1">{QR.map((on, i) => <span key={i} className={on ? 'bg-ink' : ''} />)}</div>
          <span className="mt-2 block text-center text-[10px] font-bold text-brand">{m.active} ✓</span>
        </div>
        <div className="bud-float absolute -top-1 end-0 flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 shadow-xl [animation-delay:1.5s] sm:-end-4">
          <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-full bg-brand"><span className="h-2 w-2 rounded-full bg-white" /></span>
          <span><span className="block text-[11px] font-bold leading-tight">{m.posActive}</span><span className="block text-[10px] text-brand">{m.terminals}</span></span>
        </div>
        <figcaption className="mt-3 text-center text-[10px] text-ink-muted">{m.sample}</figcaption>
      </figure>
    </div>
  );
}
