import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import type { SiteSettings } from '../types/settings.types';

const SETTINGS_COLLECTION = 'siteSettings';
const SETTINGS_DOC_ID = 'global'; // আমরা সবসময় এই একটি আইডিতেই সেটিংস রাখবো

/**
 * ডাটাবেস থেকে ওয়েবসাইটের গ্লোবাল সেটিংস নিয়ে আসার ফাংশন
 */
export const getSiteSettings = async (): Promise<SiteSettings | null> => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as SiteSettings;
    }
    return null;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    throw error;
  }
};

/**
 * ওয়েবসাইটের সেটিংস আপডেট বা তৈরি করার ফাংশন
 * @param data - সেটিংসের ডাটা (Partial ব্যবহার করা হয়েছে যাতে শুধু নির্দিষ্ট ফিল্ডও আপডেট করা যায়)
 */
export const updateSiteSettings = async (data: Partial<SiteSettings>): Promise<void> => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    
    // setDoc with merge: true ব্যবহার করা হয়েছে যাতে ডকুমেন্ট না থাকলে তৈরি হয়, 
    // আর থাকলে শুধু নতুন ডাটাগুলো আপডেট হয়।
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
  } catch (error) {
    console.error("Error updating site settings:", error);
    throw error;
  }
};

/**
 * ডিফল্ট সেটিংস ইনশিয়ালাইজ করার ফাংশন (যদি ডাটাবেস একদম খালি থাকে)
 */
export const initializeDefaultSettings = async (defaultData: SiteSettings): Promise<void> => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, {
        ...defaultData,
        updatedAt: serverTimestamp()
      });
      console.log("Default settings initialized.");
    }
  } catch (error) {
    console.error("Error initializing settings:", error);
  }
};