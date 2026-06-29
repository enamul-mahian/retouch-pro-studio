import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, Loader2, CheckCircle2, Download, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getUserOrders } from '../../services/orderService';
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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Orders</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track your active projects, make payments, and download delivered files.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-soft overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-primary-600" /></div>
          ) : orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Order Title</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-800 dark:text-white">{order.title}</p>
                        <p className="text-xs text-slate-400">{order.serviceType}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5 w-fit border ${
                          order.orderStatus === 'completed' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {order.orderStatus === 'completed' ? <CheckCircle2 size={12}/> : <Loader2 size={12} className="animate-spin"/>}
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                          order.paymentStatus === 'paid' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/30 dark:text-rose-400'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {order.paymentStatus === 'unpaid' && (
                            <Link 
                              to={`/dashboard/checkout/${order.id}`}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all shadow-soft"
                            >
                              <CreditCard size={14} />
                              Pay Now
                            </Link>
                          )}
                          
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
                            order.paymentStatus === 'paid' && <span className="text-slate-400 text-xs">Processing...</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              <ShoppingBag size={40} className="mx-auto mb-4 text-slate-300 dark:text-slate-700" />
              <p>No orders found yet.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyOrdersPage;