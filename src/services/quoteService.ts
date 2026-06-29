import { collection, query, where, getDocs, doc, getDoc, updateDoc, addDoc, serverTimestamp, type DocumentData, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import type { QuoteRequest, QuoteStatus } from '../types/quote.types';

const QUOTE_COLLECTION = 'quoteRequests';
const ORDER_COLLECTION = 'orders';

export const getUserQuotes = async (userId: string): Promise<QuoteRequest[]> => {
  const q = query(collection(db, QUOTE_COLLECTION), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  const quotes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as QuoteRequest[];
  quotes.sort((a, b) => new Date(b.createdAt?.seconds * 1000).getTime() - new Date(a.createdAt?.seconds * 1000).getTime());
  return quotes;
};

export const getAllQuotes = async (): Promise<QuoteRequest[]> => {
  const q = query(collection(db, QUOTE_COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as QuoteRequest[];
};

export const updateQuoteStatus = async (quoteId: string, status: QuoteStatus, adminNote?: string): Promise<void> => {
  await updateDoc(doc(db, QUOTE_COLLECTION, quoteId), { status, adminNote: adminNote || '', updatedAt: serverTimestamp() });
};

export const createOrderFromQuote = async (quote: QuoteRequest, price: number): Promise<void> => {
  if (!quote.userId || quote.userId === 'guest') {
    throw new Error('Guest users cannot have orders. Client must be logged in.');
  }
  
  await addDoc(collection(db, ORDER_COLLECTION), {
    userId: quote.userId,
    quoteId: quote.id,
    title: `Order for ${quote.serviceType}`,
    amount: price,
    orderStatus: 'pending',
    paymentStatus: 'unpaid',
    createdAt: serverTimestamp()
  });
};

export const calculateQuoteStats = (quotes: QuoteRequest[]) => ({
  total: quotes.length,
  pending: quotes.filter(q => q.status === 'pending').length,
  reviewed: quotes.filter(q => q.status === 'reviewed').length,
  approved: quotes.filter(q => q.status === 'approved').length,
  completed: quotes.filter(q => q.status === 'completed').length,
});