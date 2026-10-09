import { notFound } from 'next/navigation';
import { initLocale } from '@/lib/page';

// Any unmatched URL under a valid locale renders the localized 404.
export default async function CatchAll({ params }: { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  notFound();
}
