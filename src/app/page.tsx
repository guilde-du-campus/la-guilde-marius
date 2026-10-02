// =============================================================================
// La page d'accueil : le tableau des quêtes, premier jet (TD3)
// -----------------------------------------------------------------------------
// C'est un Server Component (le défaut dans l'App Router) : la requête
// part du serveur Next.js, le HTML arrive déjà rempli dans le navigateur.
// Le pourquoi de ce choix occupe une bonne partie de la séance 2.
// =============================================================================
import { fetchQuests } from '@/features/quests/api';
import type { Page, Quest } from '@/features/quests/types';
import styles from './page.module.css';

// Pourquoi cette ligne ? Réponse en séance 2.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Le tableau est public : pas de jeton nécessaire pour cette page.
  // On isole l'appel réseau dans le try/catch, et l'on rend le JSX en
  // dehors : la règle react-hooks/error-boundaries veille au grain.
  let questsPage: Page<Quest> | null = null;
  try {
    questsPage = await fetchQuests({ limit: 20 });
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
      {/* Premier jet : les titres suffisent à prouver que l'API répond. */}
      <ul>
        {quests.map((quest) => (
          <li key={quest.id}>{quest.title}</li>
        ))}
      </ul>
    </section>
  );
}
