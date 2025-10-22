import { db } from '@/lib/firebase/config';
import { doc, setDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import type { User, UserSettings } from '@/types';

/**
 * Creates a new user profile in Firestore with default settings.
 * @param user - The user object from Firebase Auth.
 * @throws Will throw an error if the profile creation fails.
 */
export const createUserProfile = async (
  user: { uid: string; email: string | null; displayName?: string | null }
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', user.uid);
    
    const defaultSettings: UserSettings = {
      theme: 'system',
      defaultView: 'week',
      weekStartDay: 1, // Monday
      timePeriods: {
        morning: { start: '06:00', end: '12:00' },
        noon: { start: '12:00', end: '14:00' },
        afternoon: { start: '14:00', end: '18:00' },
        evening: { start: '18:00', end: '22:00' },
        night: { start: '22:00', end: '06:00' },
      },
      calendarStartHour: 6,
      calendarEndHour: 23,
      timeIncrement: 30,
      taskTypes: [
        { id: 'school', name: 'School', color: '#4CAF50' },
        { id: 'work', name: 'Work', color: '#2196F3' },
        { id: 'love', name: 'Love', color: '#E91E63' },
        { id: 'personal', name: 'Personal', color: '#FF9800' },
      ],
    };
    
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || null,
      photoURL: null,
      createdAt: Timestamp.now(),
      settings: defaultSettings,
    });
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw new Error("Failed to create user profile.");
  }
};

/**
 * Fetches a user's profile from Firestore.
 * @param userId - The user's Firebase UID.
 * @returns The user profile object or null if not found.
 * @throws Will throw an error if fetching fails.
 */
export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return null;
    }
    
    const data = userSnap.data();
    return {
      uid: data.uid,
      email: data.email,
      displayName: data.displayName,
      photoURL: data.photoURL,
      createdAt: data.createdAt.toDate(),
    } as User;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile.");
  }
};

/**
 * Fetches a user's settings from Firestore.
 * @param userId - The user's Firebase UID.
 * @returns The user settings object or null if not found.
 * @throws Will throw an error if fetching fails.
 */
export const getUserSettings = async (userId: string): Promise<UserSettings | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return null;
    }
    
    return userSnap.data().settings as UserSettings;
  } catch (error) {
    console.error("Error fetching user settings:", error);
    throw new Error("Failed to fetch user settings.");
  }
};

/**
 * Updates a user's settings in Firestore.
 * @param userId - The user's Firebase UID.
 * @param settings - The partial settings object to update.
 * @throws Will throw an error if the update fails.
 */
export const updateUserSettings = async (
  userId: string,
  settings: Partial<UserSettings>
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      'settings': settings,
    });
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw new Error("Failed to update user settings.");
  }
};
