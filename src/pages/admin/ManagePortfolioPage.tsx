import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  getAllPortfolioItems, 
  addPortfolioItem, 
  deletePortfolioItem 
} from '../../services/portfolioService';
import type { PortfolioItem } from '../../types/portfolio.types';
import FileUpload from '../../components/shared/FileUpload'; // নিশ্চিত করুন এই পাথে ফাইলটি আছে
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Loader2, 
  LayoutGrid, 
  X,
  CheckCircle2,
  Layers,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

const ManagePortfolioPage = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'draft'>('active');
  const [beforeImageUrl, setBeforeImageUrl] = useState('');
  const [afterImageUrl, setAfterImageUrl] = useState('');

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const data = await getAllPortfolioItems();
      setItems(data);
    } catch (error) {
      toast.error("Failed to load portfolio items");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!beforeImageUrl || !afterImageUrl) {
      toast.error("Please upload both Before and After images");
      return;
    }

    setSubmitting(true);
    try {
      const newItem: Omit<PortfolioItem, 'id' | 'createdAt'> = {
        title,
        category,
        description,
        status,
        beforeImageUrl,
        afterImageUrl,
        cloudinaryPublicIds: [], 
      };

      await addPortfolioItem(newItem);
      toast.success("Portfolio item added successfully!");
      
      resetForm();
      setIsAdding(false);
      fetchPortfolio();
    } catch (error) {
      toast.error("Failed to add portfolio item");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setCategory('');
    setDescription('');
    setStatus('active');
    setBeforeImageUrl('');
    setAfterImageUrl('');
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await deletePortfolioItem(id);
      toast.success("Item deleted successfully");
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  // Helper function to format Firebase Timestamp or ISO string
  const formatDate = (date: any) => {
    if (!date) return 'Just now';
    if (date.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Helmet>
        <title>Manage Portfolio | Admin Dashboard</title>
      </Helmet>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-primary-600" />
            Portfolio Management
          </h1>
          <p className="text-slate-500 text-sm">Create, update, or remove your showcase items.</p>
        </div>

        <button
          onClick={() => {
            setIsAdding(!isAdding);
            if (isAdding) resetForm();
          }}
          className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all ${
            isAdding 
            ? 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300' 
            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-200'
          }`}
        >
          {isAdding ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add New Work</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Project Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Title"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                    <input
                      type="text"
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Category"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'active' | 'draft')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Before Image</label>
                  {beforeImageUrl ? (
                    <div className="relative rounded-xl overflow-hidden aspect-square border-2 border-primary-200">
                      <img src={beforeImageUrl} alt="Before" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setBeforeImageUrl('')} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <FileUpload onUploadSuccess={(url: string) => setBeforeImageUrl(url)} folder="portfolio_before" label="Upload Before" />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">After Image</label>
                  {afterImageUrl ? (
                    <div className="relative rounded-xl overflow-hidden aspect-square border-2 border-green-200">
                      <img src={afterImageUrl} alt="After" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setAfterImageUrl('')} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <FileUpload onUploadSuccess={(url: string) => setAfterImageUrl(url)} folder="portfolio_after" label="Upload After" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t dark:border-slate-800">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-10 py-3 rounded-xl font-bold disabled:opacity-50 transition-all shadow-lg"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                Save Portfolio Item
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={item.afterImageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-600 text-white">
                  {item.status}
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button onClick={() => handleDelete(item.id)} className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-800 dark:text-white truncate">{item.title}</h3>
                <p className="text-[10px] text-slate-400 mt-2">Added: {formatDate(item.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagePortfolioPage;