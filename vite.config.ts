import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core - loaded immediately
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
          // Syntax highlighter - lazy loaded only when code blocks exist
          if (id.includes('react-syntax-highlighter') || id.includes('highlight.js')) {
            return 'syntax-highlighter';
          }
          // Markdown parser - can be slightly delayed
          if (id.includes('react-markdown') || id.includes('remark') || id.includes('unified') || id.includes('mdast') || id.includes('micromark')) {
            return 'markdown';
          }
        },
      },
    },
    target: 'esnext',
    minify: 'esbuild',
  },
})
