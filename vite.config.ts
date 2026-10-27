import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { pythonAssets } from './src/lib/pythonAssets.ts'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = env.VITE_BASE_PATH || '/'
  const siteUrl = env.VITE_SITE_URL?.replace(/\/$/, '')
  return {
    base,
    worker: { format: 'es' },
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            // Stable library chunks can stay cached when portfolio content changes.
            groups: [
              {
                name: 'react-vendor',
                test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
                priority: 20,
                includeDependenciesRecursively: false,
              },
              {
                name: 'animation-vendor',
                test: /node_modules[\\/](gsap|motion|framer-motion|motion-dom|motion-utils)[\\/]/,
                priority: 10,
                includeDependenciesRecursively: false,
              },
            ],
          },
        },
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      pythonAssets(base),
      {
        name: 'portfolio-social-metadata',
        transformIndexHtml(html) {
          const image = siteUrl
            ? `${siteUrl}/images/social-preview.png`
            : `${base}images/social-preview.png`
          const escape = (value: string) =>
            value.replace(
              /[&<>"']/g,
              (char) =>
                ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!,
            )
          return html
            .replaceAll('__SOCIAL_IMAGE__', escape(image))
            .replace(
              '__CANONICAL__',
              siteUrl
                ? `<link rel="canonical" href="${escape(siteUrl)}/" /><meta property="og:url" content="${escape(siteUrl)}/" />`
                : '',
            )
        },
      },
    ],
  }
})
