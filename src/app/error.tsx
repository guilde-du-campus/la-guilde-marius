// =============================================================================
// Le filet d'erreur du segment · TD2 de la séance 2
// -----------------------------------------------------------------------------
// Forcément un composant client : il doit pouvoir proposer « réessayer ».
// La page plante, jamais l'application entière : le layout reste debout.
// =============================================================================
'use client';
export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section>
      <h1>Quelque chose a cassé</h1>
      <p>
        Le tableau n&apos;a pas pu s&apos;afficher. Le détail technique :{' '}
        <code>{error.message}</code>
      </p>
      {/* reset() relance le rendu du segment : la panne passagère se rattrape d'un clic.
       */}
      <button type="button" onClick={() => reset()}>
        Réessayer
      </button>
    </section>
  );
}
