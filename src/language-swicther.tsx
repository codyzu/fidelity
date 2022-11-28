import clsx from 'clsx';
import {useTranslation} from 'react-i18next';

export default function LanguageSwitcher() {
  const {i18n} = useTranslation();

  return (
    <div className="flex justify-center mt-8">
      <div className="flex">
        <button
          className={clsx(
            'btn-sm rounded-r-none py-1',
            i18n.language === 'fr' && 'bg-gray-6',
          )}
          type="button"
          onClick={async () => i18n.changeLanguage('fr')}
        >
          fr
        </button>
        <button
          className={clsx(
            'btn-sm rounded-l-none py-1',
            i18n.language === 'en' && 'bg-gray-6',
          )}
          type="button"
          onClick={async () => i18n.changeLanguage('en')}
        >
          en
        </button>
      </div>
    </div>
  );
}
