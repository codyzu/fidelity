import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import unocss from 'unocss/vite';
import {VitePWA} from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    unocss(),
    react(),
    // eslint-disable-next-line new-cap
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpeg}'],
      },
      // IncludeAssets: ['beer.svg', 'beer.png'],

      manifest: {
        /* eslint-disable @typescript-eslint/naming-convention */
        name: 'Bavarois fidelity',
        short_name: 'Bavarois',
        description: 'Bavarois customer fidelity',
        display: 'standalone',
        background_color: '#0369a1',
        theme_color: '#0369a1',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        /* eslint-enable @typescript-eslint/naming-convention */
      },
    }),
  ],
  // Base: 'http://localhost:5173/',
  server: {
    strictPort: true, // Otherwise the email login link will be broken
  },
  build: {
    rollupOptions: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        'firebase-vendor': ['firebase/auth', 'firebase/app'],
      },
    },
  },
});
