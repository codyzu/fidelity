import {lazy, useEffect, useState} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import {doc, onSnapshot} from 'firebase/firestore';
import {auth} from './firebase';
import Page from './page';
import type User from './user';
import db from './db';
import LoadingSpinner from './loading-spinner';

const Login = lazy(async () => import('./login'));

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User>();
  const [authStateLoaded, setAuthStateLoaded] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(
    () =>
      auth.onAuthStateChanged((nextUser) => {
        setAuthStateLoaded(true);
        setLoggedIn(Boolean(nextUser));
      }),
    [],
  );

  useEffect(() => {
    if (!loggedIn) {
      setUser(undefined);
      return;
    }

    return onSnapshot(doc(db, 'users', auth.currentUser!.uid), (snapshot) => {
      if (!snapshot.exists()) {
        console.log('no user data');
        return;
      }

      console.log('exists', 'data', snapshot.data());
      const nextUser = snapshot.data() as User;
      console.log('u', user);
      setUser(nextUser);
      if (!user && nextUser.admin) {
        console.log('just logged in');
        navigate('/scan');
      }
    });
  }, [loggedIn]);

  if (!authStateLoaded) {
    return <LoadingSpinner />;
  }

  return <Page>{loggedIn ? <Outlet context={user} /> : <Login />}</Page>;
}

export default App;
