import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import type { Order } from '../../types/order.types';

const MyOrdersPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const finalDebug = async () => {
      if (!user?.uid) return;
      setLoading(true);
      
      console.clear(); // কনসোল পরিষ্কার করা হলো
      console.log('--- FINAL DEBUGGING START ---');
      console.log('Current Logged-in User ID:', user.uid);
      
      try {
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef);
        const querySnapshot = await getDocs(q);
        
        console.log(`Found ${querySnapshot.size} total orders in the database.`);
        
        const allOrders: any[] = [];
        querySnapshot.forEach((doc) => {
          allOrders.push({ id: doc.id, ...doc.data() });
        });

        // সব অর্ডার কনসোলে প্রিন্ট করা হলো
        console.log('ALL ORDERS IN DATABASE:', allOrders);
        
        if (allOrders.length > 0) {
          console.log('Comparing Current User ID with the first order\'s userId...');
          console.log(`First Order's User ID is:`, allOrders[0].userId);
          console.log('Do they match?', allOrders[0].userId === user.uid);
        }
        
      } catch (error) {
        console.error('CRITICAL ERROR during debugging:', error);
      } finally {
        setLoading(false);
        console.log('--- FINAL DEBUGGING END ---');
      }
    };
    finalDebug();
  }, [user?.uid]);

  return (
    <>
      <Helmet><title>My Orders | Debugging Mode</title></Helmet>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Orders (DEBUG MODE)</h1>
        {loading && <Loader2 className="animate-spin" />}
        {!loading && (
          <div className="p-12 text-center bg-white rounded-2xl">
            <ShoppingBag className="mx-auto mb-4" />
            Check the console for debug information.
          </div>
        )}
      </div>
    </>
  );
};

export default MyOrdersPage;