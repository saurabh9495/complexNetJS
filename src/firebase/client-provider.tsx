// src/firebase/client-provider.tsx
'use client';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseApp } from 'firebase/app';
import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { initializeFirebase } from '.';

type FirebaseContextValue = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<FirebaseContextValue | null>(null);

  useEffect(() => {
    const init = async () => {
      const firebase = await initializeFirebase();
      setValue(firebase);
    };
    init();
  }, []);

  if (!value) {
    return null;
  }

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
}

export const useFirebase = () => {
  return useContext(FirebaseContext);
};
