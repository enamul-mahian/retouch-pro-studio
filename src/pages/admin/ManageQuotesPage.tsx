import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Search, 
  FileText, 
  User, 
  MessageSquare, 
  Download, 
  CheckCircle2, 
  Loader2, 
  X, 
  Calendar,
  Image as ImageIcon,
  ExternalLink,
  ShoppingBag // এখানে আইকনটি ইম্পোর্ট করা হলো
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllQuotes, updateQuoteStatus, createOrderFromQuote, calculateQuoteStats } from '../../services/quoteService';
import type { QuoteRequest, QuoteStatus } from '../../types/quote.types';

const ManageQuotesPage = () => {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [price, setPrice] = useState(0);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const fetchQuotes = async () => {
    try {
      const data = await getAllQuotes();
      setQuotes(data);
    } catch (error) {
      toast.error('Failed to load quotes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuotes(); }, []);

  const handleCreateOrder = async () => {
    if (!selectedQuote || price <= 0) {
      toast.error('Please set a price greater than 0.');
      return;
    }
    
    setIsCreatingOrder(true);
    try {
      await createOrderFromQuote(selectedQuote, price);
      await updateQuoteStatus(selectedQuote.id!, 'approved', `Price set: $${price}`);
      toast.success('Order created successfully!');
      setIsModalOpen(false);
      fetchQuotes();
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error('Failed to create order.');
    } finally {
      setIsCreatingOrder(false);
    }
  };
  
  const getStatusClass = (status: QuoteStatus) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'reviewed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300';
    }
  };
  
  const stats = calculateQuoteStats(quotes);

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <Helmet><title>Manage Quotes | Admin Dashboard</title></Helmet>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Quote Requests</h1>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 dark:text-slate-400">
              <tr>
                <th className="p-4 text-left">Client</th>
                <th className="p-4 text-left">Service</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {quotes.map(quote => (
                <tr key={quote.id} className="text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-4 font-semibold">{quote.name}</td>
                  <td className="p-4">{quote.serviceType}</td>
                  <td className="p-4 text-xs text-slate-500">{new Date(quote.createdAt?.seconds * 1000).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${getStatusClass(quote.status)}`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => { setSelectedQuote(quote); setPrice(0); setIsModalOpen(true); }} className="bg-primary-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary-700 transition-all">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl text-slate-800 dark:text-white shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-2xl flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Quote Details</h3>
                  <p className="text-xs text-slate-400 font-mono">ID: {selectedQuote.id}</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><X/></button>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto space-y-6">
              <section>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">Client's Uploaded Files</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                  {selectedQuote.fileUrls && selectedQuote.fileUrls.length > 0 ? (
                    selectedQuote.fileUrls.map((url, idx) => (
                      <a 
                        key={idx} 
                        href={url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="group relative aspect-square bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden"
                      >
                        <img src={url} alt={`Sample ${idx+1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Download className="text-white w-8 h-8" />
                        </div>
                      </a>
                    ))
                  ) : (
                    <div className="col-span-full py-10 text-center text-slate-400">
                      <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium">No files uploaded by client.</p>
                    </div>
                  )}
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t dark:border-slate-800">
                <div className="space-y-4">
                  <p className="text-sm font-bold">Client: <span className="font-normal text-slate-500">{selectedQuote.name}</span></p>
                  <p className="text-sm font-bold">Service: <span className="font-normal text-slate-500">{selectedQuote.serviceType}</span></p>
                  <p className="text-sm font-bold">Description:</p>
                  <p className="text-sm text-slate-500 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border dark:border-slate-800 italic">
                    "{selectedQuote.description}"
                  </p>
                </div>
                
                {selectedQuote.status !== 'approved' && (
                  <div className="bg-primary-50 dark:bg-primary-950/30 p-6 rounded-2xl border border-primary-100 dark:border-primary-900/50 space-y-4">
                    <h4 className="text-lg font-bold text-primary-700 dark:text-primary-300">Approve & Create Order</h4>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Set Final Price ($)</label>
                      <input 
                        type="number" 
                        value={price} 
                        onChange={(e) => setPrice(Number(e.target.value))} 
                        className="p-3 w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-lg font-bold"
                      />
                    </div>
                    <button 
                      onClick={handleCreateOrder} 
                      disabled={isCreatingOrder}
                      className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      {isCreatingOrder ? <Loader2 className="animate-spin" /> : <ShoppingBag size={18} />}
                      Create Order & Approve
                    </button>
                  </div>
                )}
                
                {selectedQuote.status === 'approved' && (
                  <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-2xl border border-green-200 dark:border-green-900/50 flex items-center justify-center text-center">
                    <div>
                      <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
                      <p className="font-bold text-green-700 dark:text-green-300">This quote has been approved and an order has been created.</p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuotesPage;