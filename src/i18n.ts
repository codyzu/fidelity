import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';
import homepageFr from './lang/fr/homepage.json';
import homepageEn from './lang/en/homepage.json';

// eslint-disable-next-line import/no-named-as-default-member
void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translations: {...homepageEn},
      },
      fr: {
        translations: {...homepageFr},
      },
    },
    fallbackLng: 'en',
    debug: true,
    ns: ['translations'],
    defaultNS: 'translations', // eslint-disable-line @typescript-eslint/naming-convention
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export {default} from 'i18next';
