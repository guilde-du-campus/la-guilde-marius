// =============================================================================
// Le client API : un seul endroit pour parler au serveur
// -----------------------------------------------------------------------------
// Toutes les requêtes vers l'API de la Guilde passent par ici. Centraliser
// le client, c'est centraliser l'URL de base, la gestion d'erreurs et,
// bientôt, le jeton d'authentification (séance 3).
// =============================================================================
// L'URL de base vient de l'environnement : .env.local en développement,
// les variables du projet en production. Jamais d'URL en dur dans le code.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
// La forme des erreurs RFC 7807 renvoyées par l'API.
export interface ApiProblem {
  type: string;
  title: string;
  status: number;
  detail: string;
  fields?: Array<{ field: string; message: string }>;
}
// Une erreur d'API digne de ce nom : elle transporte le problème complet,
// pas juste un message. Le composant qui l'attrape peut afficher le détail.
export class ApiError extends Error {
  constructor(public readonly problem: ApiProblem) {
    super(problem.detail);
    this.name = 'ApiError';
  }
}
/** Le fetch maison : préfixe l'URL, pose les en-têtes, lève une ApiError
 * digne de ce nom quand le serveur répond un problème.
 * Générique : le type de retour est déclaré à l'appel, TypeScript suit.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  if (!response.ok) {
    // L'API répond toujours en RFC 7807 : on peut se fier au format.
    const problem = (await response.json()) as ApiProblem;
    throw new ApiError(problem);
  }
  // 204 No Content : rien à parser.
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}
