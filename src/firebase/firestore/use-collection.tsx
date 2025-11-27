'use client';
import {
  onSnapshot,
  Query,
  DocumentData,
  getDocs,
  getDocsFromCache,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface UseCollectionOptions {
  listen?: boolean;
  idField?: string;
}

export function useCollection<T>(
  query: Query<DocumentData> | null,
  options: UseCollectionOptions = { listen: true }
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    setLoading(true);

    if (options.listen) {
      const unsubscribe = onSnapshot(
        query,
        (snapshot) => {
          const docs = snapshot.docs.map((doc) => {
            const docData = doc.data();
            if (options.idField) {
              return { ...docData, [options.idField]: doc.id } as T;
            }
            return doc.data() as T;
          });
          setData(docs);
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
          // Try to get data from cache first for speed
          const cacheSnapshot = await getDocsFromCache(query);
          if (!didCancel && cacheSnapshot.docs.length > 0) {
            const docs = cacheSnapshot.docs.map((doc) => {
              const docData = doc.data();
              if (options.idField) {
                return { ...docData, [options.idField]: doc.id } as T;
              }
              return doc.data() as T;
            });
            setData(docs);
            setLoading(false);
          }

          // Then fetch from server to get latest data
          const serverSnapshot = await getDocs(query);
          if (!didCancel) {
            const docs = serverSnapshot.docs.map((doc) => {
              const docData = doc.data();
              if (options.idField) {
                return { ...docData, [options.idField]: doc.id } as T;
              }
              return doc.data() as T;
            });
            setData(docs);
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
  }, [JSON.stringify(query), options.listen, options.idField]);

  return { data, loading, error };
}
