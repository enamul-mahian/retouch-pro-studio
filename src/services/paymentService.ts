import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import type { PaymentRecord } from '../types/payment.types';

const PAYMENT_COLLECTION = 'payments';

export const getClientPayments = async (clientId: string): Promise<PaymentRecord[]> => {
  const q = query(collection(db, PAYMENT_COLLECTION), where('clientId', '==', clientId));
  const snapshot = await getDocs(q);
  const payments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PaymentRecord[];
  payments.sort((a, b) => new Date(b.createdAt?.seconds * 1000).getTime() - new Date(a.createdAt?.seconds * 1000).getTime());
  return payments;
};