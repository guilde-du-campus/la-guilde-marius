// =============================================================================
// Les actions d'une quête · TD1, TP1, puis le toast au TD2 (séance 4)
// -----------------------------------------------------------------------------
// Les bons boutons selon le statut ET le rôle : l'auteur valide ou annule,
// le preneur termine ou abandonne, le visiteur connecté prend. Chaque
// action est une mutation React Query : POST sur la route du cycle de vie,
// puis router.refresh() : les vues serveur relisent la vérité.
//
// L'optimisme (sur « prendre ») : la carte répond AVANT le serveur, avec
// retour arrière visible s'il refuse : jamais d'optimisme sans plan B.
// Ici la copie optimiste est locale au composant (la fiche est rendue par
// le serveur) ; avec des données portées par useQuery, onMutate et son
// contexte feraient exactement le même travail sur le cache.
// =============================================================================
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/lib/api';
import { useAuth } from '@/features/auth/auth-provider';
import { useToast } from '@/features/toasts/toaster';
import { abandonQuest, cancelQuest, completeQuest, takeQuest, validateQuest } from '../api';
import type { Quest, QuestStatus } from '../types';
import { QUEST_STATUS_LABELS } from '../types';

interface QuestActionsProps {
  quest: Quest;
}

export function QuestActions({ quest }: QuestActionsProps) {
  const { status, adventurer, refreshProfile } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  // L'optimisme local : le statut affiché AVANT la réponse du serveur.
  const [optimisticStatus, setOptimisticStatus] = useState<QuestStatus | null>(null);

  // Le trio de base de toute mutation : écrire, invalider, réafficher.
  const mutation = useMutation({
    mutationFn: (action: (id: string) => Promise<Quest>) => action(quest.id),
    onSuccess: async () => {
      // Le cache client se marque périmé, les vues serveur se relisent,
      // le solde de points suit (l'escrow bouge à chaque transition).
      await queryClient.invalidateQueries({ queryKey: ['quests'] });
      router.refresh();
      void refreshProfile();
    },
    onError: (error) => {
      // Le plan B de l'optimisme : retour arrière VISIBLE + message honnête.
      setOptimisticStatus(null);
      toast(
        error instanceof ApiError
          ? error.problem.detail
          : "L'action n'a pas abouti. Réessaie dans un instant.",
      );
    },
    onSettled: () => {
      // Succès ou échec, l'optimisme local a fini son travail : la vérité
      // (re-rendue par le serveur) reprend la main.
      setOptimisticStatus(null);
    },
  });

  // Anonyme : pas de boutons : la fiche reste consultable, c'est tout.
  if (status !== 'authenticated' || !adventurer) {
    return null;
  }

  const isAuthor = adventurer.id === quest.author.id;
  const isTaker = quest.taker !== null && adventurer.id === quest.taker.id;
  const shown = optimisticStatus ?? quest.status;

  function run(action: (id: string) => Promise<Quest>, optimistic?: QuestStatus) {
    if (optimistic) {
      // Le pari sur le cas fréquent : l'interface répond tout de suite.
      setOptimisticStatus(optimistic);
    }
    mutation.mutate(action);
  }

  return (
    <div className="flex flex-wrap items-center gap-(--space-2)">
      {optimisticStatus && (
        <span className="italic text-text-muted" role="status">
          {QUEST_STATUS_LABELS[optimisticStatus]}...
        </span>
      )}

      {/* Le visiteur connecté prend une quête ouverte : et pas la sienne
          (l'API le refuserait : autant ne pas proposer le faux geste). */}
      {shown === 'OPEN' && !isAuthor && (
        <button
          className="cursor-pointer rounded-sm px-4 py-[0.55rem] font-semibold disabled:cursor-wait disabled:opacity-60 bg-accent-strong text-surface"
          type="button"
          disabled={mutation.isPending}
          onClick={() => run(takeQuest, 'IN_PROGRESS')}
        >
          Prendre la quête
        </button>
      )}

      {shown === 'OPEN' && isAuthor && (
        <button
          type="button"
          className="cursor-pointer rounded-sm px-4 py-[0.55rem] font-semibold disabled:cursor-wait disabled:opacity-60 border border-border bg-transparent text-text-muted"
          disabled={mutation.isPending}
          onClick={() => run(cancelQuest)}
        >
          Annuler la quête
        </button>
      )}

      {shown === 'IN_PROGRESS' && isTaker && (
        <>
          <button
            className="cursor-pointer rounded-sm px-4 py-[0.55rem] font-semibold disabled:cursor-wait disabled:opacity-60 bg-accent-strong text-surface"
            type="button"
            disabled={mutation.isPending}
            onClick={() => run(completeQuest)}
          >
            Déclarer terminée
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-sm px-4 py-[0.55rem] font-semibold disabled:cursor-wait disabled:opacity-60 border border-border bg-transparent text-text-muted"
            disabled={mutation.isPending}
            onClick={() => run(abandonQuest)}
          >
            Abandonner
          </button>
        </>
      )}

      {shown === 'COMPLETED' && isAuthor && (
        <button
          className="cursor-pointer rounded-sm px-4 py-[0.55rem] font-semibold disabled:cursor-wait disabled:opacity-60 bg-accent-strong text-surface"
          type="button"
          disabled={mutation.isPending}
          onClick={() => run(validateQuest)}
        >
          Valider le travail
        </button>
      )}
    </div>
  );
}
