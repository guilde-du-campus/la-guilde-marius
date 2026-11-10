// =============================================================================
// La mise en place des tests (TD5 de la séance 4)
// -----------------------------------------------------------------------------
// Deux choses, toutes deux indispensables :
//   · les matchers jest-dom (toBeInTheDocument, toBeVisible...) : les
//     assertions se lisent comme des phrases ;
//   · le NETTOYAGE entre les tests : sans lui, chaque render s'empile sur
//     le précédent et le deuxième test trouve les éléments du premier
//     (« Found multiple elements » : le piège classique du premier filet).
// =============================================================================
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
afterEach(() => {
  cleanup();
});
