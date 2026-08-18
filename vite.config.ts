/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'ES2020',
    minify: 'esbuild',
  },
  server: {
    port: 5173,
    // Avoid EBUSY on Windows: Cargo locks files under src-tauri/target while
    // rebuilding, which crashes Vite's watcher if it isn't excluded.
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
  test: {
    environment: 'node',
    // recommendations.test.ts was the only frontend test; it was removed
    // along with the recommendations feature. Don't fail the run until
    // new frontend tests exist.
    passWithNoTests: true,
  },
})
