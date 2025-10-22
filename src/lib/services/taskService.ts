import { db } from '@/lib/firebase/config';
import {
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy,
  Timestamp, 
  writeBatch
} from 'firebase/firestore';
import type { Task, CreateTaskInput, UpdateTaskInput } from '@/types';

export const createTask = async (
  userId: string, 
  taskData: CreateTaskInput
): Promise<Task> => {
  const tasksRef = collection(db, 'users', userId, 'tasks');
  
  const newTask = {
    ...taskData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    isCompleted: false,
    completedAt: null,
  };
  
  const docRef = await addDoc(tasksRef, newTask);
  
  return {
    id: docRef.id,
    ...newTask,
    createdAt: newTask.createdAt.toDate(),
    updatedAt: newTask.updatedAt.toDate(),
  } as Task;
};

export const getTasks = async (
  userId: string,
  filters?: {
    date?: Date;
    projectId?: string;
    isCompleted?: boolean;
  }
): Promise<Task[]> => {
  const tasksRef = collection(db, 'users', userId, 'tasks');
  let q = query(tasksRef);
  
  if (filters?.date) {
    const startOfDay = new Date(filters.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(filters.date);
    endOfDay.setHours(23, 59, 59, 999);
    
    q = query(
      q,
      where('date', '>=', Timestamp.fromDate(startOfDay)),
      where('date', '<=', Timestamp.fromDate(endOfDay))
    );
  }
  
  if (filters?.projectId) {
    q = query(q, where('projectId', '==', filters.projectId));
  }
  
  if (filters?.isCompleted !== undefined) {
    q = query(q, where('isCompleted', '==', filters.isCompleted));
  }
  
  q = query(q, orderBy('order', 'asc'));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate() || null,
    startTime: doc.data().startTime?.toDate() || null,
    endTime: doc.data().endTime?.toDate() || null,
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
    completedAt: doc.data().completedAt?.toDate() || null,
  })) as Task[];
};

export const getTaskById = async (
  userId: string, 
  taskId: string
): Promise<Task | null> => {
  const taskRef = doc(db, 'users', userId, 'tasks', taskId);
  const taskSnap = await getDoc(taskRef);
  
  if (!taskSnap.exists()) {
    return null;
  }
  
  const data = taskSnap.data();
  return {
    id: taskSnap.id,
    ...data,
    date: data.date?.toDate() || null,
    startTime: data.startTime?.toDate() || null,
    endTime: data.endTime?.toDate() || null,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
    completedAt: data.completedAt?.toDate() || null,
  } as Task;
};

export const updateTask = async (
  userId: string,
  taskId: string,
  updates: UpdateTaskInput
): Promise<void> => {
  const taskRef = doc(db, 'users', userId, 'tasks', taskId);
  
  const updateData: any = {
    ...updates,
    updatedAt: Timestamp.now(),
  };
  
  if (updates.date !== undefined) {
    updateData.date = updates.date ? Timestamp.fromDate(updates.date) : null;
  }
  if (updates.startTime !== undefined) {
    updateData.startTime = updates.startTime ? Timestamp.fromDate(updates.startTime) : null;
  }
  if (updates.endTime !== undefined) {
    updateData.endTime = updates.endTime ? Timestamp.fromDate(updates.endTime) : null;
  }
  
  await updateDoc(taskRef, updateData);
};

export const toggleTaskCompletion = async (
  userId: string,
  taskId: string,
  isCompleted: boolean
): Promise<void> => {
  const taskRef = doc(db, 'users', userId, 'tasks', taskId);
  
  await updateDoc(taskRef, {
    isCompleted,
    completedAt: isCompleted ? Timestamp.now() : null,
    updatedAt: Timestamp.now(),
  });
};

export const deleteTask = async (
  userId: string,
  taskId: string
): Promise<void> => {
  const taskRef = doc(db, 'users', userId, 'tasks', taskId);
  await deleteDoc(taskRef);
};

export const reorderTasks = async (
  userId: string,
  taskIds: string[]
): Promise<void> => {
  const batch = writeBatch(db);
  
  taskIds.forEach((taskId, index) => {
    const taskRef = doc(db, 'users', userId, 'tasks', taskId);
    batch.update(taskRef, { order: index });
  });
  
  await batch.commit();
};
