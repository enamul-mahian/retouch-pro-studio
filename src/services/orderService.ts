import { collection, query, where, getDocs, type DocumentData } from 'firebase/firestore';
import { db } from './firebase';
import type { Order } from '../types/order.types';

const ORDER_COLLECTION = 'orders';

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    // শুধুমাত্র userId দিয়ে কোয়েরি করা হচ্ছে
    const q = query(collection(db, ORDER_COLLECTION), where('userId', '==', userId));
    const snapshot = await getDocs(q);

    const orders = snapshot.docs.map(doc => {
      const data = doc.data() as DocumentData;
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      } as Order;
    });

    // জাভাস্ক্রিপ্ট দিয়ে সর্টিং
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw new Error('আপনার অর্ডার লোড করা যায়নি।');
  }
};