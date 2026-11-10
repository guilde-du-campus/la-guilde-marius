// =============================================================================
// Le layout racine : commun à toutes les pages
// =============================================================================
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/features/auth/auth-provider';
import { SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: 'La Guilde',
  description: "La plateforme d'entraide et de troc du campus",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <SiteHeader />
          <main className="site-main">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
