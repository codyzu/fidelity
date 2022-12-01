import {lazy, useEffect, useRef, useState} from 'react';
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
  const firstUserLoad = useRef(false);

  useEffect(
    () =>
      auth.onAuthStateChanged((nextUser) => {
        setUid(nextUser?.uid);
        setAuthStateLoaded(true);
      }),
    [],
  );

  useEffect(() => {
    // Auth stated loaded and user not logged in
    // Mark the first user load as complete to remove the loading spinner
    if (authStateLoaded && !uid) {
      firstUserLoad.current = true;
    }

    if (!uid) {
      setUser(undefined);
      return;
    }

    console.log('register onsnap');
    return onSnapshot(doc(db, 'users', uid), (snapshot) => {
      const nextUser: User = {...(snapshot.data() as UserDoc), uid};
      setUser(nextUser);
    });
  }, [uid, authStateLoaded]);

  useEffect(() => {
    if (!user) {
      return;
    }

    // If this is the first time a user has been loaded,
    // navigate if its an admin user
    if (!firstUserLoad.current && user.admin) {
      firstUserLoad.current = true;
      console.log('just logged in');
      navigate('/scan');
    }

    // Mark that the user is loaded to remove the loading spinner
    firstUserLoad.current = true;
  }, [user, navigate]);

  if (!firstUserLoad.current) {
    return <LoadingSpinner />;
  }

  return <Page>{user ? <Outlet context={user} /> : <Login />}</Page>;
}

export default App;
