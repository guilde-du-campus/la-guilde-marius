import { apiFetch } from '@/lib/api';
import { PrivateAdventurer, TokenPair } from './types';

// Connexion : Echange email + password contre les 2 tokens
export async function login(email: string, password: string): Promise<TokenPair> {
  return apiFetch<TokenPair>('/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// Récupérer le profil, le serveur décide quel profil retourner
export async function fetchMe(): Promise<PrivateAdventurer> {
  return apiFetch<PrivateAdventurer>('/v1/me');
}
