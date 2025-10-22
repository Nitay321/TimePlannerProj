export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
}

export interface TimePeriod {
  start: string; // "06:00"
  end: string;   // "12:00"
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  defaultView: 'month' | 'week' | 'day';
  weekStartDay: 0 | 1;
  timePeriods: {
    morning: TimePeriod;
    noon: TimePeriod;
    afternoon: TimePeriod;
    evening: TimePeriod;
    night: TimePeriod;
  };
  calendarStartHour: number;
  calendarEndHour: number;
  timeIncrement: 15 | 30 | 60;
  taskTypes: TaskType[];
}

export interface TaskType {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  date: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  isCompleted: boolean;
  completedAt: Date | null;
  color: string;
  projectId: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  isCompleted: boolean;
  completedAt: Date | null;
}

export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>;
export type UpdateTaskInput = Partial<CreateTaskInput>;

export type CreateProjectInput = Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>;
export type UpdateProjectInput = Partial<CreateProjectInput>;

export interface TimeSlot {
  date: Date;
  startTime: Date;
  endTime: Date;
}
