import { atom } from 'nanostores';
import type { ConsultationTopicId } from '../data/lead';

export interface LeadRequestContext {
  readonly source: string;
  readonly projectComplex: string;
  readonly projectTitle?: string;
  readonly projectArea?: string;
  readonly topic?: ConsultationTopicId;
}

export const selectedLeadContext = atom<LeadRequestContext | null>(null);
export const leadModalOpen = atom<boolean>(false);

export function openLeadModal(context: LeadRequestContext): void {
  selectedLeadContext.set(context);
  leadModalOpen.set(true);
}

export function closeLeadModal(): void {
  leadModalOpen.set(false);
}
