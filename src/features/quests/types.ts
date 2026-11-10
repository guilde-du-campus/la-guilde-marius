export type QuestType = 'HELP' | 'BARTER';

export type QuestCategory = 'DEV' | 'DESIGN' | 'COURSES' | 'MATERIAL' | 'STUDENT_LIFE' | 'OTHER';

export type QuestStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'VALIDATED' | 'CANCELLED';

export interface AdventurerSummary {
  id: string;
  username: string;
  avatarUrl: string | null;
  level: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  category: QuestCategory;
  status: QuestStatus;
  reward: number;
  photoUrl: string | null;
  author: AdventurerSummary;
  taker: AdventurerSummary | null;
  createdAt: string;
  takenAt: string | null;
  completedAt: string | null;
  validatedAt: string | null;
}

export interface NewQuest {
  title: string;
  description: string;
  type: QuestType;
  category: QuestCategory;
  reward: number;
  photoUrl?: string;
}

export interface Page<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const QUEST_STATUS_LABELS: Record<QuestStatus, string> = {
  OPEN: 'Ouverte',
  IN_PROGRESS: 'En cours',
  COMPLETED: 'Complétée',
  VALIDATED: 'Validée',
  CANCELLED: 'Annulée',
};

export const QUEST_CATEGORY_LABELS: Record<QuestCategory, string> = {
  DEV: 'Dev',
  DESIGN: 'Design',
  COURSES: 'Cours',
  MATERIAL: 'Matériel',
  STUDENT_LIFE: 'Vie étudiante',
  OTHER: 'Autre',
};

export const QUEST_TYPE_LABELS: Record<QuestType, string> = {
  HELP: 'Aide',
  BARTER: 'Troc',
};
