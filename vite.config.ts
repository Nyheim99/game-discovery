import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // '@' points at the src/ directory, matching tsconfig's paths.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
