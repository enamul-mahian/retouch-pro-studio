import { collection, query, where, getDocs, orderBy, type DocumentData } from 'firebase/firestore';
import { db } from './firebase';
import type { Order } from '../types/order.types';

const ORDER_COLLECTION = 'orders';

export const getUserOrders = async (clientId: string): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, ORDER_COLLECTION);
    
    // এখানে আমরা userId এর বদলে clientId দিয়ে খুঁজছি, যা আপনার সমস্যার সমাধান করবে
    const q = query(
      ordersRef, 
      where('clientId', '==', clientId), 
      orderBy('createdAt', 'desc')
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

    return orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw new Error('আপনার অর্ডারগুলো লোড করা সম্ভব হয়নি।');
  }
};