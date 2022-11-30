import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import unocss from 'unocss/vite';
import presetAttributify from '@unocss/preset-attributify';
import presetIcons from '@unocss/preset-icons';
import presetUno from '@unocss/preset-uno';
import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx';
import {VitePWA} from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    unocss({
      presets: [
        presetIcons({
          extraProperties: {
            display: 'block',
            'vertical-align': 'middle',
          },
        }),
        presetUno(),
        presetAttributify(),
      ],
      transformers: [transformerAttributifyJsx()],
      shortcuts: [
        // You could still have object style
        {
          // Primary: 'bg-sky-700',
          btn: 'p-4 font-semibold rounded-lg shadow-md bg-primary text-white border-0 text-center text-lg',
          'btn-sm': 'btn py-2 text-base',
          'btn-num': 'btn font-mono px-0',
          input:
            'py-2 px-4 rounded-lg shadow-md border-2 border-primary invalid:text-error invalid:border-error',
        },
        // Dynamic shortcuts
        [/^(.*)-primary$/, ([, c]) => `${c}-sky-700`],
        [/^(.*)-error$/, ([, c]) => `${c}-red-600`],
        [
          /^btn-(.*)$/,
          ([, c]) => `bg-${c}-400 text-${c}-100 py-2 px-4 rounded-lg`,
        ],
      ],
    }),
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
