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
import type { Project, CreateProjectInput, UpdateProjectInput } from '@/types';

/**
 * Creates a new project for a user.
 * @param userId - The user's Firebase UID.
 * @param projectData - The data for the new project.
 * @returns The created project with its ID.
 * @throws Will throw an error if the project creation fails.
 */
export const createProject = async (
  userId: string,
  projectData: CreateProjectInput
): Promise<Project> => {
  try {
    const projectsRef = collection(db, 'users', userId, 'projects');
    
    const newProject = {
      ...projectData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      isCompleted: false,
      completedAt: null,
    };
    
    const docRef = await addDoc(projectsRef, newProject);
    
    return {
      id: docRef.id,
      ...newProject,
      createdAt: newProject.createdAt.toDate(),
      updatedAt: newProject.updatedAt.toDate(),
    } as Project;
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error("Failed to create project.");
  }
};

/**
 * Fetches all projects for a user.
 * @param userId - The user's Firebase UID.
 * @returns An array of projects.
 * @throws Will throw an error if fetching fails.
 */
export const getProjects = async (userId: string): Promise<Project[]> => {
  try {
    const projectsRef = collection(db, 'users', userId, 'projects');
    const q = query(projectsRef, orderBy('createdAt', 'desc'));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
      completedAt: doc.data().completedAt?.toDate() || null,
    })) as Project[];
  } catch (error) {
    console.error("Error getting projects:", error);
    throw new Error("Failed to get projects.");
  }
};

/**
 * Fetches a single project by its ID.
 * @param userId - The user's Firebase UID.
 * @param projectId - The ID of the project to fetch.
 * @returns The project object or null if not found.
 * @throws Will throw an error if fetching fails.
 */
export const getProjectById = async (
  userId: string,
  projectId: string
): Promise<Project | null> => {
  try {
    const projectRef = doc(db, 'users', userId, 'projects', projectId);
    const projectSnap = await getDoc(projectRef);
    
    if (!projectSnap.exists()) {
      return null;
    }
    
    const data = projectSnap.data();
    return {
      id: projectSnap.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      completedAt: data.completedAt?.toDate() || null,
    } as Project;
  } catch (error) {
    console.error("Error getting project by ID:", error);
    throw new Error("Failed to get project.");
  }
};

/**
 * Updates a project in Firestore.
 * @param userId - The user's Firebase UID.
 * @param projectId - The ID of the project to update.
 * @param updates - The partial project object with updates.
 * @throws Will throw an error if the update fails.
 */
export const updateProject = async (
  userId: string,
  projectId: string,
  updates: UpdateProjectInput
): Promise<void> => {
  try {
    const projectRef = doc(db, 'users', userId, 'projects', projectId);
    
    await updateDoc(projectRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating project:", error);
    throw new Error("Failed to update project.");
  }
};

/**
 * Deletes a project from Firestore.
 * @param userId - The user's Firebase UID.
 * @param projectId - The ID of the project to delete.
 * @param deleteTasks - Whether to delete the tasks associated with the project.
 * @throws Will throw an error if the deletion fails.
 */
export const deleteProject = async (
  userId: string,
  projectId: string,
  deleteTasks: boolean = false
): Promise<void> => {
  try {
    const projectRef = doc(db, 'users', userId, 'projects', projectId);
    
    if (deleteTasks) {
      const tasksRef = collection(db, 'users', userId, 'tasks');
      const q = query(tasksRef, where('projectId', '==', projectId));
      const snapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    } else {
      const tasksRef = collection(db, 'users', userId, 'tasks');
      const q = query(tasksRef, where('projectId', '==', projectId));
      const snapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { projectId: null });
      });
      await batch.commit();
    }
    
    await deleteDoc(projectRef);
  } catch (error) {
    console.error("Error deleting project:", error);
    throw new Error("Failed to delete project.");
  }
};

/**
 * Gets statistics for a project.
 * @param userId - The user's Firebase UID.
 * @param projectId - The ID of the project.
 * @returns An object with total, completed, and percentage of tasks.
 * @throws Will throw an error if fetching fails.
 */
export const getProjectStats = async (
  userId: string,
  projectId: string
): Promise<{ total: number; completed: number; percentage: number }> => {
  try {
    const tasksRef = collection(db, 'users', userId, 'tasks');
    const q = query(tasksRef, where('projectId', '==', projectId));
    const snapshot = await getDocs(q);
    
    const total = snapshot.size;
    const completed = snapshot.docs.filter(doc => doc.data().isCompleted).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, percentage };
  } catch (error) {
    console.error("Error getting project stats:", error);
    throw new Error("Failed to get project stats.");
  }
};
