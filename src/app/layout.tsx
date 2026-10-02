// =============================================================================
// Le layout racine : commun à toutes les pages
// =============================================================================
import type { Metadata } from "next";
import "./globals.css";
import "../styles/tokens.css";
export const metadata: Metadata = {
 title: "La Guilde",
 description: "La plateforme d'entraide et de troc du campus",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
 return (
  <html lang="fr">
    <body>
      <header className="site-header">
        <span className="site-logo"> La Guilde</span> ⚔️
        <nav>{/* La navigation arrive avec les pages (séance 2). */}</nav>
      </header>
      <main className="site-main">{children}</main>
    </body>
  </html>
 );
}
