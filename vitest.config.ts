// =============================================================================
// La configuration Vitest · TD5 de la séance 4
// =============================================================================
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
export default defineConfig({
  plugins: [react()],
  test: {
    // jsdom simule le navigateur : les composants se rendent sans Chrome.
    environment: 'jsdom',
    // Les matchers lisibles (toBeInTheDocument...) : voir vitest.setup.ts.
    setupFiles: ['./vitest.setup.ts'],
    // Les tests vivent à côté du code qu'ils vérifient, dans src/.
    include: ['src/**/*.test.{ts,tsx}'],
  },
  resolve: {
    // L'alias @ du projet, pour que les imports des composants marchent.
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
