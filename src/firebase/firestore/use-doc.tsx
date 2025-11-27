'use client';
import {
  onSnapshot,
  DocumentReference,
  DocumentData,
  getDoc,
  getDocFromCache,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface UseDocOptions {
  listen?: boolean;
  idField?: string;
}

export function useDoc<T>(
  ref: DocumentReference<DocumentData> | null,
  options: UseDocOptions = { listen: true }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ref) {
      setLoading(false);
      return;
    }

    setLoading(true);

    if (options.listen) {
      const unsubscribe = onSnapshot(
        ref,
        (snapshot) => {
          if (snapshot.exists()) {
            const docData = snapshot.data();
            if (options.idField) {
              setData({ ...docData, [options.idField]: snapshot.id } as T);
            } else {
              setData(snapshot.data() as T);
            }
          } else {
            setData(null);
          }
          setLoading(false);
        },
        (err) => {
          setError(err);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } else {
       let didCancel = false;
      const fetchData = async () => {
        try {
          const cacheSnapshot = await getDocFromCache(ref);
           if (!didCancel && cacheSnapshot.exists()) {
             const docData = cacheSnapshot.data();
              if (options.idField) {
                setData({ ...docData, [options.idField]: cacheSnapshot.id } as T);
              } else {
                setData(cacheSnapshot.data() as T);
              }
               setLoading(false);
          }

          const serverSnapshot = await getDoc(ref);
          if (!didCancel) {
            if (serverSnapshot.exists()) {
               const docData = serverSnapshot.data();
              if (options.idField) {
                setData({ ...docData, [options.idField]: serverSnapshot.id } as T);
              } else {
                setData(serverSnapshot.data() as T);
              }
            } else {
              setData(null);
            }
            setLoading(false);
          }
        } catch (err) {
          if (!didCancel) {
            setError(err as Error);
            setLoading(false);
          }
        }
      };

      fetchData();
      return () => {
        didCancel = true;
      };
    }
  }, [ref, options.listen, options.idField]);

  return { data, loading, error };
}
