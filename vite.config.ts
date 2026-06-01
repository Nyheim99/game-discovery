import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // '@' points at the src/ directory, matching tsconfig's paths.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      // Text summary in the terminal; html for a browsable report in coverage/.
      reporter: ['text', 'html'],
      // Only measure our own source. Exclude entry/config/type-only files and
      // the test helpers themselves — they'd otherwise dilute the numbers.
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/test/**',
        'src/main.tsx',
        'src/Providers.tsx',
        'src/vite-env.d.ts',
      ],
      // Fail the run (and therefore CI) if coverage drops below these floors.
      // We currently sit at ~100%, so these are a regression guard with some
      // headroom — not a chase-the-number target. Raise them deliberately if
      // we want a tighter ratchet later.
      thresholds: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
      },
    },
  },
})
