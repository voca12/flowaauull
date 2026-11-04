import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  
  plugins: [
    react(),
    tailwindcss()
  ],
  base: '/flowaauull/', // Essential for GitHub Pages deployment
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});

