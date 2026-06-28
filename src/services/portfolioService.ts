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

/**
 * সব পোর্টফোলিও আইটেম ডাটাবেস থেকে নিয়ে আসার জন্য।
 * @param onlyActive - যদি true হয়, তবে শুধু পাবলিকলি দৃশ্যমান আইটেমগুলো আসবে।
 */
export const getAllPortfolioItems = async (onlyActive: boolean = false): Promise<PortfolioItem[]> => {
  try {
    let q;
    if (onlyActive) {
      q = query(
        collection(db, PORTFOLIO_COLLECTION), 
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        collection(db, PORTFOLIO_COLLECTION), 
        orderBy('createdAt', 'desc')
      );
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as PortfolioItem[];
  } catch (error) {
    console.error("Error fetching portfolio items:", error);
    throw error;
  }
};

/**
 * নতুন পোর্টফোলিও আইটেম যোগ করার জন্য।
 * @param data - পোর্টফোলিও আইটেমের ডাটা (id এবং createdAt ছাড়া)।
 */
export const addPortfolioItem = async (data: Omit<PortfolioItem, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, PORTFOLIO_COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      // নিশ্চিত করা হচ্ছে যে ডাটাগুলো সঠিক ফরম্যাটে আছে
      status: data.status || 'active',
      cloudinaryPublicIds: data.cloudinaryPublicIds || [],
      description: data.description || '',
      title: data.title || 'Untitled Project',
      category: data.category || 'Uncategorized'
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding portfolio item:", error);
    throw error;
  }
};

/**
 * কোনো পোর্টফোলিও আইটেমের তথ্য আপডেট করার জন্য।
 */
export const updatePortfolioItem = async (id: string, data: Partial<PortfolioItem>) => {
  try {
    const docRef = doc(db, PORTFOLIO_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating portfolio item:", error);
    throw error;
  }
};

/**
 * পোর্টফোলিও আইটেম ডাটাবেস থেকে ডিলিট করার জন্য।
 */
export const deletePortfolioItem = async (id: string) => {
  try {
    const docRef = doc(db, PORTFOLIO_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting portfolio item:", error);
    throw error;
  }
};