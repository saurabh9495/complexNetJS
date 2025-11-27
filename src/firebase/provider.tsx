'use client';
import { initializeFirebase } from '@/firebase';
import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { createContext, useContext, useMemo, type ReactNode } from 'react';

const FirebaseContext = createContext<{
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} | null>(null);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const { app, auth, firestore } = useMemo(initializeFirebase, []);

  useIsomorphicLayoutEffect(() => {
    if (!app || !auth || !firestore) {
      initializeFirebase();
    }
  }, [app, auth, firestore]);

  return (
    <FirebaseContext.Provider value={{ app, auth, firestore }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebaseApp = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebaseApp must be used within a FirebaseProvider');
  }
  return context.app;
};

export const useFirestore = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }
  return context.firestore;
};

export const useAuth = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return context.auth;
};
