import {type ReactNode} from 'react';
import Layout from './layout';
import LanguageSwitcher from './language-swicther';
import logo from './logo.jpeg';

export default function Page({children}: {children: ReactNode}) {
  return (
    <Layout>
      <div className="flex justify-between w-full">
        <img className="w-12 h-12 object-cover" src={logo} />
        <div className="flex flex-col justify-center">
          <LanguageSwitcher />
        </div>
      </div>
      {children}
    </Layout>
  );
}
