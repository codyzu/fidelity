import QRCode from 'react-qr-code';
import {signOut} from 'firebase/auth';
import {useTranslation} from 'react-i18next';
import {Link, useOutletContext} from 'react-router-dom';
import {auth} from './firebase';
import type User from './user';
import UserDisplay from './user-display';

export default function Client() {
  const {t} = useTranslation();

  const user: User = useOutletContext();

  return (
    <>
      <div className="text-3xl">{t('Welcome to fidelity')}</div>
      <div className="m4">
        <QRCode level="H" value={auth.currentUser?.uid ?? 'not logged in'} />
      </div>
      <UserDisplay user={user} />
      <div className="flex gap-4 mt-8 w-full">
        {user?.admin && (
          <Link
            className="btn-sm decoration-none flex items-center justify-center flex-1"
            role="button"
            to="/scan"
          >
            <div>{t('Scan')}</div>
          </Link>
        )}
        <button
          className="btn-sm flex-1"
          type="button"
          onClick={async () => signOut(auth)}
        >
          {t('Sign out')}
        </button>
      </div>
    </>
  );
}
