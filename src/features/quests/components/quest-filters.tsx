'use client';

import { withParam } from '@/lib/search-params';
import { useRouter, useSearchParams } from 'next/navigation';
import { QUEST_STATUS_LABELS, QuestStatus } from '../types';
import styles from '../styles/quest-filters.module.css';

export default function QuestFilters() {
  const router = useRouter();
  const params = useSearchParams();

  function apply(key: string, value: string) {
    router.push(`/?${withParam(params, key, value || null)}`);
  }

  const statuses = Object.keys(QUEST_STATUS_LABELS) as QuestStatus[];

  return (
    <div className={styles.filters}>
      <label className={styles.field}>
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
    </div>
  );
}
