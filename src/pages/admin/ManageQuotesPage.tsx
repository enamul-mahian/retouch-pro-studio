import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Search, 
  Filter, 
  FileText, 
  User, 
  Calendar, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Loader2,
  X,
  MessageSquare,
  Image as ImageIcon,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllQuotes, updateQuoteStatus, calculateQuoteStats } from '../../services/quoteService';
import type { QuoteRequest, QuoteStatus } from '../../types/quote.types';

const ManageQuotesPage = () => {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [newStatus, setNewStatus] = useState<QuoteStatus>('pending');

  // ডাটা লোড করার ফাংশন
  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const data = await getAllQuotes();
      setQuotes(data);
    } catch (error) {
      toast.error('ডাটা লোড করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // স্ট্যাটাস আপডেট করার ফাংশন
  const handleUpdateStatus = async () => {
    if (!selectedQuote?.id) return;
    
    setUpdating(true);
    try {
      await updateQuoteStatus(selectedQuote.id, newStatus, adminNote);
      toast.success('কোটেশন সফলভাবে আপডেট হয়েছে!');
      setIsModalOpen(false);
      fetchQuotes(); // ডাটা রিফ্রেশ করা
    } catch (error) {
      toast.error('আপডেট করা সম্ভব হয়নি।');
    } finally {
      setUpdating(false);
    }
  };

  // স্ট্যাটাস অনুযায়ী কালার কোড
  const getStatusStyle = (status: QuoteStatus) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'reviewed': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'approved': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const stats = calculateQuoteStats(quotes);

  const filteredQuotes = quotes.filter(q => 
    q.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    q.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
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
        <title>Manage Quote Requests | Admin Panel</title>
      </Helmet>

      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 font-sans">Manage Quote Requests</h1>
            <p className="text-slate-500 text-sm mt-1">Review client requests and provide price estimations.</p>
          </div>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-soft">
            <p className="text-xs font-bold text-slate-400 uppercase">Total</p>
            <p className="text-xl font-bold text-slate-800">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-soft">
            <p className="text-xs font-bold text-amber-500 uppercase">Pending</p>
            <p className="text-xl font-bold text-slate-800">{stats.pending}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-soft">
            <p className="text-xs font-bold text-blue-500 uppercase">Reviewed</p>
            <p className="text-xl font-bold text-slate-800">{stats.reviewed}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-soft">
            <p className="text-xs font-bold text-emerald-500 uppercase">Approved</p>
            <p className="text-xl font-bold text-slate-800">{stats.approved}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by client name or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm shadow-soft"
          />
        </div>

        {/* Quotes Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Client & Project</th>
                  <th className="px-6 py-4">Submission Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{quote.name}</p>
                          <p className="text-[11px] text-primary-600 font-semibold uppercase">{quote.serviceType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Calendar size={14} />
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(quote.status)}`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => {
                          setSelectedQuote(quote);
                          setAdminNote(quote.adminNote || '');
                          setNewStatus(quote.status);
                          setIsModalOpen(true);
                        }}
                        className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-primary-600 transition-all shadow-soft"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {isModalOpen && selectedQuote && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-slide-up">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-200">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Quote Details</h3>
                    <p className="text-xs text-slate-400">ID: {selectedQuote.id}</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Info */}
                  <div className="space-y-6">
                    <section>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Client Information</h4>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-slate-700 flex items-center gap-2"><User size={16} className="text-primary-500" /> {selectedQuote.name}</p>
                        <p className="text-sm text-slate-500 flex items-center gap-2"><MessageSquare size={16} /> {selectedQuote.email}</p>
                      </div>
                    </section>

                    <section>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Project Scope</h4>
                      <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Service:</span>
                          <span className="font-bold text-slate-800">{selectedQuote.serviceType}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Quantity:</span>
                          <span className="font-bold text-slate-800">{selectedQuote.quantity || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Deadline:</span>
                          <span className="font-bold text-slate-800">{selectedQuote.deadline || 'N/A'}</span>
                        </div>
                        <hr className="border-slate-200" />
                        <div>
                          <span className="text-xs text-slate-500 block mb-1">Description:</span>
                          <p className="text-sm text-slate-700 leading-relaxed italic">"{selectedQuote.description}"</p>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Right Column: Files & Actions */}
                  <div className="space-y-6">
                    <section>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Project Files ({selectedQuote.fileUrls?.length || 0})</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedQuote.fileUrls && selectedQuote.fileUrls.length > 0 ? (
                          selectedQuote.fileUrls.map((url, idx) => (
                            <a 
                              key={idx} 
                              href={url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="group relative h-24 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center hover:border-primary-500 transition-all shadow-sm"
                            >
                              <img src={url} alt="Project sample" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-slate-900/40 transition-all">
                                <Download size={20} className="text-white" />
                              </div>
                            </a>
                          ))
                        ) : (
                          <div className="col-span-2 py-8 text-center bg-slate-50 rounded-2xl text-slate-400 text-xs italic">
                            No files uploaded.
                          </div>
                        )}
                      </div>
                    </section>

                    <section className="bg-slate-900 p-6 rounded-3xl text-white space-y-4 shadow-xl">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin Action</h4>
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Set Status</label>
                        <select 
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value as QuoteStatus)}
                          className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-xl text-sm outline-none focus:border-primary-500 transition-all"
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="approved">Approved</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Admin Note / Price Quote</label>
                        <textarea 
                          rows={3}
                          value={adminNote}
                          onChange={(e) => setAdminNote(e.target.value)}
                          placeholder="Write something for the client..."
                          className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl text-sm outline-none focus:border-primary-500 transition-all resize-none"
                        />
                      </div>

                      <button 
                        onClick={handleUpdateStatus}
                        disabled={updating}
                        className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {updating ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                        Save Update
                      </button>
                    </section>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageQuotesPage;