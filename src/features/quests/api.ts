// =============================================================================
// Les appels API de la fonctionnalité « quêtes »
// -----------------------------------------------------------------------------
// Chaque fonctionnalité regroupe ses appels dans son dossier : c'est le
// principe de l'architecture feature-slice. Le composant ne connaît pas
// fetch, il appelle une fonction métier nommée.
// =============================================================================
import { apiFetch } from '@/lib/api';
import type { Page, Quest, QuestCategory, QuestStatus, QuestType } from './types';
// Les filtres du tableau, calqués sur les paramètres du contrat.
export interface QuestFilters {
  page?: number;
  limit?: number;
  status?: QuestStatus;
  type?: QuestType;
  category?: QuestCategory;
  q?: string;
  sort?: 'createdAt' | '-createdAt' | 'reward' | '-reward';
}
/** Le tableau des quêtes : route publique, pas de jeton nécessaire. */
export async function fetchQuests(filters: QuestFilters = {}): Promise<Page<Quest>> {
  // URLSearchParams encode proprement, et l'on n'envoie que les filtres
  // réellement posés : une valeur absente n'apparaît pas dans l'URL.
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  }
  const query = params.size > 0 ? `?${params.toString()}` : '';
  return apiFetch<Page<Quest>>(`/v1/quests${query}`);
}
