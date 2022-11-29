import {doc, getDoc, increment, setDoc} from 'firebase/firestore';
import {type OnResultFunction, QrReader} from 'react-qr-reader';
import {useEffect, useState} from 'react';
import {useDebouncedCallback} from 'use-debounce';
import clsx from 'clsx';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {signOut} from 'firebase/auth';
import db from './db';
import type User from './user';
import UserDisplay from './user-display';
import {auth} from './firebase';

enum Action {
  numeric = 'numeric',
  admin = 'admin',
  view = 'view',
}

export default function Scanner() {
  const {t} = useTranslation();

  const [code, setCode] = useState();
  const [handle, setHandle] = useState<number>();
  const [user, setUser] = useState<User>();
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [pointsToAdd, setPointsToAdd] = useState<number>(1);
  const [actionType, setActionType] = useState<Action>(Action.numeric);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const incrementPointsAction = async (scannedUid: string) =>
    setDoc(
      doc(db, 'users', scannedUid),
      {points: increment(pointsToAdd)},
      {merge: true},
    );

  const [action, setAction] = useState(() => incrementPointsAction);

  function setIncrementPointsAction(
    pointsIncrement: (previous: number) => number,
  ) {
    setActionType(Action.numeric);
    setPointsToAdd(pointsIncrement);
    setAction(() => incrementPointsAction);
  }

  function setAdminAction(willBeAdmin: boolean) {
    setActionType(Action.admin);
    setIsAdmin(willBeAdmin);
    setPointsToAdd(1);
    setAction(
      () => async (scannedUid: string) =>
        setDoc(
          doc(db, 'users', scannedUid),
          {admin: willBeAdmin},
          {merge: true},
        ),
    );
  }

  const debouncedScan = useDebouncedCallback(
    async (scannedUid) => {
      console.log('code', scannedUid);
      setPending(true);
      setCode(scannedUid);
      try {
        await action(scannedUid);
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
          setIncrementPointsAction(() => 1);
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

    // Console.log('QR Result', result);
    void debouncedScan(result?.getText());
  };

  return (
    <>
      <div className="bg-white w-[80vw] h-[80vw] aspect-square border-yellow-500 border-20 box-border">
        {code ? (
          <div className="w-full h-full flex items-center justify-center">
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
            videoContainerStyle={{width: '100%', height: '100%', padding: 0}}
            className="w-full h-full"
            videoStyle={{/* zIndex: '1' */ objectFit: 'cover'}}
            constraints={{facingMode: 'environment', aspectRatio: 1}}
            scanDelay={500}
            onResult={onScan}
          />
        )}
      </div>

      {code && <div>{code}</div>}
      <UserDisplay user={user} />
      {!code && (
        <div className="grid grid-cols-4 gap-4 w-full">
          <div className="flex items-center justify-center col-span-4 h-8">
            {actionType === Action.admin ? (
              <div className="text-base bg-red-6 text-white font-semibold rounded-full p-2">{`${
                isAdmin ? '+' : '-'
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
              setIncrementPointsAction((p) =>
                actionType !== Action.numeric || p < 0 ? 1 : p + 1,
              );
            }}
          >
            +1
          </button>
          <button
            type="button"
            className="btn-num"
            onClick={() => {
              setIncrementPointsAction((p) =>
                actionType !== Action.numeric || p < 0 ? 5 : p + 5,
              );
            }}
          >
            +5
          </button>
          <button
            type="button"
            className="btn-num"
            onClick={() => {
              setIncrementPointsAction((p) =>
                actionType !== Action.numeric || p < 0 ? 10 : p + 10,
              );
            }}
          >
            +10
          </button>
          <button
            type="button"
            className="btn-num p-0"
            onClick={() => {
              setActionType(Action.view);
              setAction(() => async () => undefined);
            }}
          >
            <div className="i-lucide-check inline-block text-3xl" />
          </button>
          <button
            type="button"
            className="btn py-4 bg-red-800 col-span-3"
            onClick={() => {
              setIncrementPointsAction(() => 1);
            }}
          >
            {t('Clear')}
          </button>
          <button
            type="button"
            className="btn-num"
            onClick={() => {
              setIncrementPointsAction((p) =>
                actionType !== Action.numeric || p > 0 ? -10 : p - 10,
              );
            }}
          >
            -10
          </button>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 mt-24">
        {!code && (
          <>
            <button
              className="btn-sm"
              type="button"
              onClick={() => {
                setAdminAction(true);
              }}
            >
              +{t('admin')}
            </button>
            <button
              className="btn-sm"
              type="button"
              onClick={() => {
                setAdminAction(false);
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
