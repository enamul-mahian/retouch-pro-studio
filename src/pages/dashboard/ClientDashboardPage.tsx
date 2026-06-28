import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../hooks/useAuth';
import { 
  FileText, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Plus, 
  ArrowUpRight,
  Loader2,
  Headphones
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';

const ClientDashboardPage = () => {
  const { user } = useAuth();
  const [recentQuotes, setRecentQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dynamic Stats State
  const [stats, setStats] = useState({
    pendingQuotes: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalQuotes: 0
  });

  useEffect(() => {
    if (user?.uid) {
      fetchDashboardData();
    }
  }, [user?.uid]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch User Quotes
      const quotesRef = collection(db, 'quoteRequests');
      const qQuotes = query(quotesRef, where('userId', '==', user?.uid));
      const quotesSnap = await getDocs(qQuotes);
      
      let pendingQ = 0;
      const quotesList: any[] = [];
      
      quotesSnap.forEach((doc) => {
        const data = doc.data();
        if (data.status === 'pending') pendingQ++;
        quotesList.push({ id: doc.id, ...data });
      });

      // Sort quotes by date manually to avoid Firestore Index errors
      quotesList.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });

      // 2. Fetch User Orders
      const ordersRef = collection(db, 'orders');
      const qOrders = query(ordersRef, where('userId', '==', user?.uid));
      const ordersSnap = await getDocs(qOrders);
      
      let activeO = 0;
      let completedO = 0;

      ordersSnap.forEach((doc) => {
        const data = doc.data();
        if (data.status === 'completed' || data.status === 'delivered') {
          completedO++;
        } else {
          activeO++;
        }
      });

      // Update State
      setStats({
        pendingQuotes: pendingQ,
        activeOrders: activeO,
        completedOrders: completedO,
        totalQuotes: quotesList.length
      });
      setRecentQuotes(quotesList.slice(0, 5)); // Show only latest 5

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format Firestore Timestamp
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
      });
    }
    return new Date(timestamp).toLocaleDateString('en-GB');
  };

  // Stat Cards Configuration
  const statCards = [
    { name: 'Active Orders', value: stats.activeOrders, icon: ShoppingBag, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30' },
    { name: 'Pending Quotes', value: stats.pendingQuotes, icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/30' },
    { name: 'Total Quotes', value: stats.totalQuotes, icon: FileText, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30' },
    { name: 'Completed Orders', value: stats.completedOrders, icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
  ];

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="text-primary-600 animate-spin" />
          <p className="text-slate-500 font-medium">Syncing your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard Overview | Client Portal</title>
      </Helmet>

      <div className="space-y-8 animate-in fade-in duration-500 font-sans">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
              Welcome back, {user?.name?.split(' ')[0] || 'Client'}! 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
              You have <strong className="text-amber-500">{stats.pendingQuotes}</strong> pending quotes and <strong className="text-blue-500">{stats.activeOrders}</strong> active orders in progress.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              to="/quote" 
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary-200 dark:shadow-none"
            >
              <Plus size={18} />
              New Request
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-slate-800 dark:text-white">{stat.value}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.name}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Quote Requests List */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
              <h2 className="font-bold text-lg text-slate-800 dark:text-white">Recent Quote Requests</h2>
              <Link to="/dashboard/quotes" className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                View All <ArrowUpRight size={16} />
              </Link>
            </div>
            
            <div className="p-2 md:p-4">
              {recentQuotes.length > 0 ? (
                <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {recentQuotes.map((quote) => (
                    <div key={quote.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors rounded-2xl group">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          quote.status === 'pending' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20' : 
                          quote.status === 'approved' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 
                          'bg-primary-50 text-primary-600 dark:bg-primary-900/20'
                        }`}>
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-primary-600 transition-colors">
                            {quote.serviceName || 'Custom Request'}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                            {formatDate(quote.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`hidden sm:inline-flex px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                          quote.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' : 
                          quote.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 
                          'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400'
                        }`}>
                          {quote.status}
                        </span>
                        <Link to={`/dashboard/quotes`} className="p-2 text-slate-300 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-800 rounded-lg transition-all">
                          <ArrowUpRight size={18} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <FileText size={24} />
                  </div>
                  <p className="text-slate-500 font-medium">No quote requests found.</p>
                  <Link to="/quote" className="text-primary-600 text-sm font-bold mt-2 inline-block hover:underline">
                    Get a free quote today
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Support Card */}
          <div className="bg-gradient-to-br from-primary-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Headphones size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                <Headphones size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Need Help?</h3>
              <p className="text-primary-100 text-sm leading-relaxed mb-8">
                Our support team is available 24/7. Get your issues resolved quickly by contacting us.
              </p>
            </div>
            <Link 
              to="/contact" 
              className="relative z-10 w-full py-3.5 bg-white text-primary-600 rounded-xl font-bold text-sm text-center hover:bg-primary-50 hover:scale-[1.02] transition-all shadow-lg"
            >
              Contact Support
            </Link>
          </div>

        </div>
      </div>
    </>
  );
};

export default ClientDashboardPage;