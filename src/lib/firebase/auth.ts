'use client';

import {
  auth
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
  createUserProfile,
  getUserProfile
} from '@/lib/services/userService';

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    googleProvider.setCustomParameters({
      prompt: "select_account"
    });
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user profile exists
    const userProfile = await getUserProfile(user.uid);

    if (!userProfile) {
      // Create user profile if it doesn't exist
      await createUserProfile({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      });
    }

    return {
      user,
      error: null
    };
  } catch (error: any) {
    console.error("Error during Google sign-in:", error);
    return {
      user: null,
      error
    };
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
    await createUserProfile({
      uid: user.uid,
      email: user.email,
      displayName: name
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
