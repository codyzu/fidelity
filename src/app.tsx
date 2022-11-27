import {lazy, useEffect, useState} from 'react';
import {type User} from 'firebase/auth';
import {Outlet} from 'react-router-dom';
import {auth} from './firebase';

const Login = lazy(async () => import('./login'));

function App() {
  const [user, setUser] = useState<User | undefined>();

  useEffect(
    () =>
      auth.onAuthStateChanged((nextUser) => {
        // Use undefined instead of null
        setUser(nextUser ?? undefined);
        console.log('USER', nextUser);
      }),
    [],
  );

  return (
    <div
      className="font-sans text-black px-5 py-8"
      md="mx-auto max-w-screen-md"
    >
      {user ? <Outlet /> : <Login />}
    </div>
  );
}

export default App;
