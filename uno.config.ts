import {defineConfig} from 'unocss';
import presetAttributify from '@unocss/preset-attributify';
import presetIcons from '@unocss/preset-icons';
import presetUno from '@unocss/preset-uno';
import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx';
import transformerVariantGroup from '@unocss/transformer-variant-group';

export default defineConfig({
  presets: [
    // PresetAttributify(),
    presetIcons({
      extraProperties: {
        display: 'block',
        'vertical-align': 'middle',
      },
    }),
    presetUno(),
  ],
  transformers: [
    transformerVariantGroup(),
    // TransformerAttributifyJsx()
  ],
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
    // [
    //   /^btn-(.*)$/,
    //   ([, c]) => `bg-${c}-400 text-${c}-100 py-2 px-4 rounded-lg`,
    // ],
  ],
});
