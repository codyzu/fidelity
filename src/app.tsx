import {lazy, useEffect, useState} from 'react';
import {Outlet} from 'react-router-dom';
import {auth} from './firebase';

const Login = lazy(async () => import('./login'));

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(
    () =>
      auth.onAuthStateChanged((nextUser) => {
        // Use undefined instead of null
        setLoggedIn(Boolean(nextUser));
      }),
    [],
  );

  return (
    <div
      className="font-sans text-black px-5 py-8"
      md="mx-auto max-w-screen-md"
    >
      {loggedIn ? <Outlet /> : <Login />}
    </div>
  );
}

export default App;
