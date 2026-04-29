import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync } from 'fs'
import { resolve } from 'path'

// Keeps public/pdf.worker.min.mjs in sync with the installed pdfjs-dist version.
// Runs on every dev server start and production build so npm updates don't break it.
function copyPdfjsWorker() {
  return {
    name: 'copy-pdfjs-worker',
    buildStart() {
      const src = resolve('node_modules/pdfjs-dist/build/pdf.worker.min.mjs')
      const dest = resolve('public/pdf.worker.min.mjs')
      if (existsSync(src)) copyFileSync(src, dest)
    },
  }
}

export default defineConfig({
  plugins: [react(), copyPdfjsWorker()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
  },
})
