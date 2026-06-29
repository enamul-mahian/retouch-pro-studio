import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, FileText, User, MessageSquare, Download, CheckCircle2, Loader2, X, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllQuotes, updateQuoteStatus, createOrderFromQuote } from '../../services/quoteService';
import type { QuoteRequest, QuoteStatus } from '../../types/quote.types';

const ManageQuotesPage = () => {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<QuoteStatus>('pending');
  const [adminNote, setAdminNote] = useState('');
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

  return (
    <>
      <Helmet><title>Manage Quotes | Admin Panel</title></Helmet>
      {/* ... (আপনার টেবিল এবং অন্যান্য অংশ এখানে থাকবে, সেগুলো ঠিক আছে) */}
      
      {isModalOpen && selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-2xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold">Quote Details</h3>
              <button onClick={() => setIsModalOpen(false)}><X/></button>
            </div>
            <div className="p-4 space-y-4">
              <p>Client: {selectedQuote.name}</p>
              <p>Service: {selectedQuote.serviceType}</p>
              <div>
                <label>Set Price ($)</label>
                <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="border p-2 w-full"/>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button onClick={handleCreateOrder} className="bg-blue-500 text-white px-4 py-2 rounded">Create Order & Approve</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageQuotesPage;