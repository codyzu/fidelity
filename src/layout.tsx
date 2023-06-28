import {type ReactNode} from 'react';

export default function Layout({children}: {children: ReactNode}) {
  return (
    <div className="font-sans text-black px-5 py-2 flex flex-col items-center gap-4 md:(mx-auto max-w-screen-md)">
      {children}
    </div>
  );
}
