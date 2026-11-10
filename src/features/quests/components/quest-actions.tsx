'use client';

import { useAuth } from '@/features/auth/auth-provider';
import { Quest, QUEST_STATUS_LABELS, QuestStatus } from '../types';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ApiError } from '@/lib/api';
import { takeQuest } from '../api';

interface QuestActionsProps {
  quest: Quest;
}

export function QuestActions({ quest }: QuestActionsProps) {
  const { status, adventurer, refreshProfile } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // L'optimisme local : On affiche la mise à jour avant qu'elle soit validée par le serveur
  const [optimisticStatus, setOptimisticStatus] = useState<QuestStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (action: (id: string) => Promise<Quest>) => action(quest.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['quests'] });
      router.refresh();
      void refreshProfile();
    },
    onError: (err) => {
      setError(
        err instanceof ApiError ? err.problem.detail : "L'action n'a pas aboutit, réessaie.",
      );
    },
    onSettled: () => {
      setOptimisticStatus(null);
    },
  });

  if (status !== 'authenticated' || !adventurer) {
    return null;
  }

  const isAuthor = adventurer.id === quest.author.id;
  const shown = optimisticStatus ?? quest.status;

  return (
    <div className="flex flex-wrap items-center gap-(--space-2)">
      {optimisticStatus && (
        <span className="italic text-text-muted" role="status">
          {QUEST_STATUS_LABELS[optimisticStatus]}...
        </span>
      )}
      {/* On ne propose pas un geste que l'API refuserait : pas sa propre quête. */}
      {shown === 'OPEN' && !isAuthor && (
        <button
          className="cursor-pointer rounded-sm px-4 py-[0.55rem] font-semibold disabled:cursor-wait disabled:opacity-60 bg-accent-strong text-surface"
          type="button"
          disabled={mutation.isPending}
          onClick={() => {
            setError(null);
            setOptimisticStatus('IN_PROGRESS');
            mutation.mutate(takeQuest);
          }}
        >
          Prendre la quête
        </button>
      )}
      {error && (
        <p role="alert" className="m-0 w-full text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
