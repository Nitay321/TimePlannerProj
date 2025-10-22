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

export const createProject = async (
  userId: string,
  projectData: CreateProjectInput
): Promise<Project> => {
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
};

export const getProjects = async (userId: string): Promise<Project[]> => {
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
};

export const getProjectById = async (
  userId: string,
  projectId: string
): Promise<Project | null> => {
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
};

export const updateProject = async (
  userId: string,
  projectId: string,
  updates: UpdateProjectInput
): Promise<void> => {
  const projectRef = doc(db, 'users', userId, 'projects', projectId);
  
  await updateDoc(projectRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

export const deleteProject = async (
  userId: string,
  projectId: string,
  deleteTasks: boolean = false
): Promise<void> => {
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
};

export const getProjectStats = async (
  userId: string,
  projectId: string
): Promise<{ total: number; completed: number; percentage: number }> => {
  const tasksRef = collection(db, 'users', userId, 'tasks');
  const q = query(tasksRef, where('projectId', '==', projectId));
  const snapshot = await getDocs(q);
  
  const total = snapshot.size;
  const completed = snapshot.docs.filter(doc => doc.data().isCompleted).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return { total, completed, percentage };
};
