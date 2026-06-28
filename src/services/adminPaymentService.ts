import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';
import type { PaymentRecord } from '../types/payment.types';

export const getAllPayments = async (): Promise<PaymentRecord[]> => {
  const q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PaymentRecord[];
};