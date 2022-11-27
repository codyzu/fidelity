import {doc, getDoc, increment, setDoc, updateDoc} from 'firebase/firestore';
import {type OnResultFunction, QrReader} from 'react-qr-reader';
import {useEffect, useState} from 'react';
import {useDebouncedCallback} from 'use-debounce';
import clsx from 'clsx';
import {Link} from 'react-router-dom';
import db from './db';
import type User from './user';

export default function Scanner() {
  const [code, setCode] = useState();
  const [handle, setHandle] = useState<number>();
  const [user, setUser] = useState<User>();
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const debouncedScan = useDebouncedCallback(
    async (nextCode) => {
      console.log('code', nextCode);
      setPending(true);
      setCode(nextCode);
      const nextHandle = setTimeout(() => {
        console.log('clear');
        setCode(undefined);
        setHandle(undefined);
        setUser(undefined);
        setError(false);
      }, 5000);
      setHandle(nextHandle);
      const ref = doc(db, 'users', nextCode);
      try {
        await setDoc(ref, {points: increment(1)}, {merge: true});
        const snapshot = await getDoc(ref);
        console.log('SNAP', snapshot.data());
        setUser(snapshot.data());
      } catch (userError: unknown) {
        setError(true);
        throw userError;
      } finally {
        setPending(false);
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
  }, []);

  const onScan: OnResultFunction = (result, error) => {
    if (error) {
      // Console.log('QR Error', error);
      return;
    }

    // Console.log('QR Result', result);
    void debouncedScan(result?.getText());
  };

  return (
    <div className="flex flex-col items-center">
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
      {user?.phoneNumber ?? null}
      {user?.email ?? null}
      {user && <div>{user.points}</div>}
      {!code && (
        <div className="mt-8 grid grid-cols-4 gap-2">
          <button type="button" className="btn py-4">
            +1
          </button>
          <button type="button" className="btn py-4">
            +5
          </button>
          <button type="button" className="btn py-4">
            +10
          </button>
          <button type="button" className="btn py-4 bg-red-800">
            Clear
          </button>
        </div>
      )}
      <div className="mt-8 grid grid-cols-4 gap-2">
        <Link
          className="btn col-start-2 decoration-none flex items-center justify-centere"
          role="button"
          to="/"
        >
          <div>My Profile</div>
        </Link>
        <Link
          className="btn col-start-3 decoration-none flex items-center justify-center"
          role="button"
          to="/admin"
        >
          <div>Admin</div>
        </Link>
      </div>
    </div>
  );
}
