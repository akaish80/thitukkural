import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('react') || id.includes('react-router-dom')) {
            return 'vendor';
          }
          if (id.includes('@reduxjs/toolkit') || id.includes('react-redux')) {
            return 'redux';
          }
          if (id.includes('react-dnd')) {
            return 'dnd';
          }
          if (id.includes('styled-components') || id.includes('fuse.js')) {
            return 'ui';
          }
        },
      },
    },
  },
})
