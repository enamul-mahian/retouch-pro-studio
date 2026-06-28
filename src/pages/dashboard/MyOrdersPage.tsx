import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, Loader2, Clock, CheckCircle2, Download, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getUserOrders } from '../../services/orderService';
import { db } from '../../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { Order } from '../../types/order.types';

const MyOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.uid) return;
      try {
        setLoading(true);

        // === স্মার্ট ডিবাগিং লগ শুরু ===
        console.log("=== DEBUGGING START ===");
        console.log("বর্তমানে লগিন থাকা ইউজার আইডি (Kawsar UID):", user.uid);
        
        // ডাটাবেসের 'orders' কালেকশনের সব ফাইল রিড করার চেষ্টা
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        console.log("ডাটাবেসের 'orders' কালেকশনে মোট ফাইল পাওয়া গেছে:", ordersSnapshot.size);
        
        ordersSnapshot.forEach(doc => {
          const data = doc.data();
          console.log("অর্ডার ডকুমেন্ট আইডি:", doc.id);
          console.log("অর্ডারের ভেতরের clientId মান:", data.clientId);
          console.log("আইডি দুটি কি মিলছে?:", data.clientId === user.uid ? "হ্যাঁ, মিলেছে! (YES)" : "না, মেলেনি! (NO)");
        });
        console.log("=== DEBUGGING END ===");
        // === স্মার্ট ডিবাগিং লগ শেষ ===

        const data = await getUserOrders(user.uid);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user?.uid]);

  return (
    <>
      <Helmet><title>My Orders | Retouch Pro Studio</title></Helmet>

      <div className="space-y-6 animate-fade-in font-sans">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Orders</h1>
          <p className="text-slate-500 text-sm mt-1">Track your active projects, make payments, and download delivered files.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-primary-600" /></div>
          ) : orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Order Title</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-800">{order.title}</p>
                        <p className="text-xs text-slate-400">{order.serviceType}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5 w-fit border ${
                          order.orderStatus === 'completed' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                          {order.orderStatus === 'completed' ? <CheckCircle2 size={12}/> : <Loader2 size={12} className="animate-spin"/>}
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                          order.paymentStatus === 'paid' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {/* যদি পেমেন্ট আনপেইড থাকে তবে 'Pay Now' বাটন দেখাবে */}
                          {order.paymentStatus === 'unpaid' && (
                            <Link 
                              to={`/dashboard/checkout/${order.id}`}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all shadow-soft"
                            >
                              <CreditCard size={14} />
                              Pay Now
                            </Link>
                          )}
                          
                          {/* যদি ডেলিভারি ফাইল থাকে তবে ডাউনলোড বাটন দেখাবে */}
                          {order.outputFiles && order.outputFiles.length > 0 ? (
                            <a 
                              href={order.outputFiles[0]} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-bold"
                            >
                              <Download size={16} /> Download
                            </a>
                          ) : (
                            order.paymentStatus === 'paid' && <span className="text-slate-400 text-xs">Processing Delivery...</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">
              <ShoppingBag size={40} className="mx-auto mb-4 text-slate-300" />
              <p>No orders found yet.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyOrdersPage;