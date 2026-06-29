import { collection, query, where, getDocs, orderBy, type DocumentData } from 'firebase/firestore';
import { db } from './firebase';
import type { Order } from '../types/order.types';

const ORDER_COLLECTION = 'orders';

export const getUserOrders = async (clientId: string): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, ORDER_COLLECTION);
    
    // orderBy বাদ দিয়ে শুধু clientId দিয়ে ডাটা ফিল্টার করা হলো
    const q = query(
      ordersRef, 
      where('clientId', '==', clientId)
    );

    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as DocumentData;
      orders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
      } as Order);
    });

    // জাভাস্ক্রিপ্ট দিয়ে তারিখ অনুযায়ী নতুন থেকে পুরোনো ক্রমে সাজানো হচ্ছে
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw new Error('আপনার অর্ডারগুলো লোড করা সম্ভব হয়নি।');
  }
};