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

// Clé du localStorage pour stocker le refresh token
const REFRESH_KEY = 'guilde.refreshToken';
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

/**
 * Authentification
 */

// Token court (15min)
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

// Token long (7 jours)
export function storeRefreshToken(token: string | null) {
  // Sécurité car window n'existe que dans le navigateur et pas côté serveur
  if (typeof window === 'undefined') return;
  if (token === null) {
    window.localStorage.removeItem(REFRESH_KEY);
  } else {
    window.localStorage.setItem(REFRESH_KEY, token);
  }
}

export function readRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(REFRESH_KEY);
}

export function clearSession() {
  setAccessToken(null);
  storeRefreshToken(null);
}

// Empêche d'appeler en double le rafraichissement de token d'accès
let refreshInFlight: Promise<boolean> | null = null;

export function tryRefresh(): Promise<boolean> {
  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = (async () => {
    const refreshToken = readRefreshToken();
    if (!refreshToken) return false;
    try {
      const response = await fetch(`${API_URL}/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      const tokens = (await response.json()) as { accessToken: string; refreshToken: string };
      setAccessToken(tokens.accessToken);
      storeRefreshToken(tokens.refreshToken);
      return true;
    } catch {
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

/** Le fetch maison : préfixe l'URL, pose les en-têtes, lève une ApiError
 * digne de ce nom quand le serveur répond un problème.
 * Générique : le type de retour est déclaré à l'appel, TypeScript suit.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const doFetch = () => {
    const headers: Record<string, string> = {
      ...(init?.headers as Record<string, string> | undefined),
    };

    if (init?.body !== undefined && !(init.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    return fetch(`${API_URL}${path}`, { ...init, headers });
  };

  let response = await doFetch();

  // Si 401, rafraichissement de token + 2eme rentative
  if (response.status === 401 && (await tryRefresh())) {
    response = await doFetch();
  }

  if (!response.ok) {
    const problem = (await response.json()) as ApiProblem;
    throw new ApiError(problem);
  }

  // 204 No Content : rien à parser.
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}
