import type { Timestamp } from 'firebase/firestore';

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  createdAt: Timestamp;
  photoURL?: string;
  settings?: UserSettings;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  type: 'school' | 'work' | 'love' | string; // custom type
  difficulty: 1 | 2 | 3 | 4 | 5;
  date: Timestamp | null;
  startTime: Timestamp | null;
  endTime: Timestamp | null;
  isCompleted: boolean;
  color: string;
  projectId: string | null;
  createdAt: Timestamp;
  completedAt: Timestamp | null;
  order: number;
  taskType: 'task' | 'event' | 'meeting' | 'birthday';
  isRecurring: boolean;
  recurrenceRule?: string;
};

export type Project = {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: Timestamp;
  taskIds: string[];
  isCompleted: boolean;
};

export type UserSettings = {
  timePeriods: {
    morning: { start: string; end: string };
    noon: { start:string; end: string };
    afternoon: { start: string; end: string };
    evening: { start: string; end: string };
    night: { start: string; end: string };
  };
  calendar: {
    weekStartDay: 'Sunday' | 'Monday';
    startHour: number;
    endHour: number;
    timeIncrement: 15 | 30 | 60;
    defaultView: 'Month' | 'Week' | 'Day';
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    accentColor: string;
    fontSize: 'sm' | 'base' | 'lg';
    density: 'compact' | 'comfortable';
  };
  customTaskTypes: { name: string; color: string }[];
};

export type TimeSlot = {
  start: Date;
  end: Date;
};
