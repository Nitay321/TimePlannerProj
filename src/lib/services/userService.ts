import { db } from '@/lib/firebase/config';
import { doc, setDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import type { User, UserSettings } from '@/types';

export const createUserProfile = async (
  user: { uid: string; email: string | null; displayName?: string | null }
): Promise<void> => {
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
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
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
};

export const getUserSettings = async (userId: string): Promise<UserSettings | null> => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    return null;
  }
  
  return userSnap.data().settings as UserSettings;
};

export const updateUserSettings = async (
  userId: string,
  settings: Partial<UserSettings>
): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  
  await updateDoc(userRef, {
    'settings': settings,
  });
};
