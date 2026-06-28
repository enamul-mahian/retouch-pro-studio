import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  serverTimestamp,
  type DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
import type { Service } from '../types/service.types';

const SERVICES_COLLECTION = 'services';

/**
 * নতুন সার্ভিস তৈরি করা
 */
export const createService = async (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, SERVICES_COLLECTION), {
      ...serviceData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    throw new Error('সার্ভিসটি সেভ করতে সমস্যা হয়েছে।');
  }
};

/**
 * সব সার্ভিস নিয়ে আসা (অ্যাডমিন)
 */
export const getAllServices = async (): Promise<Service[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, SERVICES_COLLECTION));
    const services = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
    })) as Service[];
    
    // লোকালভাবে সাজানো (কোনো ইনডেক্স লাগবে না)
    return services.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    throw new Error('সবগুলো সার্ভিস লোড করা সম্ভব হয়নি।');
  }
};

/**
 * পাবলিক ওয়েবসাইটের জন্য সার্ভিস আনা (ইনডেক্স মুক্ত)
 */
export const getActiveServices = async (): Promise<Service[]> => {
  try {
    const q = query(collection(db, SERVICES_COLLECTION), where('status', '==', 'active'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Service[];
  } catch (error) {
    console.error('Error fetching active services:', error);
    return [];
  }
};

/**
 * স্লাগ দিয়ে সার্ভিস খোঁজা
 */
export const getServiceBySlug = async (slug: string): Promise<Service | null> => {
  try {
    const q = query(collection(db, SERVICES_COLLECTION), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as Service;
  } catch (error) {
    return null;
  }
};

/**
 * সার্ভিস আপডেট
 */
export const updateService = async (id: string, data: Partial<Service>): Promise<void> => {
  try {
    const docRef = doc(db, SERVICES_COLLECTION, id);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  } catch (error) {
    throw new Error('সার্ভিস আপডেট করতে সমস্যা হয়েছে।');
  }
};

/**
 * সার্ভিস ডিলিট
 */
export const deleteService = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, SERVICES_COLLECTION, id));
  } catch (error) {
    throw new Error('সার্ভিস ডিলিট করা সম্ভব হয়নি।');
  }
};