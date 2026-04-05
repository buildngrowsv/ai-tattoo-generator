/**
 * vitest.config.ts — Vitest configuration for AI Tattoo Generator
 *
 * WHY THIS EXISTS: Added 2026-03-24 as part of the pane1774 swarm quality gate
 * initiative. Clone apps were shipping without test infrastructure, causing
 * silent regressions in Vercel CI. This config hooks Vitest into the Next.js
 * project with jsdom environment for React component testing capability.
 *
 * JSDOM ENVIRONMENT: We use jsdom (not node) so that browser globals like
 * window, document, and fetch are available in tests. This is necessary for
 * testing React components and Next.js route handlers that reference browser APIs.
 *
 * PATH ALIAS: The '@' alias mirrors tsconfig.json paths so test imports like
 * `import { something } from '@/lib/utils'` resolve correctly without needing
 * to duplicate the alias config.
 */
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    exclude: ['**/node_modules/**', '**/dist/**', 'e2e/**', 'tests/e2e/**', 'tests/smoke/**', 'docs/demo/**/*.spec.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
