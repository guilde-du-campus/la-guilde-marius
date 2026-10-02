// =============================================================================
// Le squelette de la fiche · TP2 de la séance 2
// -----------------------------------------------------------------------------
// La même idée que pour le tableau : la forme du contenu, tout de suite.
// Un titre, deux lignes, un bloc de faits : la page ne saute pas.
// =============================================================================
import '@/styles/skeleton.css';
export default function QuestLoading() {
  return (
    <article aria-busy="true" aria-label="Chargement de la quête">
      <div className="skeleton-line skeleton-title" />
      <div className="skeleton-line" />
      <div className="skeleton-line skeleton-short" />
      <div className="skeleton-card" />
    </article>
  );
}
