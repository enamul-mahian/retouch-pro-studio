import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface LegalPage {
  id: string; // 'privacy-policy', 'terms-conditions', 'refund-policy'
  title: string;
  content: string; // Rich Text Content
  seoTitle: string;
  seoDescription: string;
  updatedAt: any;
}

/**
 * যেকোনো একটি লিগ্যাল পেজের ডাটা নিয়ে আসা
 */
export const getLegalPage = async (pageId: string): Promise<LegalPage | null> => {
  try {
    const docRef = doc(db, 'legalPages', pageId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as LegalPage;
    }
    return null;
  } catch (error) {
    console.error('Error fetching legal page:', error);
    return null;
  }
};

/**
 * লিগ্যাল পেজের ডাটা আপডেট করা (অ্যাডমিন)
 */
export const updateLegalPage = async (pageId: string, data: Partial<LegalPage>): Promise<void> => {
  try {
    const docRef = doc(db, 'legalPages', pageId);
    await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.error('Error updating legal page:', error);
    throw new Error('লিগ্যাল পেজ আপডেট করতে সমস্যা হয়েছে।');
  }
};