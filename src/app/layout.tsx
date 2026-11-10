// =============================================================================
// Le layout racine : commun à toutes les pages
// =============================================================================
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/features/auth/auth-provider';
import { SiteHeader } from '@/components/site-header';
import { QueryProvider } from './providers';
import { ToastProvider } from '@/features/toasts/toaster';
import { RealtimeToasts } from '@/features/realtime/realtime-toasts';

export const metadata: Metadata = {
  title: 'La Guilde',
  description: "La plateforme d'entraide et de troc du campus",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>
              <SiteHeader />
              <main className="site-main">{children}</main>
              <RealtimeToasts />
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
