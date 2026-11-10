// =============================================================================
// Le branchement du temps réel · TD2, puis tous les événements au TP2 (séance 4)
// -----------------------------------------------------------------------------
// Monté UNE fois dans le layout : il ouvre le canal quand la session est
// là, traduit les événements du contrat en toasts français, et rafraîchit
// les vues serveur. Le WebSocket notifie, l'API REST fait foi.
// =============================================================================
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/auth-provider';
import { useToast } from '@/features/toasts/toaster';
import { useRealtime, type RealtimeEvent } from './use-realtime';

// Les données portées par chaque événement (section temps réel du contrat).
interface QuestTakenData {
  questId: string;
  title: string;
  taker: { id: string; username: string };
}

interface QuestCompletedData {
  questId: string;
  title: string;
}

interface QuestValidatedData {
  questId: string;
  title: string;
  pointsEarned: number;
  xpEarned: number;
}

interface BadgeAwardedData {
  badgeCode: string;
  name: string;
}

function messageFor(event: RealtimeEvent): string {
  switch (event.event) {
    case 'quest.taken': {
      const data = event.data as unknown as QuestTakenData;
      return `${data.taker.username} a pris ta quête « ${data.title} »`;
    }
    case 'quest.completed': {
      const data = event.data as unknown as QuestCompletedData;
      return `« ${data.title} » est déclarée terminée : à toi de valider`;
    }
    case 'quest.validated': {
      const data = event.data as unknown as QuestValidatedData;
      return `Quête validée : +${data.pointsEarned} points, +${data.xpEarned} XP !`;
    }
    case 'badge.awarded': {
      const data = event.data as unknown as BadgeAwardedData;
      return `Badge obtenu : ${data.name}`;
    }
  }
}

function ConnectedRealtime() {
  const toast = useToast();
  const router = useRouter();
  const { refreshProfile } = useAuth();

  useRealtime((event) => {
    toast(messageFor(event));
    // Les vues serveur (tableau, fiches) relisent l'état réel ; le profil
    // aussi quand des points ou de l'XP viennent de tomber.
    router.refresh();
    if (event.event === 'quest.validated' || event.event === 'badge.awarded') {
      void refreshProfile();
    }
  });

  return null;
}

export function RealtimeToasts() {
  const { status } = useAuth();
  // Pas de session, pas de canal : le composant ne monte le hook qu'une
  // fois connecté (et le hook se nettoie seul à la déconnexion).
  if (status !== 'authenticated') {
    return null;
  }
  return <ConnectedRealtime />;
}
