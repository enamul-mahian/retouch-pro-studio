import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import type { PricingPackage } from '../types/package.types';

const PACKAGES_COLLECTION = 'pricingPackages';

/**
 * সব প্যাকেজ ডাটাবেস থেকে নিয়ে আসার জন্য (অ্যাডমিন প্যানেলের জন্য)
 */
export const getAllPackages = async (): Promise<PricingPackage[]> => {
  try {
    const q = query(
      collection(db, PACKAGES_COLLECTION), 
      orderBy('displayOrder', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as PricingPackage[];
  } catch (error) {
    console.error("Error fetching all packages:", error);
    throw error;
  }
};

/**
 * নির্দিষ্ট ক্যাটাগরি অনুযায়ী প্যাকেজ নিয়ে আসার জন্য (পাবলিক প্রাইসিং পেজের জন্য)
 * বিঃদ্রঃ ফায়ারবেস Composite Index Error এড়ানোর জন্য ডাটা ফেচ করে In-memory ফিল্টার ও সর্ট করা হয়েছে।
 */
export const getPackagesByCategory = async (category: 'image-editing' | 'video-editing'): Promise<PricingPackage[]> => {
  try {
    // কোনো where বা orderBy ছাড়া সব ডাটা নিয়ে আসছি (ইনডেক্সিং এরর এড়াতে)
    const snapshot = await getDocs(collection(db, PACKAGES_COLLECTION));
    
    const allPackages = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as PricingPackage[];

    // কোডের মাধ্যমে ফিল্টার এবং সর্ট করা হচ্ছে
    const filteredPackages = allPackages
      .filter(pkg => pkg.category === category && pkg.status === 'active')
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    return filteredPackages;
  } catch (error) {
    console.error("Error fetching packages by category:", error);
    throw error;
  }
};

/**
 * নতুন প্রাইসিং প্যাকেজ যোগ করার জন্য
 */
export const addPackage = async (data: Omit<PricingPackage, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, PACKAGES_COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding package:", error);
    throw error;
  }
};

/**
 * বিদ্যমান প্যাকেজ আপডেট করার জন্য
 */
export const updatePackage = async (id: string, data: Partial<PricingPackage>) => {
  try {
    const docRef = doc(db, PACKAGES_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating package:", error);
    throw error;
  }
};

/**
 * প্যাকেজ ডাটাবেস থেকে ডিলিট করার জন্য
 */
export const deletePackage = async (id: string) => {
  try {
    const docRef = doc(db, PACKAGES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting package:", error);
    throw error;
  }
};