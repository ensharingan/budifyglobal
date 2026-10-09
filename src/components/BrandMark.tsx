/** Neutral wordmark (no product imagery). The leaf logo in /public/images is deliberately not used in the UI. */
export default function BrandMark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-bold tracking-tight ${className}`}>
      <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <rect width="64" height="64" rx="14" fill="rgb(21 128 61)" />
        <path d="M20 14h13c8 0 12 4 12 10 0 4-2 7-6 8 5 1 8 4 8 9 0 7-5 11-13 11H20V14zm9 16h4c3 0 5-1 5-4s-2-4-5-4h-4v8zm0 17h5c3 0 5-1 5-4s-2-4-5-4h-5v8z" fill="#fff" />
      </svg>
      <span className="text-xl">Budify</span>
    </span>
  );
}
