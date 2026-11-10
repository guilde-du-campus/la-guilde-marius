// =============================================================================
// L'en-tête du site : la session s'y affiche (TP4 de la séance 3)
// -----------------------------------------------------------------------------
// Composant client : il lit la session. Trois visages : l'attente (le
// squelette discret), l'anonyme (se connecter), le connecté (pseudo,
// niveau, points, déconnexion).
// =============================================================================
'use client';
import Link from 'next/link';
import { useAuth } from '@/features/auth/auth-provider';
export function SiteHeader() {
  const { status, adventurer, logout } = useAuth();
  return (
    <header
      className="flex items-center gap-(--space-4) bg-navy px-(--space-4) py-(--space-2) text-on-navy"
    >
      <Link href="/" className="font-bold text-accent no-underline">
        {/* L'emoji est décoratif : caché aux lecteurs d'écran (audit du TD3). */}
        <span aria-hidden="true">⚔️</span> La Guilde
      </Link>
      <nav className="flex gap-(--space-3)" aria-label="Navigation principale">
        <Link
          className="text-on-navy no-underline hover:text-accent focus-visible:text-accent"
          href="/"
        >
          Le tableau
        </Link>
        <Link
          className="text-on-navy no-underline hover:text-accent focus-visible:text-accent"
          href="/quests/new"
        >
          Poster une quête
        </Link>
      </nav>
      <div className="ml-auto flex items-center gap-(--space-2) text-[0.9rem]">
        {status === 'loading' && (
          // L'éclair d'interface déconnectée, évité : on ne montre ni
          // « se connecter » ni un pseudo tant qu'on ne SAIT pas.
          <span className="opacity-60" aria-busy="true">
            ...
          </span>
        )}
        {status === 'anonymous' && (
          <Link className="text-accent" href="/login">
            Se connecter
          </Link>
        )}
        {status === 'authenticated' && adventurer && (
          <>
            <span className="text-on-navy">
              {adventurer.username} · niv. {adventurer.level} · {adventurer.helpPoints} pts
            </span>
            <button
              type="button"
              className="cursor-pointer rounded-sm border border-accent bg-transparent px-[0.6rem] py-1 text-[0.85rem] text-accent hover:bg-accent hover:text-navy focus-visible:bg-accent focus-visible:text-navy"
              onClick={logout}
            >
              Se déconnecter
            </button>
          </>
        )}
      </div>
    </header>
  );
}
