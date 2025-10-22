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

/**
 * Creates a new task for a user.
 * @param userId - The user's Firebase UID.
 * @param taskData - The data for the new task.
 * @returns The created task with its ID.
 * @throws Will throw an error if the task creation fails.
 */
export const createTask = async (
  userId: string, 
  taskData: CreateTaskInput
): Promise<Task> => {
  try {
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
  } catch (error) {
    console.error("Error creating task:", error);
    throw new Error("Failed to create task.");
  }
};

/**
 * Fetches tasks for a user, with optional filters.
 * @param userId - The user's Firebase UID.
 * @param filters - Optional filters for date, project, and completion status.
 * @returns An array of tasks.
 * @throws Will throw an error if fetching fails.
 */
export const getTasks = async (
  userId: string,
  filters?: {
    date?: Date;
    projectId?: string;
    isCompleted?: boolean;
  }
): Promise<Task[]> => {
  try {
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
  } catch (error) {
    console.error("Error getting tasks:", error);
    throw new Error("Failed to get tasks.");
  }
};

/**
 * Fetches a single task by its ID.
 * @param userId - The user's Firebase UID.
 * @param taskId - The ID of the task to fetch.
 * @returns The task object or null if not found.
 * @throws Will throw an error if fetching fails.
 */
export const getTaskById = async (
  userId: string, 
  taskId: string
): Promise<Task | null> => {
  try {
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
  } catch (error) {
    console.error("Error getting task by ID:", error);
    throw new Error("Failed to get task.");
  }
};

/**
 * Updates a task in Firestore.
 * @param userId - The user's Firebase UID.
 * @param taskId - The ID of the task to update.
 * @param updates - The partial task object with updates.
 * @throws Will throw an error if the update fails.
 */
export const updateTask = async (
  userId: string,
  taskId: string,
  updates: UpdateTaskInput
): Promise<void> => {
  try {
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
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error("Failed to update task.");
  }
};

/**
 * Toggles the completion status of a task.
 * @param userId - The user's Firebase UID.
 * @param taskId - The ID of the task to update.
 * @param isCompleted - The new completion status.
 * @throws Will throw an error if the update fails.
 */
export const toggleTaskCompletion = async (
  userId: string,
  taskId: string,
  isCompleted: boolean
): Promise<void> => {
  try {
    const taskRef = doc(db, 'users', userId, 'tasks', taskId);
    
    await updateDoc(taskRef, {
      isCompleted,
      completedAt: isCompleted ? Timestamp.now() : null,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error toggling task completion:", error);
    throw new Error("Failed to toggle task completion.");
  }
};

/**
 * Deletes a task from Firestore.
 * @param userId - The user's Firebase UID.
 * @param taskId - The ID of the task to delete.
 * @throws Will throw an error if the deletion fails.
 */
export const deleteTask = async (
  userId: string,
  taskId: string
): Promise<void> => {
  try {
    const taskRef = doc(db, 'users', userId, 'tasks', taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error("Failed to delete task.");
  }
};

/**
 * Reorders tasks using a batch write.
 * @param userId - The user's Firebase UID.
 * @param taskIds - An array of task IDs in the new order.
 * @throws Will throw an error if the reordering fails.
 */
export const reorderTasks = async (
  userId: string,
  taskIds: string[]
): Promise<void> => {
  try {
    const batch = writeBatch(db);
    
    taskIds.forEach((taskId, index) => {
      const taskRef = doc(db, 'users', userId, 'tasks', taskId);
      batch.update(taskRef, { order: index });
    });
    
    await batch.commit();
  } catch (error) {
    console.error("Error reordering tasks:", error);
    throw new Error("Failed to reorder tasks.");
  }
};
