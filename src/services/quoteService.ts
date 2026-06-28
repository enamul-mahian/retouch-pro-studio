import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  doc, 
  getDoc,
  updateDoc,
  type DocumentData,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { QuoteRequest, QuoteStatus } from '../types/quote.types';

const QUOTE_COLLECTION = 'quoteRequests';

/**
 * নির্দিষ্ট ইউজারের সব কোটেশন নিয়ে আসা (ক্লায়েন্ট ড্যাশবোর্ডের জন্য)
 */
export const getUserQuotes = async (userId: string): Promise<QuoteRequest[]> => {
  try {
    const quotesRef = collection(db, QUOTE_COLLECTION);
    const q = query(
      quotesRef, 
      where('clientId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const quotes: QuoteRequest[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as DocumentData;
      quotes.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
      } as QuoteRequest);
    });

    return quotes;
  } catch (error) {
    console.error('Error fetching user quotes:', error);
    throw new Error('আপনার কোটেশনগুলো লোড করতে সমস্যা হয়েছে।');
  }
};

/**
 * ডাটাবেস থেকে সব কোটেশন নিয়ে আসা (শুধুমাত্র অ্যাডমিন প্যানেলের জন্য)
 */
export const getAllQuotes = async (): Promise<QuoteRequest[]> => {
  try {
    const quotesRef = collection(db, QUOTE_COLLECTION);
    // অ্যাডমিন সব ডাটা লেটেস্ট অনুযায়ী দেখবে
    const q = query(quotesRef, orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);
    const quotes: QuoteRequest[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as DocumentData;
      quotes.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
      } as QuoteRequest);
    });

    return quotes;
  } catch (error) {
    console.error('Error fetching all quotes:', error);
    throw new Error('সব কোটেশন লোড করতে সমস্যা হয়েছে।');
  }
};

/**
 * কোটেশনের স্ট্যাটাস এবং অ্যাডমিন নোট আপডেট করা
 */
export const updateQuoteStatus = async (
  quoteId: string, 
  status: QuoteStatus, 
  adminNote?: string
): Promise<void> => {
  try {
    const docRef = doc(db, QUOTE_COLLECTION, quoteId);
    await updateDoc(docRef, {
      status,
      adminNote: adminNote || '',
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating quote:', error);
    throw new Error('কোটেশন আপডেট করতে সমস্যা হয়েছে।');
  }
};

/**
 * কোটেশন স্ট্যাটাস অনুযায়ী সংখ্যা গণনা
 */
export const calculateQuoteStats = (quotes: QuoteRequest[]) => {
  return {
    total: quotes.length,
    pending: quotes.filter(q => q.status === 'pending').length,
    reviewed: quotes.filter(q => q.status === 'reviewed').length,
    approved: quotes.filter(q => q.status === 'approved').length,
    completed: quotes.filter(q => q.status === 'completed').length,
  };
};