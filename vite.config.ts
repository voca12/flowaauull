import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // When GITHUB_PAGES=true env var is set (in GitHub Actions), use the repo subpath.
  // On Netlify and local dev, use '/' (absolute root).
  const isGitHubPages = process.env.GITHUB_PAGES === 'true';
  const base = isGitHubPages ? '/flowaauull/' : '/';

  return {
    plugins: [
      react(),
      tailwindcss()
    ],
    base,
    build: {
      outDir: 'dist',
      sourcemap: false,
      // Ensure assets use correct MIME-friendly extensions
      assetsDir: 'assets',
    },
    // Expose base to app code via import.meta.env.BASE_URL (Vite does this automatically)
  };
});

