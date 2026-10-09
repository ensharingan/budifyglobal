'use client';
import { createContext, useContext, type ReactNode } from 'react';
import type { ConsentModel, FooterLinkKey, Positioning, SolutionId } from '@/lib/compliance/types';

/** Serializable slice of the market config that client components need. */
export interface ClientCompliance {
  locale: string;
  country: string;
  minAge: number;
  consentModel: ConsentModel;
  honorGpc: boolean;
  consentVersion: string;
  positioning: Positioning;
  solutions: SolutionId[];
  requiredLinks: FooterLinkKey[];
  forms: { sms: boolean; casl: boolean; doubleOptInNewsletter: boolean };
  currency: string;
  /** country → consent model for every market (unknown countries default to opt-in) */
  consentByCountry: Record<string, ConsentModel>;
  gpcCountries: string[];
}

const Ctx = createContext<ClientCompliance | null>(null);
export function ComplianceProvider({ value, children }: { value: ClientCompliance; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useCompliance(): ClientCompliance {
  const v = useContext(Ctx);
  if (!v) throw new Error('useCompliance must be used inside <ComplianceProvider>');
  return v;
}
