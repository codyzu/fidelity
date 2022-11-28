import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import unocss from 'unocss/vite';
import presetAttributify from '@unocss/preset-attributify';
import presetIcons from '@unocss/preset-icons';
import presetUno from '@unocss/preset-uno';
import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx';

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
          btn: 'p-4 font-semibold rounded-lg shadow-md bg-sky-700 text-white border-0 text-center text-lg',
          'btn-sm': 'btn py-2 text-md',
          'input-base':
            'rounded-lg shadow-md border-2 border-sky-700 invalid:text-red-600 invalid:border-red-600',
          input: 'py-2 px-4 input-base',
        },
        // Dynamic shortcuts
        [
          /^btn-(.*)$/,
          ([, c]) => `bg-${c}-400 text-${c}-100 py-2 px-4 rounded-lg`,
        ],
      ],
    }),
    react(),
  ],
  // Base: 'http://localhost:5173/',
  server: {
    strictPort: true, // Otherwise the email login link will be broken
  },
});
