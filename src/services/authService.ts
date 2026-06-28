import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  type User as FirebaseUser 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { UserData } from '../types/user.types';

/**
 * ফায়ারস্টোর থেকে ইউজারের ডাটা নিয়ে আসার ফাংশন
 */
export const getUserProfile = async (uid: string): Promise<UserData | null> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('ইউজারের তথ্য আনতে সমস্যা হয়েছে।');
  }
};

/**
 * নতুন ক্লায়েন্ট রেজিস্ট্রেশন করার ফাংশন
 */
export interface RegisterData {
  name: string;
  email: string;
  password?: string;
  phone: string;
  country: string;
  companyName: string;
}

export const registerUser = async (data: RegisterData): Promise<UserData> => {
  try {
    if (!data.password) {
      throw new Error('পাসওয়ার্ড দেওয়া আবশ্যক।');
    }

    // ১. ফায়ারবেস অথেন্টিকেশনে ইউজার তৈরি করা
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const firebaseUser: FirebaseUser = userCredential.user;

    // ২. ফায়ারস্টোর ডাটাবেসে সেভ করার জন্য ইউজারের অবজেক্ট তৈরি করা
    const newUser: UserData = {
      uid: firebaseUser.uid,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'client', // বাই ডিফল্ট সবাই ক্লায়েন্ট হিসেবে রেজিস্টার হবে
      country: data.country,
      companyName: data.companyName,
      photoURL: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // ৩. ফায়ারস্টোরের 'users' কালেকশনে ইউজারের ডাটা সেভ করা
    await setDoc(doc(db, 'users', firebaseUser.uid), newUser);

    return newUser;
  } catch (error: any) {
    console.error('Registration Error:', error);
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট খোলা আছে।');
    }
    throw new Error('অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
  }
};

/**
 * ইউজার লগিন করার ফাংশন
 */
export const loginUser = async (email: string, password: string): Promise<UserData> => {
  try {
    // ১. ইমেইল ও পাসওয়ার্ড দিয়ে লগিন করা
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // ২. ডাটাবেস থেকে ইউজারের সম্পূর্ণ প্রোফাইল (রোল সহ) নিয়ে আসা
    const userProfile = await getUserProfile(firebaseUser.uid);

    if (!userProfile) {
      throw new Error('ইউজারের প্রোফাইল ডাটাবেসে পাওয়া যায়নি।');
    }

    return userProfile;
  } catch (error: any) {
    console.error('Login Error:', error);
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new Error('ইমেইল অথবা পাসওয়ার্ড ভুল হয়েছে।');
    }
    throw new Error('লগিন করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
  }
};

/**
 * ইউজার লগআউট করার ফাংশন
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout Error:', error);
    throw new Error('লগআউট করতে সমস্যা হয়েছে।');
  }
};