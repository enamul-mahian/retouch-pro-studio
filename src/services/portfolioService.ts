import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp,
  where
} from 'firebase/firestore';
import { db } from './firebase';
import type { PortfolioItem } from '../types/portfolio.types';

const PORTFOLIO_COLLECTION = 'portfolioItems';

export const getAllPortfolioItems = async (onlyActive: boolean = false): Promise<PortfolioItem[]> => {
  let q;
  if (onlyActive) {
    q = query(collection(db, PORTFOLIO_COLLECTION), where('status', '==', 'active'), orderBy('createdAt', 'desc'));
  } else {
    q = query(collection(db, PORTFOLIO_COLLECTION), orderBy('createdAt', 'desc'));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data() as any;
    return {
      id: doc.id,
      title: data.title || '',
      category: data.category || '',
      beforeImageUrl: data.beforeImageUrl || '',
      afterImageUrl: data.afterImageUrl || '',
      cloudinaryPublicIds: data.cloudinaryPublicIds || [],
      description: data.description || '',
      status: data.status || 'active',
      createdAt: data.createdAt
    } as PortfolioItem;
  });
};

export const addPortfolioItem = async (data: any) => {
  try {
    const portfolioDoc = {
      title: data.title,
      category: data.category,
      beforeImageUrl: data.beforeImageUrl,
      afterImageUrl: data.afterImageUrl,
      cloudinaryPublicIds: data.cloudinaryPublicIds || [],
      description: data.description || '',
      status: data.status || 'active',
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, PORTFOLIO_COLLECTION), portfolioDoc);
    return docRef.id;
  } catch (error) {
    console.error("Error adding portfolio item:", error);
    throw error;
  }
};

export const updatePortfolioItem = async (id: string, data: Partial<PortfolioItem>) => {
  const docRef = doc(db, PORTFOLIO_COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const deletePortfolioItem = async (id: string) => {
  await deleteDoc(doc(db, PORTFOLIO_COLLECTION, id));
};