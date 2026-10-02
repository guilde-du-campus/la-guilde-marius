// =============================================================================
// La fonction withParam · TD3 de la séance 2
// -----------------------------------------------------------------------------
// Le besoin : chaque filtre écrit l'URL sans écraser les autres paramètres. Cinq lignes utiles, pas de
// bibliothèque : la mécanique mérite d'être lue une fois, puis oubliée.
// =============================================================================
/**
 * Copie les paramètres existants, pose (ou retire) une clé, et renvoie la
 * chaîne prête pour router.push. Une valeur null retire le paramètre :
 * le filtre « toutes » redevient une URL propre, sans reliquat.
 */
export function withParam(params: URLSearchParams, key: string, value: string | null): string {
  // Copie : on ne mute JAMAIS l'objet de useSearchParams, il est en lecture.
  const next = new URLSearchParams(params);
  if (value === null || value === '') {
    next.delete(key);
  } else {
    next.set(key, value);
  }
  // Le piège du filtre, réglé à la source : tout changement de filtre
  // ramène à la page 1. Filtrer depuis la page 3 vers une page vide n'arrive
  // plus. (Si c'est la pagination elle-même qui écrit, elle pose page après.)
  if (key !== 'page') {
    next.delete('page');
  }
  return next.toString();
}
// Usage dans le composant client (vu sur la slide « use client » de la
// séance) :
// router.push(`/?${withParam(params, "status", value)}`);
// router.push(`/?${withParam(params, "status", null)}`); // filtre « toutes »
