import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  where 
} from 'firebase/firestore';
import { db } from './firebase';
import type { UserData } from '../types/user.types';

/**
 * ডাটাবেস থেকে নির্দিষ্ট ইউজারের প্রোফাইল তথ্য সংগ্রহ করার ফাংশন
 * @param uid - ইউজারের ইউনিক আইডি
 */
export const getUserById = async (uid: string): Promise<UserData | null> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return userDocSnap.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('ইউজারের তথ্য খুঁজে পাওয়া যায়নি।');
  }
};

/**
 * ইউজারের প্রোফাইল আপডেট করার ফাংশন (অ্যাডমিন এবং ইউজার উভয়ই ব্যবহার করতে পারবে)
 * @param uid - ইউজারের ইউনিক আইডি
 * @param data - যে ডাটাগুলো আপডেট করতে হবে
 */
export const updateUserProfile = async (
  uid: string, 
  data: Partial<UserData>
): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    
    await updateDoc(userDocRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error('প্রোফাইল আপডেট করতে সমস্যা হয়েছে।');
  }
};

/**
 * সকল ক্লায়েন্ট বা ইউজারদের তালিকা সংগ্রহ করার ফাংশন (অ্যাডমিন প্যানেলের জন্য)
 * এটি নতুন ইউজারদের তালিকার উপরে দেখাবে।
 */
export const getAllUsers = async (): Promise<UserData[]> => {
  try {
    const usersRef = collection(db, 'users');
    // নতুন ইউজাররা যেন আগে থাকে তাই createdAt অনুযায়ী desc সর্টিং করা হয়েছে
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    })) as UserData[];
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw new Error('ইউজার তালিকা সংগ্রহ করতে সমস্যা হয়েছে।');
  }
};

/**
 * শুধুমাত্র নির্দিষ্ট রোলের ইউজারদের খুঁজে বের করার ফাংশন (যেমন: শুধু 'client' দের দেখতে চাইলে)
 */
export const getUsersByRole = async (role: 'admin' | 'client'): Promise<UserData[]> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('role', '==', role), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    })) as UserData[];
  } catch (error) {
    console.error(`Error fetching ${role} users:`, error);
    throw new Error(`${role} তালিকা পাওয়া যায়নি।`);
  }
};