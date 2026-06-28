import { collection, query, where, getDocs, type DocumentData } from 'firebase/firestore';
import { db } from './firebase';
import type { Order } from '../types/order.types';

const ORDER_COLLECTION = 'orders';

/**
 * ক্লায়েন্টের সব অর্ডার নিয়ে আসা (ইনডেক্স এরর মুক্ত)
 * @param clientId - ক্লায়েন্টের ইউনিক আইডি
 */
export const getUserOrders = async (clientId: string): Promise<Order[]> => {
  try {
    // ফায়ারবেস ইনডেক্স এরর এড়াতে 'orderBy' কুয়েরিটি বাদ দেওয়া হলো
    const q = query(
      collection(db, ORDER_COLLECTION), 
      where('clientId', '==', clientId)
    );
    
    const snapshot = await getDocs(q);
    
    const orders = snapshot.docs.map(doc => {
      const data = doc.data() as DocumentData;
      return {
        id: doc.id,
        ...data,
        // ফায়ারস্টোর টাইমস্ট্যাম্পকে রিঅ্যাক্ট ডেট অবজেক্টে কনভার্ট করা
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      };
    }) as Order[];

    // জাভাস্ক্রিপ্ট কোড দিয়ে আমরা লোকালভাবে ডাটা সাজিয়ে (sort) নিচ্ছি (লেটেস্ট অর্ডার আগে দেখাবে)
    return orders.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // Newest first
    });
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('অর্ডারগুলো লোড করা সম্ভব হয়নি।');
  }
};