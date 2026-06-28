import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Users, 
  ShoppingBag, 
  MessageSquare, 
  DollarSign, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2,
  TrendingUp,
  Loader2,
  Activity,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../services/firebase';

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuotes: 0,
    pendingOrders: 0,
    revenue: 0
  });
  const [recentQuotes, setRecentQuotes] = useState<any[]>([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Users Count
        const usersSnap = await getDocs(collection(db, 'users'));
        
        // 2. Fetch Quotes Count & Latest 5 Quotes
        const quotesRef = collection(db, 'quoteRequests');
        const quotesSnap = await getDocs(quotesRef);
        
        const recentQuotesQuery = query(quotesRef, orderBy('createdAt', 'desc'), limit(5));
        const recentSnap = await getDocs(recentQuotesQuery);
        const quotesList = recentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 3. Fetch Orders for Active Count & Revenue Calculation
        const ordersSnap = await getDocs(collection(db, 'orders'));
        let activeOrdersCount = 0;
        let totalRevenue = 0;

        ordersSnap.forEach((doc) => {
          const data = doc.data();
          // Active orders logic (anything not completed/delivered/cancelled)
          if (data.status !== 'completed' && data.status !== 'delivered' && data.status !== 'cancelled') {
            activeOrdersCount++;
          }
          // Revenue logic (sum of completed or paid orders)
          if (data.status === 'completed' || data.status === 'delivered' || data.paymentStatus === 'paid') {
            totalRevenue += (Number(data.price) || Number(data.amount) || 0);
          }
        });

        setStats({
          totalUsers: usersSnap.size,
          totalQuotes: quotesSnap.size,
          pendingOrders: activeOrdersCount,
          revenue: totalRevenue
        });
        setRecentQuotes(quotesList);

      } catch (error) {
        console.error("Admin Data Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // Helper to format Firestore Timestamp
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short'
      });
    }
    return new Date(timestamp).toLocaleDateString('en-GB');
  };

  // Stat Cards Configuration
  const adminStats = [
    { name: 'Total Clients', value: stats.totalUsers, icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30' },
    { name: 'Quote Requests', value: stats.totalQuotes, icon: MessageSquare, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30' },
    { name: 'Active Orders', value: stats.pendingOrders, icon: ShoppingBag, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/30' },
    { name: 'Total Revenue', value: `$${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
  ];

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="text-primary-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading Management Console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <Helmet>
        <title>Admin Overview | Retouch Pro Studio</title>
      </Helmet>

      <div className="space-y-8 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Activity className="w-8 h-8 text-primary-600" />
              Admin Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
              Welcome back, Admin. Here's a real-time summary of your studio's performance.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/services" className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-sm font-bold transition-all">
              Manage Services
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {adminStats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.name} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3.5 rounded-2xl ${item.bg} ${item.color}`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg text-xs font-bold">
                    <TrendingUp size={14} />
                    <span>Live</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-slate-800 dark:text-white">{item.value}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{item.name}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Quotes (Left Column) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
              <h2 className="font-bold text-lg text-slate-800 dark:text-white">Recent Quote Requests</h2>
              <Link to="/admin/quotes" className="text-sm font-bold text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1">
                View All <ArrowUpRight size={16} />
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              {recentQuotes.length > 0 ? (
                <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                    {recentQuotes.map((quote) => (
                      <tr key={quote.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-primary-600 transition-colors">
                            {quote.name || 'Client'}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{quote.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                            {quote.serviceName || quote.serviceType || 'Custom'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${
                            quote.status === 'pending' ? 'text-amber-500' : 'text-emerald-500'
                          }`}>
                            <Clock size={14} />
                            {quote.status}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">{formatDate(quote.createdAt)}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link to={`/admin/quotes`} className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-800 rounded-lg transition-all">
                            <ArrowUpRight size={18} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-500 text-sm font-medium">No new requests today.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats/Actions (Right Column) */}
          <div className="space-y-6">
            
            {/* System Status Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden border border-slate-700">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> System Status
                </h3>
                <div className="space-y-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Database (Firestore)</span>
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-400/10 px-2 py-1 rounded-md">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div> Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Storage (Cloudinary)</span>
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-400/10 px-2 py-1 rounded-md">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div> Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Authentication</span>
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-400/10 px-2 py-1 rounded-md">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div> Active
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl pointer-events-none"></div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-slate-800 dark:text-white mb-5">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/admin/pricing" className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-all border border-slate-100 dark:border-slate-700 hover:border-primary-200 group">
                  <div className="w-8 h-8 mx-auto bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mb-2 shadow-sm text-slate-400 group-hover:text-primary-600 transition-colors">
                    <Plus size={16} />
                  </div>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Add Package</p>
                </Link>
                <Link to="/admin/blog" className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-all border border-slate-100 dark:border-slate-700 hover:border-primary-200 group">
                  <div className="w-8 h-8 mx-auto bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mb-2 shadow-sm text-slate-400 group-hover:text-primary-600 transition-colors">
                    <Plus size={16} />
                  </div>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300">New Blog</p>
                </Link>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;