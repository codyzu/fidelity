import {useTranslation} from 'react-i18next';
import type User from './user';

export default function UserDisplay({user}: {user?: User}) {
  const {t} = useTranslation();
  if (!user) {
    return null;
  }

  return (
    <>
      <div className="flex justify-center w-ful items-baseline">
        <div className="mr-1 text-2xl break-all flex-shrink-1">{user.phoneNumber ?? user.email}</div>
        {user.admin && (
          <div className="bg-red-6 text-white rounded-full px-3 h-6 flex items-center justify-center text-sm font-semibold">
            <div>{t('admin')}</div>
          </div>
        )}
      </div>
      <div className="text-2xl">
        {t('Points')}:{' '}
        <div className="inline font-mono font-semibold">{user.points ?? 0}</div>
      </div>
    </>
  );
}
