import {useRouteError} from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex flex-col p-4 items-center gap-4 font-sans">
      <div className="i-lucide-frown w-30 h-30" />
      <div className="text-3xl">Oops!</div>
      <div>Sorry, something bad happened.</div>
      <div>
        {/* @ts-expect-error we make some assumptions about what is thrown */}
        <i>{error.statusText || error.message}</i>
      </div>
    </div>
  );
}
