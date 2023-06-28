import {doc, getDoc, increment, setDoc} from 'firebase/firestore';
import {type OnResultFunction, QrReader} from 'react-qr-reader';
import {useEffect, useState} from 'react';
import {useDebouncedCallback} from 'use-debounce';
import clsx from 'clsx';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {signOut} from 'firebase/auth';
import db from './db';
import {type User} from './user';
import UserDisplay from './user-display';
import {auth} from './firebase';

enum Action {
  numeric = 'numeric',
  adminAdd = '+admin',
  adminRemove = '-admin',
  view = 'view',
}

export default function Scanner() {
  const {t} = useTranslation();

  const [code, setCode] = useState<string>();
  const [handle, setHandle] = useState<number>();
  const [user, setUser] = useState<User>();
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [pointsToAdd, setPointsToAdd] = useState<number>(1);
  const [actionType, setActionType] = useState<Action>(Action.numeric);
  const [qrKey, setQrKey] = useState<number>(Date.now());

  function remountQrScanner() {
    // Window.location.reload();
    setQrKey(Date.now());
  }

  useEffect(() => {
    function reloadOnDisplayChange() {
      console.log('Visibility changed');
      if (document.visibilityState === 'visible') {
        console.log('APP resumed');
        remountQrScanner();
      }
    }

    // Hacky stuff to make sure the camera works on iOS when PWA is loaded and unloaded
    // Also helps in dev builds and when the tab has been open for a long time
    window.addEventListener('visibilitychange', reloadOnDisplayChange);
    return () => {
      window.removeEventListener('visibilitychange', reloadOnDisplayChange);
    };
  }, []);

  async function userAction(scannedUid: string) {
    if (actionType === Action.numeric) {
      return setDoc(
        doc(db, 'users', scannedUid),
        {points: increment(pointsToAdd)},
        {merge: true},
      );
    }

    if (actionType === Action.adminAdd || actionType === Action.adminRemove) {
      return setDoc(
        doc(db, 'users', scannedUid),
        {admin: actionType === Action.adminAdd},
        {merge: true},
      );
    }

    // Return undefined for ActionType.view (no action)
  }

  const debouncedScan = useDebouncedCallback(
    async (scannedUid: string) => {
      console.log('code', scannedUid);
      setPending(true);
      setCode(scannedUid);
      try {
        await userAction(scannedUid);
        const snapshot = await getDoc(doc(db, 'users', scannedUid));
        setUser(snapshot.data() as User);
      } catch (userError: unknown) {
        setError(true);
        throw userError;
      } finally {
        setPending(false);
        const nextHandle = setTimeout(() => {
          console.log('clear');
          setCode(undefined);
          setHandle(undefined);
          setUser(undefined);
          setError(false);
          setActionType(Action.numeric);
          setPointsToAdd(1);
        }, 5000);
        setHandle(nextHandle);
      }
    },
    5000,
    {leading: true},
  );

  useEffect(() => {
    return () => {
      if (handle) {
        clearTimeout(handle);
      }
    };
  }, [handle]);

  const onScan: OnResultFunction = (result, error) => {
    if (error) {
      // Console.log('QR Error', error);
      return;
    }

    void debouncedScan(result!.getText());
  };

  return (
    <>
      {/* 256 + 12 border = 268 */}
      <div className="w-full max-w-[268px]">
        <div className="aspect-square w-full border-yellow-500 border-12 box-border">
          {code ? (
            <div className="w-full aspect-square flex items-center justify-center">
              <div
                className={clsx(
                  'rounded-1/2 w-[90%] h-[90%] flex items-center justify-center',
                  'bg-green-6',
                  error && 'bg-red-6',
                  pending && 'bg-yellow-6',
                )}
              >
                <div
                  className={clsx(
                    'text-white w-[50%] h-[50%] i-lucide-check-circle',
                    error && 'i-lucide-frown',
                    pending && 'i-lucide-loader animate-spin',
                  )}
                />
              </div>
            </div>
          ) : (
            <QrReader
              key={qrKey}
              // Aspect ratio constraint doesn't seem to be respected on Safari, object-fit: cover forces a square
              videoStyle={{objectFit: 'cover'}}
              constraints={{facingMode: 'environment', aspectRatio: 1}}
              scanDelay={500}
              onResult={onScan}
            />
          )}
        </div>
      </div>

      {code && <div>{code}</div>}
      <UserDisplay user={user} />
      {!code && (
        <div className="grid grid-cols-4 gap-4 w-full">
          <div className="flex items-center justify-center col-span-4 h-8">
            {actionType === Action.adminAdd ||
            actionType === Action.adminRemove ? (
              <div className="text-base bg-red-6 text-white font-semibold rounded-full p-2">{`${
                actionType === Action.adminAdd ? '+' : '-'
              }${t('admin')}`}</div>
            ) : actionType === Action.view ? (
              <div className="i-lucide-check inline-block text-3xl" />
            ) : (
              <div
                className={clsx(
                  'text-3xl font-mono',
                  pointsToAdd < 0 && 'text-red-6',
                )}
              >{`${pointsToAdd > 0 ? '+' : ''}${pointsToAdd}`}</div>
            )}
          </div>
          <button
            type="button"
            className="btn-num"
            onClick={() => {
              setPointsToAdd((p) =>
                actionType !== Action.numeric || p < 0 ? 1 : p + 1,
              );
              setActionType(Action.numeric);
            }}
          >
            +1
          </button>
          <button
            type="button"
            className="btn-num"
            onClick={() => {
              setPointsToAdd((p) =>
                actionType !== Action.numeric || p <= 1 ? 5 : p + 5,
              );
              setActionType(Action.numeric);
            }}
          >
            +5
          </button>
          <button
            type="button"
            className="btn-num"
            onClick={() => {
              setPointsToAdd((p) =>
                actionType !== Action.numeric || p <= 1 ? 10 : p + 10,
              );
              setActionType(Action.numeric);
            }}
          >
            +10
          </button>
          <button
            type="button"
            className="btn-num p-0"
            onClick={() => {
              setActionType(Action.view);
            }}
          >
            <div className="i-lucide-check inline-block text-3xl" />
          </button>
          <button
            type="button"
            className="btn py-4 bg-red-800 col-span-3"
            onClick={() => {
              setPointsToAdd(1);
              setActionType(Action.numeric);
            }}
          >
            {t('Clear')}
          </button>
          <button
            type="button"
            className="btn-num"
            onClick={() => {
              setPointsToAdd((p) =>
                actionType !== Action.numeric || p > 0 ? -10 : p - 10,
              );
              setActionType(Action.numeric);
            }}
          >
            -10
          </button>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 mt-24 w-full">
        {!code && (
          <>
            <button
              className="btn-sm"
              type="button"
              onClick={() => {
                setActionType(Action.adminAdd);
              }}
            >
              +{t('admin')}
            </button>
            <button
              className="btn-sm"
              type="button"
              onClick={() => {
                setActionType(Action.adminRemove);
              }}
            >
              -{t('admin')}
            </button>
          </>
        )}
        <Link
          className="btn-sm decoration-none flex items-center justify-center"
          role="button"
          to="/"
        >
          <div>{t('My profile')}</div>
        </Link>
        <button
          className="btn-sm"
          type="button"
          onClick={async () => signOut(auth)}
        >
          {t('Sign out')}
        </button>
      </div>
    </>
  );
}
