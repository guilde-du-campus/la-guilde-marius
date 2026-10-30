// =============================================================================
// La page d'accueil : le tableau des quêtes, premier jet (TD3)
// -----------------------------------------------------------------------------
// C'est un Server Component (le défaut dans l'App Router) : la requête
// part du serveur Next.js, le HTML arrive déjà rempli dans le navigateur.
// Le pourquoi de ce choix occupe une bonne partie de la séance 2.
// =============================================================================
import { fetchQuests } from '@/features/quests/api';
import Link from 'next/link';
import {
  QUEST_CATEGORY_LABELS,
  QUEST_STATUS_LABELS,
  QuestCategory,
  type Page,
  type Quest,
  type QuestStatus,
} from '@/features/quests/types';
import styles from './page.module.css';
import QuestList from '@/features/quests/components/quest-list';
import QuestFilters from '@/features/quests/components/quest-filters';
import { Pagination } from '@/features/quests/components/pagination';

// Pourquoi cette ligne ? Réponse en séance 2.
// export const dynamic = 'force-dynamic';
export const revalidate = 30;

function parseStatus(value: string | undefined): QuestStatus | undefined {
  return value && Object.hasOwn(QUEST_STATUS_LABELS, value) ? (value as QuestStatus) : undefined;
}

function parseCategory(value: string | undefined): QuestCategory | undefined {
  return value && Object.hasOwn(QUEST_CATEGORY_LABELS, value)
    ? (value as QuestCategory)
    : undefined;
}

function parsePage(value: string | undefined): number {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}

const SORTS = ['createdAt', '-createdAt', 'reward', '-reward'] as const;
type Sort = (typeof SORTS)[number];

function parseSort(value: string | undefined): Sort | undefined {
  return SORTS.includes(value as Sort) ? (value as Sort) : undefined;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const raw = await searchParams;
  const status = parseStatus(raw.status);
  const category = parseCategory(raw.category);
  const sort = parseSort(raw.sort);
  const q = raw.q?.trim();

  const page = parsePage(raw.page);
  // Le tableau est public : pas de jeton nécessaire pour cette page.
  // On isole l'appel réseau dans le try/catch, et l'on rend le JSX en
  // dehors : la règle react-hooks/error-boundaries veille au grain.
  let questsPage: Page<Quest> | null = null;
  try {
    questsPage = await fetchQuests({ limit: 6, page, status, category, q, sort });
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

  const { data: quests, total, totalPages } = questsPage;

  const currentParams = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (value) currentParams.set(key, value);
  }

  const hasFilter = Boolean(status || category || q);

  return (
    <section>
      <h1>Le tableau des quêtes</h1>
      <p className={styles.subtitle}>
        {total} quête{total > 1 ? 's' : ''} au tableau. À toi de jouer.
      </p>
      <QuestFilters />
      {/* Premier jet : les titres suffisent à prouver que l'API répond. */}

      {quests.length === 0 ? (
        <div>
          <p>Aucune quêtes n{"'"}a été trouvée avec ces critères.</p>
          {hasFilter && <Link href="/">Effacer les filtres</Link>}
        </div>
      ) : (
        <QuestList quests={quests} />
      )}
      <Pagination page={page} totalPages={totalPages} params={currentParams} />
    </section>
  );
}
