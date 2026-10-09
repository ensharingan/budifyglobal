import type { ConsentModel } from '@/lib/compliance/types';

const RANK: Record<ConsentModel, number> = { 'notice-only': 1, 'opt-out': 2, 'opt-in': 3 };
/** Stricter consent model wins: opt-in > opt-out > notice-only. */
export function strictestConsent(a: ConsentModel, b: ConsentModel): ConsentModel {
  return RANK[a] >= RANK[b] ? a : b;
}
