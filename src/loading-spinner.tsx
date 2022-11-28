import {useTranslation} from 'react-i18next';
import Layout from './layout';
import logo from './logo.jpeg';

export default function LoadingSpinner() {
  const {t} = useTranslation();
  return (
    <Layout>
      <img src={logo} />
      <div>{t('The beers are on their way...')}</div>
      <div className="mt-8 i-lucide-beer animate-bounce h-8rem w-8rem text-yellow-500" />
    </Layout>
  );
}
