import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp, type DocumentData } from 'firebase/firestore';
import { db } from './firebase';
import type { BlogPost } from '../types/blog.types';

const BLOG_COLLECTION = 'blogPosts';

export const getAllBlogs = async (): Promise<BlogPost[]> => {
  const q = query(collection(db, BLOG_COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BlogPost[];
};

export const createBlog = async (data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
  return await addDoc(collection(db, BLOG_COLLECTION), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
};

export const updateBlog = async (id: string, data: Partial<BlogPost>) => {
  await updateDoc(doc(db, BLOG_COLLECTION, id), { ...data, updatedAt: serverTimestamp() });
};

export const deleteBlog = async (id: string) => {
  await deleteDoc(doc(db, BLOG_COLLECTION, id));
};