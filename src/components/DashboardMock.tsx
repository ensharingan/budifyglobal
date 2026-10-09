/** Decorative, text-free dashboard illustration (abstract shapes only – no product imagery). */
export default function DashboardMock({ label }: { label: string }) {
  const bars = [40, 62, 48, 80, 66, 92, 74];
  return (
    <svg role="img" aria-label={label} viewBox="0 0 560 380" className="h-auto w-full rounded-2xl border border-line bg-white shadow-xl">
      <rect x="0" y="0" width="560" height="44" fill="rgb(20 83 45)" rx="16" />
      <rect x="0" y="28" width="560" height="16" fill="rgb(20 83 45)" />
      {[0, 1, 2].map((i) => <circle key={i} cx={24 + i * 18} cy="22" r="5" fill="#fff" opacity=".7" />)}
      <rect x="24" y="68" width="150" height="76" rx="10" fill="rgb(240 253 244)" stroke="rgb(187 247 208)" />
      <rect x="40" y="86" width="60" height="8" rx="4" fill="rgb(21 128 61)" opacity=".5" />
      <rect x="40" y="108" width="96" height="16" rx="5" fill="rgb(20 83 45)" />
      <rect x="192" y="68" width="150" height="76" rx="10" fill="rgb(248 250 252)" stroke="rgb(226 232 240)" />
      <rect x="208" y="86" width="60" height="8" rx="4" fill="rgb(100 116 139)" opacity=".5" />
      <rect x="208" y="108" width="80" height="16" rx="5" fill="rgb(15 23 42)" />
      <rect x="360" y="68" width="176" height="76" rx="10" fill="rgb(248 250 252)" stroke="rgb(226 232 240)" />
      <rect x="376" y="86" width="60" height="8" rx="4" fill="rgb(100 116 139)" opacity=".5" />
      <rect x="376" y="108" width="110" height="16" rx="5" fill="rgb(15 23 42)" />
      <rect x="24" y="164" width="318" height="192" rx="10" fill="#fff" stroke="rgb(226 232 240)" />
      {bars.map((h, i) => <rect key={i} x={48 + i * 42} y={336 - h * 1.5} width="26" height={h * 1.5} rx="5" fill="rgb(21 128 61)" opacity={0.45 + i * 0.08} />)}
      <rect x="360" y="164" width="176" height="192" rx="10" fill="#fff" stroke="rgb(226 232 240)" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <circle cx="384" cy={192 + i * 32} r="9" fill="rgb(187 247 208)" />
          <rect x="402" y={184 + i * 32} width={90 - (i % 3) * 14} height="8" rx="4" fill="rgb(15 23 42)" opacity=".75" />
          <rect x="402" y={198 + i * 32} width={60 - (i % 2) * 12} height="6" rx="3" fill="rgb(100 116 139)" opacity=".4" />
        </g>
      ))}
    </svg>
  );
}
