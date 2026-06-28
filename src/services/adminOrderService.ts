import { collection, getDocs, updateDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { Order } from '../types/order.types';

const ORDER_COLLECTION = 'orders';

/**
 * অ্যাডমিন প্যানেলের জন্য সব ক্লায়েন্টের সব অর্ডার নিয়ে আসা
 */
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const q = query(collection(db, ORDER_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
    })) as Order[];
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw new Error('সব অর্ডার লোড করা সম্ভব হয়নি।');
  }
};

/**
 * অর্ডারের স্ট্যাটাস আপডেট করা (অ্যাডমিন)
 */
export const updateOrderStatus = async (
  orderId: string, 
  status: string, 
  paymentStatus: string,
  outputFiles: string[] = []
): Promise<void> => {
  try {
    const docRef = doc(db, ORDER_COLLECTION, orderId);
    await updateDoc(docRef, {
      orderStatus: status,
      paymentStatus: paymentStatus,
      outputFiles: outputFiles,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw new Error('অর্ডার আপডেট করতে সমস্যা হয়েছে।');
  }
};