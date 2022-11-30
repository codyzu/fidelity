import {lazy, useEffect, useState} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import {doc, onSnapshot} from 'firebase/firestore';
import {auth} from './firebase';
import Page from './page';
import {type User, type UserDoc} from './user';
import db from './db';
import LoadingSpinner from './loading-spinner';

const Login = lazy(async () => import('./login'));

function App() {
  const [uid, setUid] = useState<string>();
  const [user, setUser] = useState<User>();
  const [authStateLoaded, setAuthStateLoaded] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(
    () =>
      auth.onAuthStateChanged((nextUser) => {
        setAuthStateLoaded(true);
        setUid(nextUser?.uid);
      }),
    [],
  );

  useEffect(() => {
    if (!uid) {
      setUser(undefined);
      return;
    }

    return onSnapshot(doc(db, 'users', uid), (snapshot) => {
      if (!snapshot.exists()) {
        console.log('no user data');
        return;
      }

      const nextUser: User = {...(snapshot.data() as UserDoc), uid};
      setUser(nextUser);
      if (!user && nextUser.admin) {
        console.log('just logged in');
        navigate('/scan');
      }
    });
  }, [uid]);

  if (!authStateLoaded) {
    return <LoadingSpinner />;
  }

  return <Page>{user ? <Outlet context={user} /> : <Login />}</Page>;
}

export default App;
