/* eslint-disable @next/next/no-img-element */
/** Budify logo mark + wordmark. */
export default function BrandMark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-bold tracking-tight ${className}`}>
      <img src="/brand/budify-logo.png" width={36} height={36} alt="" aria-hidden="true" className="h-9 w-9 rounded-full" />
      <span className="text-xl">Budify</span>
    </span>
  );
}
