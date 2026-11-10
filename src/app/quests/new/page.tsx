// =============================================================================
// Poster une quête · TD5 puis TP5 de la séance 3
// -----------------------------------------------------------------------------
// Un formulaire à double filet : la validation client pour le confort
// (required, longueurs), l'API pour la vérité. Ses erreurs RFC 7807
// reviennent champ par champ et s'affichent SOUS chaque champ, reliées
// par aria-describedby : l'accessibilité du matin, appliquée.
// =============================================================================
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/lib/api';
import { createQuest } from '@/features/quests/api';
import { RequireAuth } from '@/features/auth/require-auth';
import {
  QUEST_CATEGORY_LABELS,
  QUEST_TYPE_LABELS,
  type QuestCategory,
  type QuestType,
} from '@/features/quests/types';

function NewQuestForm() {
  const router = useRouter();
  // L'état de la saisie : de l'état d'interface pur, local au composant.
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    try {
      const quest = await createQuest({
        title: String(form.get('title') ?? '').trim(),
        description: String(form.get('description') ?? '').trim(),
        type: form.get('type') as QuestType,
        category: form.get('category') as QuestCategory,
        reward: Number(form.get('reward') ?? 0),
      });
      // Le succès mène à la quête créée : la preuve vaut mieux qu'un merci.
      router.push(`/quests/${quest.id}`);
    } catch (err) {
      setSubmitting(false);
      if (err instanceof ApiError && err.problem.fields) {
        // Le contrat renvoie les erreurs par champ : on les déplie en Record,
        // chaque message s'affiche sous le bon champ.
        setFieldErrors(Object.fromEntries(err.problem.fields.map((f) => [f.field, f.message])));
      } else if (err instanceof ApiError) {
        // L'erreur générale (400 sans fields, 401, 500) a aussi sa place.
        setError(err.problem.detail);
      } else {
        setError("L'API ne répond pas. Vérifie qu'elle tourne, puis réessaie.");
      }
    }
  }

  const types = Object.keys(QUEST_TYPE_LABELS) as QuestType[];
  const categories = Object.keys(QUEST_CATEGORY_LABELS) as QuestCategory[];

  return (
    <section className="mx-auto max-w-160">
      <h1>Poster une quête</h1>

      <form
        className="flex flex-col gap-(--space-3) rounded-md border border-border bg-surface p-(--space-4)"
        onSubmit={handleSubmit}
      >
        {error && (
          <p role="alert" className="m-0 rounded-sm border border-danger p-(--space-2) text-danger">
            {error}
          </p>
        )}

        <label className="flex flex-1 flex-col gap-[0.3rem]">
          <span className="text-[0.9rem] text-text-muted">Titre</span>
          {/* Les bornes viennent du contrat : 5 à 120 caractères. On les
              lit, on ne les invente pas. */}
          <input
            className="rounded-sm border border-border bg-background px-[0.7rem] py-[0.55rem] text-text aria-invalid:border-danger"
            name="title"
            required
            minLength={5}
            maxLength={120}
            aria-describedby={fieldErrors.title ? 'error-title' : undefined}
            aria-invalid={fieldErrors.title ? true : undefined}
          />
          {fieldErrors.title && (
            <span id="error-title" className="text-[0.85rem] text-danger">
              {fieldErrors.title}
            </span>
          )}
        </label>

        <label className="flex flex-1 flex-col gap-[0.3rem]">
          <span className="text-[0.9rem] text-text-muted">Description</span>
          <textarea
            className="rounded-sm border border-border bg-background px-[0.7rem] py-[0.55rem] text-text aria-invalid:border-danger"
            name="description"
            rows={5}
            required
            maxLength={2000}
            aria-describedby={fieldErrors.description ? 'error-description' : undefined}
            aria-invalid={fieldErrors.description ? true : undefined}
          />
          {fieldErrors.description && (
            <span id="error-description" className="text-[0.85rem] text-danger">
              {fieldErrors.description}
            </span>
          )}
        </label>

        <div className="flex flex-wrap gap-(--space-3)">
          <label className="flex flex-1 flex-col gap-[0.3rem]">
            <span className="text-[0.9rem] text-text-muted">Type</span>
            <select
              className="rounded-sm border border-border bg-background px-[0.7rem] py-[0.55rem] text-text aria-invalid:border-danger"
              name="type"
              required
              defaultValue="HELP"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {QUEST_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-1 flex-col gap-[0.3rem]">
            <span className="text-[0.9rem] text-text-muted">Catégorie</span>
            <select
              className="rounded-sm border border-border bg-background px-[0.7rem] py-[0.55rem] text-text aria-invalid:border-danger"
              name="category"
              required
              defaultValue="OTHER"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {QUEST_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-1 flex-col gap-[0.3rem]">
            <span className="text-[0.9rem] text-text-muted">Récompense</span>
            <input
              className="rounded-sm border border-border bg-background px-[0.7rem] py-[0.55rem] text-text aria-invalid:border-danger"
              type="number"
              name="reward"
              min={0}
              defaultValue={10}
              required
              aria-describedby={fieldErrors.reward ? 'error-reward' : undefined}
              aria-invalid={fieldErrors.reward ? true : undefined}
            />
            {fieldErrors.reward && (
              <span id="error-reward" className="text-[0.85rem] text-danger">
                {fieldErrors.reward}
              </span>
            )}
          </label>
        </div>

        <button
          className="cursor-pointer rounded-sm bg-accent-strong p-[0.6rem] font-semibold text-surface disabled:cursor-wait disabled:opacity-60"
          type="submit"
          disabled={submitting}
        >
          {submitting ? 'Envoi...' : 'Poster la quête'}
        </button>
      </form>
    </section>
  );
}

export default function NewQuestPage() {
  // La garde : les anonymes passent par /login et reviennent ici.
  return (
    <RequireAuth>
      <NewQuestForm />
    </RequireAuth>
  );
}
