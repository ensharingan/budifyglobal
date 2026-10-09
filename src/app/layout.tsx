// Root layout intentionally renders no <html>: the <html lang dir> element lives in app/[locale]/layout.tsx
// so that lang/dir/min-age are set per locale.
import type { ReactNode } from 'react';
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
