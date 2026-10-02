// =============================================================================
// Quête introuvable · le notFound() de la fiche atterrit ici
// -----------------------------------------------------------------------------
// Un identifiant faux ou une quête disparue mérite un écran digne : on dit
// ce qui s'est passé, on propose une sortie.
// =============================================================================

import Link from 'next/link';

export default function QuestNotFound() {
  return (
    <section>
      <h1>Cette quête n&apos;existe pas (ou plus)</h1>
      <p>
        Elle a peut-être été annulée par son auteur, ou le lien est erroné. Le tableau, lui, est
        toujours là.
      </p>
      <Link href="/">Retour au tableau des quêtes</Link>
    </section>
  );
}
