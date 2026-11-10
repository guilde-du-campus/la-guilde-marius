// =============================================================================
// La page de connexion · TD4 de la séance 3
// -----------------------------------------------------------------------------
// Un formulaire accessible : labels VISIBLES, erreur textuelle reliée au
// formulaire, tout au clavier. Le double filet : le navigateur vérifie le
// format (required, type email), l'API reste la vérité.
// =============================================================================
'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ApiError } from '@/lib/api';
import { useAuth } from '@/features/auth/auth-provider';

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      await login(String(form.get('email') ?? ''), String(form.get('password') ?? ''));
      // Le paramètre next ramène là d'où la garde nous a renvoyés.
      const next = params.get('next');
      router.replace(next && next.startsWith('/') && !next.startsWith('//') ? next : '/');
    } catch (err) {
      // L'API dit pourquoi en français (RFC 7807) : on relaie, on n'invente pas.
      setError(err instanceof ApiError ? err.problem.detail : "L'API ne répond pas. Réessaie.");
      setSubmitting(false);
    }
  }
  return (
    <section className="mx-auto max-w-105">
      <h1>Se connecter à la Guilde</h1>
      <form
        className="flex flex-col gap-(--space-3) rounded-md border border-border bg-surface p-(--space-4)"
        onSubmit={handleSubmit}
        noValidate={false}
      >
        {/* L'erreur générale : une bannière annoncée aux lecteurs d'écran. */}
        {error && (
          <p role="alert" className="m-0 rounded-sm border border-danger p-(--space-2) text-danger">
            {error}
          </p>
        )}
        <label className="flex flex-col gap-[0.3rem]">
          <span className="text-[0.9rem] text-text-muted">Email</span>
          <input
            className="rounded-sm border border-border bg-background px-[0.7rem] py-[0.55rem] text-text"
            type="email"
            name="email"
            value="lancelot@guilde.local"
            autoComplete="email"
            required
          />
        </label>
        <label className="flex flex-col gap-[0.3rem]">
          <span className="text-[0.9rem] text-text-muted">Mot de passe</span>
          <input
            className="rounded-sm border border-border bg-background px-[0.7rem] py-[0.55rem] text-text"
            type="password"
            name="password"
            autoComplete="current-password"
            value="guilde-demo-2026!"
            required
            minLength={12}
          />
        </label>
        {/* Désactivé PENDANT l'envoi seulement : un bouton grisé n'explique
            rien, une erreur si. */}
        <button
          className="cursor-pointer rounded-sm bg-accent-strong p-[0.6rem] font-semibold text-surface disabled:cursor-wait disabled:opacity-60"
          type="submit"
          disabled={submitting}
        >
          {submitting ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
      <p className="text-[0.9rem] text-text-muted">
        Pas encore de compte ? Les comptes de démonstration sont dans le README de l&apos;API.
      </p>
    </section>
  );
}
export default function LoginPage() {
  // useSearchParams exige une frontière Suspense : le squelette est trivial.
  return (
    <Suspense fallback={<p aria-busy="true">Chargement...</p>}>
      <LoginForm />
    </Suspense>
  );
}
