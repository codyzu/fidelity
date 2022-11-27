import {doc, getDoc, increment, setDoc, updateDoc} from 'firebase/firestore';
import {type OnResultFunction, QrReader} from 'react-qr-reader';
import {useEffect, useState} from 'react';
import {useDebouncedCallback} from 'use-debounce';
// Import ViewFinder from './view-finder';
import db from './db';

export default function Scanner() {
  const [code, setCode] = useState();
  const [handle, setHandle] = useState<number>();
  const [user, setUser] = useState<any>();

  const debouncedScan = useDebouncedCallback(
    async (nextCode) => {
      console.log('code', nextCode);
      setCode(nextCode);
      const nextHandle = setTimeout(() => {
        console.log('clear');
        setCode(undefined);
        setHandle(undefined);
        setUser(undefined);
      }, 5000);
      setHandle(nextHandle);
      const ref = doc(db, 'users', nextCode);
      await setDoc(ref, {points: increment(1)}, {merge: true});
      const snapshot = await getDoc(ref);
      setUser(snapshot.data());
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
            <div className="rounded-1\/2 w-[90%] h-[90%] bg-green-6 flex items-center justify-center">
              <div className="i-lucide-check-circle text-white w-[50%] h-[50%]" />
            </div>
          </div>
        ) : (
          <QrReader
            videoContainerStyle={{width: '100%', height: '100%', padding: 0}}
            className="w-full h-full"
            videoStyle={{/*zIndex: '1' */ objectFit: 'cover'}}
            constraints={{facingMode: 'environment', aspectRatio: 1}}
            scanDelay={500}
            onResult={onScan}
          />
        )}
      </div>

      {code && <div>{code}</div>}
      {user && <div>{user.points}</div>}
    </div>
  );
}
