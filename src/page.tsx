import {type ReactNode} from 'react';
import Layout from './layout';
import LanguageSwitcher from './language-swicther';

export default function Page({children}: {children: ReactNode}) {
  return (
    <Layout>
      {children}
      <LanguageSwitcher />
    </Layout>
  );
}
