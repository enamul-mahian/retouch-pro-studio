import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import type { Teammate, AssignedTask } from '../types/teammate.types';

const TEAMMATES_COLLECTION = 'teammates';
const TASKS_COLLECTION = 'assignedTasks';

// --- Teammate Management Functions ---

export const getAllTeammates = async (): Promise<Teammate[]> => {
  const q = query(collection(db, TEAMMATES_COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Teammate[];
};

export const addTeammate = async (data: Omit<Teammate, 'id' | 'createdAt'>) => {
  return await addDoc(collection(db, TEAMMATES_COLLECTION), { 
    ...data, 
    createdAt: serverTimestamp() 
  });
};

export const updateTeammate = async (id: string, data: Partial<Teammate>) => {
  await updateDoc(doc(db, TEAMMATES_COLLECTION, id), { ...data });
};

export const deleteTeammate = async (id: string) => {
  await deleteDoc(doc(db, TEAMMATES_COLLECTION, id));
};

// --- Task Assignment & Management Functions ---

export const assignTask = async (data: Omit<AssignedTask, 'id' | 'assignedAt'>) => {
  return await addDoc(collection(db, TASKS_COLLECTION), { 
    ...data, 
    assignedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const getTasksByOrderId = async (orderId: string): Promise<AssignedTask[]> => {
  const q = query(collection(db, TASKS_COLLECTION), where('orderId', '==', orderId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AssignedTask[];
};

export const updateTask = async (taskId: string, data: Partial<AssignedTask>) => {
  await updateDoc(doc(db, TASKS_COLLECTION, taskId), { 
    ...data, 
    updatedAt: serverTimestamp() 
  });
};