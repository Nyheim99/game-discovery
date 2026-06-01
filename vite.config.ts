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
    },
  },
})
