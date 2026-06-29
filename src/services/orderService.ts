import { collection, query, where, getDocs, orderBy, type DocumentData } from 'firebase/firestore';
import { db } from './firebase';
import type { Order } from '../types/order.types';

const ORDER_COLLECTION = 'orders';

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, ORDER_COLLECTION);
    
    // clientId এর বদলে userId দিয়ে খোঁজা হচ্ছে
    const q = query(
      ordersRef, 
      where('userId', '==', userId)
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

    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw new Error('আপনার অর্ডারগুলো লোড করা সম্ভব হয়নি।');
  }
};