// =============================================================================
// Le filet d'erreur de la fiche · TP2 de la séance 2
// -----------------------------------------------------------------------------
// Une fiche qui plante n'emporte ni l'en-tête ni la navigation : seul ce
// segment affiche l'erreur, avec la sortie vers le tableau.
// =============================================================================
'use client';
import Link from 'next/link';
export default function QuestError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section>
      <h1>Cette quête ne s&apos;affiche pas</h1>
      <p>L&apos;API de la Guilde n&apos;a pas répondu. Elle est peut-être arrêtée.</p>
      <button type="button" onClick={() => reset()}>
        Réessayer
      </button>{' '}
      <Link href="/">Revenir au tableau</Link>
    </section>
  );
}
