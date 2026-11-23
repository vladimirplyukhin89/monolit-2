import { atom } from 'nanostores';

export interface LeadRequestContext {
  readonly source: string;
  readonly projectComplex: string;
  readonly projectTitle?: string;
  readonly projectArea?: string;
}

export const selectedLeadContext = atom<LeadRequestContext | null>(null);
