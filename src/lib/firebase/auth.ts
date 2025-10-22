'use client';

import {
  auth,
  db
} from '@/lib/firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    googleProvider.setCustomParameters({
      prompt: "select_account"
    });
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Create or update user profile in Firestore
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
    }, { merge: true });

    return { user, error: null };
  } catch (error: any) {
    console.error("Error during Google sign-in:", error);
    return { user: null, error };
  }
};

export const signUpWithEmail = async (email: string, password: string, name: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    await updateProfile(user, {
      displayName: name
    });

    // Create user profile in Firestore
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
    });

    return {
      user,
      error: null
    };
  } catch (error: any) {
    return {
      user: null,
      error
    };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return {
      user: result.user,
      error: null
    };
  } catch (error: any) {
    return {
      user: null,
      error
    };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return {
      error: null
    };
  } catch (error: any) {
    return {
      error
    };
  }
};
