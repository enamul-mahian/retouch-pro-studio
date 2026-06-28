import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  ExternalLink,  
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getUserQuotes } from '../../services/quoteService';
import type { QuoteRequest, QuoteStatus } from '../../types/quote.types';

const MyQuotesPage = () => {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchQuotes = async () => {
      if (!user?.uid) return;
      try {
        setLoading(true);
        const data = await getUserQuotes(user.uid);
        setQuotes(data);
      } catch (error) {
        console.error('Error fetching quotes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [user?.uid]);

  // স্ট্যাটাস অনুযায়ী ব্যাজ (Badge) কালার সেট করার ফাংশন
  const getStatusStyle = (status: QuoteStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'reviewed':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'completed':
        return 'bg-slate-50 text-slate-700 border-slate-100';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  // সার্চ ফিল্টারিং
  const filteredQuotes = quotes.filter(quote => 
    quote.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 size={40} className="text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Quote Requests | Retouch Pro Studio</title>
      </Helmet>

      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">My Quote Requests</h1>
            <p className="text-slate-500 text-sm mt-1">Manage and track your project estimations.</p>
          </div>
          <Link 
            to="/quote" 
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold transition-all shadow-soft"
          >
            <Plus size={18} />
            New Request
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by service or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
            <Filter size={18} />
            Filters
          </button>
        </div>

        {/* Quotes List/Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
          {filteredQuotes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Service Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredQuotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{quote.serviceType}</p>
                            <p className="text-xs text-slate-400 line-clamp-1">{quote.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }) : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(quote.status)}`}>
                          {quote.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          to={`/dashboard/quotes/${quote.id}`}
                          className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        >
                          <ExternalLink size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                <FileText size={40} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">No quotes found</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8">
                {searchTerm ? "We couldn't find any quotes matching your search." : "You haven't requested any quotes yet. Start your first project today!"}
              </p>
              {!searchTerm && (
                <Link 
                  to="/quote" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold text-sm shadow-soft hover:bg-primary-700 transition-all"
                >
                  <Plus size={18} />
                  Request Free Quote
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Help Note */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
          <AlertCircle className="text-blue-600 shrink-0" size={20} />
          <p className="text-xs text-blue-700 leading-relaxed">
            <strong>Note:</strong> We review all quote requests within 1 hour during business hours. Once reviewed, you will receive an email notification and the status will change to "Reviewed" or "Approved".
          </p>
        </div>
      </div>
    </>
  );
};

export default MyQuotesPage;