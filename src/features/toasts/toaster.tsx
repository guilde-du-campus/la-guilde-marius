// =============================================================================
// Les toasts de la Guilde · le canal d'annonce du temps réel (séance 4)
// -----------------------------------------------------------------------------
// Un contexte minuscule : toast(message) empile, chaque toast s'efface
// seul. La zone est en aria-live polie : les lecteurs d'écran annoncent
// sans interrompre. File d'attente : deux événements simultanés ne
// s'écrasent pas (l'exigence de la quête annexe Q7).
// =============================================================================
'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';

interface Toast {
  id: number;
  message: string;
}

const ToastContext = createContext<((message: string) => void) | null>(null);
const TOAST_LIFETIME_MS = 6000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);
  const toast = useCallback((message: string) => {
    const id = nextId.current++;
    setToasts((current) => [...current, { id, message }]);
    // Chaque toast programme sa propre sortie : pas de minuterie globale.
    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, TOAST_LIFETIME_MS);
  }, []);
  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* aria-live="polite" : annoncé, sans couper la parole. */}
      <div
        className="fixed right-(--space-3) bottom-(--space-3) z-50 flex max-w-[min(360px,calc(100vw-2*var(--space-3)))] flex-col gap-(--space-1)"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-start gap-(--space-2) rounded-md border-l-4 border-accent bg-navy px-(--space-3) py-(--space-2) text-on-navy shadow-lg shadow-navy/25"
          >
            <span>{t.message}</span>
            <button
              type="button"
              className="ml-auto min-h-6 min-w-6 cursor-pointer bg-transparent text-base leading-none text-inherit"
              aria-label="Fermer la notification"
              onClick={() => setToasts((current) => current.filter((x) => x.id !== t.id))}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
export function useToast(): (message: string) => void {
  const toast = useContext(ToastContext);
  if (!toast) {
    throw new Error('useToast doit être utilisé sous <ToastProvider> (voir le layout racine).');
  }
  return toast;
}
