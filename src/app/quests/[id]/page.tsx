// =============================================================================
// La fiche d'une quête · premier jet au TD4, complétée au TP4 (séance 1)
// -----------------------------------------------------------------------------
// Route dynamique : le dossier [id] capture l'identifiant de l'URL.
// Server Component : la quête se lit côté serveur, le HTML arrive rempli.
// =============================================================================

import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ApiError } from '@/lib/api';
import { fetchQuest } from '@/features/quests/api';
import type { Quest } from '@/features/quests/types';
import {
  QUEST_CATEGORY_LABELS,
  QUEST_STATUS_LABELS,
  QUEST_TYPE_LABELS,
} from '@/features/quests/types';
import styles from './page.module.css';

// TP2 · une quête change de statut plus souvent que le tableau ne bouge :
// dix secondes de fraîcheur, pas plus. Le choix se justifie dans la PR.
export const revalidate = 10;

// Les dates arrivent en ISO 8601 : l'affichage les met en français.
// Le composant met en forme, l'API livre la donnée : chacun son rôle.
function formatDate(iso: string): string {
  // Le fuseau est explicite : le serveur tourne souvent en UTC, les
  // aventuriers vivent à l'heure de Paris.
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Europe/Paris',
  }).format(new Date(iso));
}

export default async function QuestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let quest: Quest;
  try {
    quest = await fetchQuest(id);
  } catch (error) {
    // Une quête introuvable mérite une vraie page 404, pas un écran brut.
    if (error instanceof ApiError && error.problem.status === 404) {
      notFound();
    }
    throw error;
  }

  return (
    <article className={styles.quest}>
      <header className={styles.header}>
        <span className={styles.type}>{QUEST_TYPE_LABELS[quest.type]}</span>
        <span className={styles.status}>{QUEST_STATUS_LABELS[quest.status]}</span>
      </header>

      <h1 className={styles.title}>{quest.title}</h1>

      {/* La photo, en grand : next/image mesure et optimise. */}
      {quest.photoUrl && (
        <div className={styles.photo}>
          <Image
            src={quest.photoUrl}
            alt=""
            fill
            sizes="640px"
            className={styles.photoImg}
            priority
          />
        </div>
      )}
      <p className={styles.description}>{quest.description}</p>

      <dl className={styles.facts}>
        <dt>Catégorie</dt>
        <dd>{QUEST_CATEGORY_LABELS[quest.category]}</dd>
        <dt>Récompense</dt>
        <dd>{quest.reward > 0 ? `${quest.reward} points d'entraide` : "Le plaisir d'aider"}</dd>
        <dt>Postée par</dt>
        <dd>
          {quest.author.username} · niveau {quest.author.level}
        </dd>
        {/* Le preneur est nullable dans le contrat : on n'affiche la ligne que s'il existe. */}
        {quest.taker && (
          <>
            <dt>Prise par</dt>
            <dd>
              {quest.taker.username} · niveau {quest.taker.level}
            </dd>
          </>
        )}
        <dt>Postée le</dt>
        <dd>{formatDate(quest.createdAt)}</dd>
        {quest.takenAt && (
          <>
            <dt>Prise le</dt>
            <dd>{formatDate(quest.takenAt)}</dd>
          </>
        )}
        {quest.validatedAt && (
          <>
            <dt>Validée le</dt>
            <dd>{formatDate(quest.validatedAt)}</dd>
          </>
        )}
      </dl>
    </article>
  );
}
