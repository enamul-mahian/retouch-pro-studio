import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, FileText, User, MessageSquare, Download, CheckCircle2, Loader2, X, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllQuotes, updateQuoteStatus, createOrderFromQuote, calculateQuoteStats } from '../../services/quoteService';
import type { QuoteRequest, QuoteStatus } from '../../types/quote.types';

const ManageQuotesPage = () => {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [price, setPrice] = useState(0);

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
    try {
      await createOrderFromQuote(selectedQuote, price);
      await updateQuoteStatus(selectedQuote.id!, 'approved', `Price set: $${price}`);
      toast.success('Order created successfully!');
      setIsModalOpen(false);
      fetchQuotes();
    } catch (error) {
      toast.error('Failed to create order.');
    }
  };

  const getStatusClass = (status: QuoteStatus) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };
  
  const stats = calculateQuoteStats(quotes);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Helmet><title>Manage Quotes | Admin Dashboard</title></Helmet>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Quote Requests</h1>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border dark:border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 dark:text-slate-400">
            <tr>
              <th className="p-4 text-left">Client</th>
              <th className="p-4 text-left">Service</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-slate-800">
            {quotes.map(quote => (
              <tr key={quote.id} className="text-slate-700 dark:text-slate-300">
                <td className="p-4 font-semibold">{quote.name}</td>
                <td className="p-4">{quote.serviceType}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusClass(quote.status)}`}>
                    {quote.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => { setSelectedQuote(quote); setPrice(0); setIsModalOpen(true); }} className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-bold">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl text-slate-800 dark:text-white">
            <div className="p-4 border-b dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold">Quote Details</h3>
              <button onClick={() => setIsModalOpen(false)}><X/></button>
            </div>
            <div className="p-4 space-y-4">
              <p>Client: {selectedQuote.name}</p>
              <p>Service: {selectedQuote.serviceType}</p>
              <div>
                <label>Set Price ($)</label>
                <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="border p-2 w-full bg-slate-50 dark:bg-slate-800"/>
              </div>
            </div>
            <div className="p-4 border-t dark:border-slate-800 flex justify-end">
              <button onClick={handleCreateOrder} className="bg-blue-500 text-white px-4 py-2 rounded">Create Order & Approve</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuotesPage;