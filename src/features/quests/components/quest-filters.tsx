'use client';

import { withParam } from '@/lib/search-params';
import { useRouter, useSearchParams } from 'next/navigation';
import { QUEST_CATEGORY_LABELS, QUEST_STATUS_LABELS, QuestCategory, QuestStatus } from '../types';

const SORT_LABELS = {
  '-createdAt': "Plus récentes d'abord",
  createdAt: "Plus anciennes d'abord",
  '-reward': 'Récompense décroissante',
  reward: 'Récompense croissante',
};

const labelClasses = 'flex flex-col gap-1 text-[0.8rem] text-text-muted';

export default function QuestFilters() {
  const router = useRouter();
  const params = useSearchParams();

  function apply(key: string, value: string) {
    router.push(`/?${withParam(params, key, value || null)}`);
  }

  const statuses = Object.keys(QUEST_STATUS_LABELS) as QuestStatus[];
  const categories = Object.keys(QUEST_CATEGORY_LABELS) as QuestCategory[];

  return (
    <form
      className="mt-(--space-3) flex flex-wrap items-end gap-(--space-2) rounded-md border border-border bg-surface p-(--space-2)"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        const q = new FormData(event.currentTarget).get('q');
        apply('q', typeof q === 'string' ? q.trim() : '');
      }}
    >
      <label className={labelClasses}>
        <span>Statut</span>
        <select
          value={params.get('status') ?? ''}
          onChange={(event) => apply('status', event.target.value)}
        >
          <option value="">Tous</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {QUEST_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </label>

      <label className={labelClasses}>
        <span>Catégorie</span>
        <select
          value={params.get('category') ?? ''}
          onChange={(event) => apply('category', event.target.value)}
        >
          <option value="">Toutes</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {QUEST_CATEGORY_LABELS[category]}
            </option>
          ))}
        </select>
      </label>

      <label className={labelClasses}>
        <span>Tri</span>
        <select
          value={params.get('sort') ?? '-createdAt'}
          onChange={(event) => apply('sort', event.target.value)}
        >
          {Object.entries(SORT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label className={labelClasses}>
        <span>Recherche</span>
        <input
          type="search"
          name="q"
          defaultValue={params.get('q') ?? ''}
          placeholder="Un titre, un mot de la description..."
        />
      </label>

      <button
        type="submit"
        className="cursor-pointer rounded-sm border border-accent-strong px-[0.9rem] py-[0.45rem] text-[0.9rem] text-accent-strong hover:bg-accent-strong hover:text-surface focus-visible:bg-accent-strong focus-visible:text-surface transition-all duration-300"
      >
        Chercher
      </button>
    </form>
  );
}
