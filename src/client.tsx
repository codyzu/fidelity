import QRCode from 'react-qr-code';
import {signOut} from 'firebase/auth';
import {useTranslation} from 'react-i18next';
import {useOutletContext} from 'react-router-dom';
import {auth} from './firebase';
import type User from './user';
import UserDisplay from './user-display';

export default function Client() {
  const {t} = useTranslation();

  const user: User = useOutletContext();

  return (
    <div className="flex flex-col items-center gap-y-3">
      <div className="text-3xl">{t('Welcome to fidelity')}</div>
      <QRCode level="H" value={auth.currentUser?.uid ?? 'not logged in'} />
      <UserDisplay user={user} />
      <div>
        <button
          className="btn-sm"
          type="button"
          onClick={async () => signOut(auth)}
        >
          {t('Sign out')}
        </button>
      </div>
    </div>
  );
}
