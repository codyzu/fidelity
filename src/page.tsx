import {type ReactNode} from 'react';
import LanguageSwitcher from './language-swicther';

export default function Page({children}: {children: ReactNode}) {
  return (
    <div
      className="font-sans text-black px-5 py-8 flex flex-col items-center"
      md="mx-auto max-w-screen-md"
    >
      {children}
      <LanguageSwitcher />
    </div>
  );
}
