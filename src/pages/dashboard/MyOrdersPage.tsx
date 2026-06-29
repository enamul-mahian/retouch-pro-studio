import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import type { Order } from '../../types/order.types';

const MyOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const debugOrders = async () => {
      if (!user?.uid) return;
      setLoading(true);
      
      console.log('--- DEBUGGING MyOrdersPage ---');
      console.log('Current User ID:', user.uid);
      
      try {
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, limit(5));
        const querySnapshot = await getDocs(q);
        
        console.log(`Found ${querySnapshot.size} total orders in the database.`);
        
        let foundMatch = false;
        querySnapshot.forEach((doc) => {
          console.log('Order Doc ID:', doc.id, 'Data:', doc.data());
          if (doc.data().clientId === user.uid) {
            foundMatch = true;
          }
        });
        console.log('Match found for current user?', foundMatch ? 'YES' : 'NO');
        
        // এখন আপনার আসল কোডটি এক্সিকিউট হবে
        const userOrders = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Order))
          .filter(order => order.clientId === user.uid);
        
        setOrders(userOrders);
      } catch (error) {
        console.error('Error in debugging orders:', error);
      } finally {
        setLoading(false);
      }
    };
    debugOrders();
  }, [user?.uid]);

  return (
    <>
      <Helmet><title>My Orders | Debugging</title></Helmet>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <div>
            {orders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl">
                <ShoppingBag className="mx-auto mb-4" />
                No orders found yet.
              </div>
            ) : (
              <p>{orders.length} orders found.</p> 
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MyOrdersPage;