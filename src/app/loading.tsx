// =============================================================================
// Le squelette du tableau · TD2 de la séance 2
// -----------------------------------------------------------------------------
// Ce fichier suffit : Next.js envoie ce squelette immédiatement, puis
// pousse le contenu de page.tsx dans le même flux HTML (streaming).
// La forme du contenu, pas une roue qui tourne : la place est réservée,
// la page ne saute pas quand les cartes arrivent (bonjour, CLS).
// =============================================================================
import '@/styles/skeleton.css';
export default function HomeLoading() {
  return (
    <section aria-busy="true" aria-label="Chargement du tableau des quêtes">
      <h1>Le tableau des quêtes</h1>
      <div className="skeleton-grid">
        {/* Trois cartes grises aux dimensions d'une carte de quête. */}
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
      </div>
    </section>
  );
}
