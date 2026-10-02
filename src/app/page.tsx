// =============================================================================
// La page d'accueil : le tableau des quêtes, premier jet (TD3)
// -----------------------------------------------------------------------------
// C'est un Server Component (le défaut dans l'App Router) : la requête
// part du serveur Next.js, le HTML arrive déjà rempli dans le navigateur.
// Le pourquoi de ce choix occupe une bonne partie de la séance 2.
// =============================================================================
import { fetchQuests } from '@/features/quests/api';
import {
  QUEST_STATUS_LABELS,
  type Page,
  type Quest,
  type QuestStatus,
} from '@/features/quests/types';
import styles from './page.module.css';
import QuestList from '@/features/quests/components/quest-list';
import QuestFilters from '@/features/quests/components/quest-filters';

// Pourquoi cette ligne ? Réponse en séance 2.
// export const dynamic = 'force-dynamic';
export const revalidate = 30;

function parseStatus(value: string | undefined): QuestStatus | undefined {
  return value && Object.hasOwn(QUEST_STATUS_LABELS, value) ? (value as QuestStatus) : undefined;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const raw = await searchParams;
  const status = parseStatus(raw.status);
  // Le tableau est public : pas de jeton nécessaire pour cette page.
  // On isole l'appel réseau dans le try/catch, et l'on rend le JSX en
  // dehors : la règle react-hooks/error-boundaries veille au grain.
  let questsPage: Page<Quest> | null = null;
  try {
    questsPage = await fetchQuests({ limit: 20, status });
  } catch {
    // API injoignable : un message qui aide, plutôt qu'un écran d'erreur brut.
    questsPage = null;
  }

  if (!questsPage) {
    return (
      <section>
        <h1>Le tableau des quêtes</h1>
        <p>
          L&apos;API de la Guilde ne répond pas. Vérifie qu&apos;elle tourne (
          <code>docker compose up</code> dans le dossier de l&apos;API) et que
          <code> NEXT_PUBLIC_API_URL</code> pointe au bon endroit dans ton fichier{' '}
          <code>.env.local</code>.
        </p>
      </section>
    );
  }

  const { data: quests, total } = questsPage;

  return (
    <section>
      <h1>Le tableau des quêtes</h1>
      <p className={styles.subtitle}>
        {total} quête{total > 1 ? 's' : ''} au tableau. À toi de jouer.
      </p>
      <QuestFilters />
      {/* Premier jet : les titres suffisent à prouver que l'API répond. */}
      <QuestList quests={quests} />
    </section>
  );
}
