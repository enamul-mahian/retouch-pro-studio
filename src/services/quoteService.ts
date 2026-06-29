import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  doc, 
  getDoc,
  updateDoc,
  addDoc,
  type DocumentData,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { QuoteRequest, QuoteStatus } from '../types/quote.types';

const QUOTE_COLLECTION = 'quoteRequests';

export const getUserQuotes = async (userId: string): Promise<QuoteRequest[]> => {
  const q = query(collection(db, QUOTE_COLLECTION), where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as QuoteRequest[];
};

export const getAllQuotes = async (): Promise<QuoteRequest[]> => {
  const q = query(collection(db, QUOTE_COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as QuoteRequest[];
};

export const updateQuoteStatus = async (quoteId: string, status: QuoteStatus, adminNote?: string): Promise<void> => {
  const docRef = doc(db, QUOTE_COLLECTION, quoteId);
  
  if (status === 'approved') {
    const quoteSnap = await getDoc(docRef);
    if (quoteSnap.exists()) {
      const quoteData = quoteSnap.data() as any;
      await addDoc(collection(db, 'orders'), {
        userId: quoteData.userId || 'unknown_user',
        quoteId: quoteId,
        title: `Order for ${quoteData.serviceType}`,
        serviceType: quoteData.serviceType,
        amount: parseFloat(adminNote || '0'),
        orderStatus: 'pending',
        paymentStatus: 'unpaid',
        createdAt: serverTimestamp()
      });
    }
  }

  await updateDoc(docRef, { status, adminNote: adminNote || '', updatedAt: serverTimestamp() });
};

export const calculateQuoteStats = (quotes: QuoteRequest[]) => {
  return {
    total: quotes.length,
    pending: quotes.filter(q => q.status === 'pending').length,
    reviewed: quotes.filter(q => q.status === 'reviewed').length,
    approved: quotes.filter(q => q.status === 'approved').length,
    completed: quotes.filter(q => q.status === 'completed').length,
  };
};