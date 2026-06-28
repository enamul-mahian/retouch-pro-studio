import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { PaymentRecord } from '../types/payment.types';

const PAYMENT_COLLECTION = 'payments';

/**
 * পেমেন্ট রেকর্ড ডাটাবেসে সেভ করা
 */
export const recordPayment = async (paymentData: Omit<PaymentRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
  return await addDoc(collection(db, PAYMENT_COLLECTION), {
    ...paymentData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

/**
 * ক্লায়েন্টের নিজস্ব পেমেন্ট হিস্ট্রি দেখা
 */
export const getClientPayments = async (clientId: string): Promise<PaymentRecord[]> => {
  const q = query(
    collection(db, PAYMENT_COLLECTION), 
    where('clientId', '==', clientId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PaymentRecord[];
};