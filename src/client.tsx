import {useEffect, useState} from 'react';
import QRCode from 'react-qr-code';
import {signOut} from 'firebase/auth';
import {useTranslation} from 'react-i18next';
import {doc, getDoc} from 'firebase/firestore';
import {auth} from './firebase';
import db from './db';

export default function Client() {
  const {t, i18n} = useTranslation();

  const [user, setUser] = useState({});

  useEffect(() => {
    console.log('client', auth.currentUser);

    if (!auth.currentUser) {
      return;
    }

    async function getUserData() {
      const ref = await getDoc(doc(db, 'users', auth.currentUser!.uid));
      if (!ref.exists()) {
        console.log('no user data');
        return;
      }

      console.log('exists', ref.exists(), 'data', ref.data());
      setUser(ref.data());
    }

    void getUserData();
  }, [auth.currentUser]);

  return (
    <div className="flex flex-col items-center gap-y-3">
      <div className="text-3xl">{t('welcome')}</div>
      <QRCode level="H" value={auth.currentUser?.uid ?? 'not logged in'} />
      <div className="text-2xl">
        {auth.currentUser?.email ??
          auth.currentUser?.phoneNumber ??
          'not logged in'}
      </div>
      <div>
        <button
          className="btn"
          type="button"
          onClick={async () => signOut(auth)}
        >
          Sign Out
        </button>
      </div>
      <div>Points: {user?.points ?? 0}</div>
    </div>
  );
}
