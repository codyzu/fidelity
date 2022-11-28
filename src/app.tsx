import {lazy, useEffect, useState} from 'react';
import {Outlet} from 'react-router-dom';
import {auth} from './firebase';
import LanguageSwitcher from './language-swicther';
import Page from './page';

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

  return <Page>{loggedIn ? <Outlet /> : <Login />}</Page>;
}

export default App;
