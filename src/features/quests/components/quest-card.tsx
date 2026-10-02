// =============================================================================
// La carte d'une quête, telle qu'elle s'affiche au tableau
// -----------------------------------------------------------------------------
// Composant de présentation pur : il reçoit une quête, il l'affiche.
// Pas d'appel réseau ici, pas d'état : ces responsabilités vivent plus haut.
// =============================================================================

import Image from 'next/image';
import Link from 'next/link';
import type { Quest } from '../types';
import { QUEST_CATEGORY_LABELS, QUEST_STATUS_LABELS, QUEST_TYPE_LABELS } from '../types';
import styles from '../styles/quest-card.module.css';

interface QuestCardProps {
  quest: Quest;
}

export function QuestCard({ quest }: QuestCardProps) {
  return (
    <article className={styles.card} data-status={quest.status}>
      {/* La photo, quand elle existe : next/image redimensionne, réserve
          la place (fill + aspect-ratio côté CSS) et charge paresseusement. */}
      {quest.photoUrl && (
        <div className={styles.photo}>
          <Image
            src={quest.photoUrl}
            alt=""
            fill
            sizes="(max-width: 700px) 100vw, 340px"
            className={styles.photoImg}
          />
        </div>
      )}

      <header className={styles.header}>
        <span className={styles.type}>{QUEST_TYPE_LABELS[quest.type]}</span>
        <span className={styles.status}>{QUEST_STATUS_LABELS[quest.status]}</span>
      </header>

      <h2 className={styles.title}>
        {/* Le titre mène à la fiche : le lien couvre l'information principale. */}
        <Link href={`/quests/${quest.id}`} className={styles.titleLink}>
          {quest.title}
        </Link>
      </h2>
      <p className={styles.description}>{quest.description}</p>

      <footer className={styles.footer}>
        <span>
          {/* Le niveau vient du serveur, calculé depuis l'XP : le front affiche, il ne calcule pas. */}
          {quest.author.username} · niv. {quest.author.level}
        </span>
        {/* Bonus du TP4 · le preneur, quand la quête est prise : taker est nullable. */}
        {quest.taker && (
          <span className={styles.taker}>
            prise par {quest.taker.username} · niv. {quest.taker.level}
          </span>
        )}
        {quest.reward > 0 && <span className={styles.reward}>{quest.reward} pts</span>}
        <span className={styles.category}>{QUEST_CATEGORY_LABELS[quest.category]}</span>
      </footer>
    </article>
  );
}
