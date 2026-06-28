import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';
import FileUpload from '../../components/shared/FileUpload'; 
import type { Service } from '../../types/service.types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  Box, 
  Plus, 
  Trash2, 
  Edit3, 
  Loader2, 
  X, 
  CheckCircle2, 
  ImageIcon, 
  Search,
  DollarSign,
  Globe
} from 'lucide-react';
import toast from 'react-hot-toast';

const ManageServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [category, setCategory] = useState('Image Editing');
  const [startingPrice, setStartingPrice] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState('');
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState('');
  
  // SEO State
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [status, setStatus] = useState<'active' | 'draft'>('active');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'services'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[];
      setServices(list);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageUrl) {
      toast.error("দয়া করে সার্ভিসের একটি ইমেজ আপলোড করুন।");
      return;
    }

    setSubmitting(true);
    try {
      const generatedSlug = generateSlug(title);
      
      const serviceData = {
        title,
        slug: generatedSlug,
        shortDescription,
        fullDescription,
        category,
        startingPrice: Number(startingPrice),
        imageUrl,
        cloudinaryPublicId,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || shortDescription,
        seoKeywords,
        status,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, 'services', editingId), serviceData);
        toast.success("Service updated successfully!");
      } else {
        await addDoc(collection(db, 'services'), {
          ...serviceData,
          createdAt: serverTimestamp()
        });
        toast.success("Service created successfully!");
      }

      resetForm();
      fetchServices();
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("Failed to save service");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id || null);
    setTitle(service.title);
    setShortDescription(service.shortDescription);
    setFullDescription(service.fullDescription);
    setCategory(service.category);
    setStartingPrice(service.startingPrice);
    setImageUrl(service.imageUrl);
    setCloudinaryPublicId(service.cloudinaryPublicId || '');
    setSeoTitle(service.seoTitle);
    setSeoDescription(service.seoDescription);
    setSeoKeywords(service.seoKeywords);
    setStatus(service.status);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id || !window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await deleteDoc(doc(db, 'services', id));
      toast.success("Service deleted");
      setServices(services.filter(s => s.id !== id));
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const resetForm = () => {
    setTitle('');
    setShortDescription('');
    setFullDescription('');
    setCategory('Image Editing');
    setStartingPrice(0);
    setImageUrl('');
    setCloudinaryPublicId('');
    setSeoTitle('');
    setSeoDescription('');
    setSeoKeywords('');
    setStatus('active');
    setEditingId(null);
    setIsFormOpen(false);
  };

  // কাস্টম রিঅ্যাক্ট কুইল মডিউল ও ফরম্যাটস (এডভান্সড অপশনস সহ)
  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // বোল্ড, ইটালিক, আন্ডারলাইন, স্ট্রাইকথ্রু
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],         // হেডিংস/প্যারাগ্রাফ ড্রপডাউন
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],      // অর্ডারড ও বুলেট লিস্ট
      [{ 'align': [] }],                                // টেক্সট এলাইনমেন্ট (Left, Center, Right, Justify)
      ['link'],                                         // হাইপারলিঙ্ক যোগ করার অপশন
      ['clean']                                         // ফরম্যাটিং ইরেজ বা ক্লিয়ার করার অপশন
    ]
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'link'
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <Helmet>
        <title>Manage Services | Admin Dashboard</title>
      </Helmet>

      {/* কাস্টম সিএসএস স্টাইলব্লক - রিঅ্যাক্ট কুইল এডিটরের ডার্ক মোড কালার ফিক্স করার জন্য */}
      <style>{`
        .ql-editor {
          color: #f8fafc !important; /* text-slate-50 */
          font-family: inherit;
          font-size: 14px;
        }
        .dark .ql-toolbar {
          background-color: #1e293b !important; /* bg-slate-800 */
          border-color: #334155 !important; /* border-slate-700 */
        }
        .dark .ql-container {
          border-color: #334155 !important; /* border-slate-700 */
          background-color: #0f172a !important; /* bg-slate-900 */
        }
        .dark .ql-snow .ql-stroke {
          stroke: #94a3b8 !important; /* slate-400 */
        }
        .dark .ql-snow .ql-fill {
          fill: #94a3b8 !important;
        }
        .dark .ql-snow .ql-picker {
          color: #94a3b8 !important;
        }
        .dark .ql-snow .ql-picker-options {
          background-color: #1e293b !important;
          border-color: #334155 !important;
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Box className="w-6 h-6 text-primary-600" />
            Manage Services
          </h1>
          <p className="text-slate-500 text-sm">Add, edit, or update your studio services.</p>
        </div>

        <button
          onClick={() => {
            if(isFormOpen) resetForm();
            else setIsFormOpen(true);
          }}
          className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
            isFormOpen ? 'bg-slate-200 text-slate-700' : 'bg-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-none'
          }`}
        >
          {isFormOpen ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add New Service</>}
        </button>
      </div>

      {/* Service Form */}
      {isFormOpen && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 dark:border-slate-800 mb-8 animate-in fade-in duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Column 1: Core details */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Service Title</label>
                    <input
                      type="text" required value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. High-End Beauty Retouching"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Category</label>
                    <select
                      value={category} onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    >
                      <option value="Image Editing" className="bg-white dark:bg-slate-800">Image Editing</option>
                      <option value="Video Editing" className="bg-white dark:bg-slate-800">Video Editing</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Starting Price ($)</label>
                    <input
                      type="number" step="0.01" required value={startingPrice}
                      onChange={(e) => setStartingPrice(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Publish Status</label>
                    <select
                      value={status} onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    >
                      <option value="active" className="bg-white dark:bg-slate-800">Active (Visible)</option>
                      <option value="draft" className="bg-white dark:bg-slate-800">Draft (Hidden)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Short Description</label>
                  <input
                    type="text" required value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Brief intro for service cards..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Full Detailed Description</label>
                  <div className="prose max-w-none dark:prose-invert">
                    <ReactQuill 
                      theme="snow" 
                      value={fullDescription} 
                      onChange={setFullDescription}
                      modules={quillModules}
                      formats={quillFormats}
                      className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden min-h-[150px]"
                    />
                  </div>
                </div>
              </div>

              {/* Column 2: Uploads & SEO */}
              <div className="space-y-6">
                
                {/* Image Upload Area */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Service Cover Image</label>
                  {imageUrl ? (
                    <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-800 shadow-sm">
                      <img src={imageUrl} alt="Service Cover" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => { setImageUrl(''); setCloudinaryPublicId(''); }}
                        className="absolute top-2.5 right-2.5 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <FileUpload 
                      onUploadSuccess={(url) => {
                        setImageUrl(url);
                        const publicId = url.split('/').pop()?.split('.')[0] || '';
                        setCloudinaryPublicId(publicId);
                      }} 
                      folder="services" 
                      label="Upload Cover Image" 
                    />
                  )}
                </div>

                {/* SEO Settings */}
                <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                  <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-sm border-b pb-2 dark:border-slate-700">
                    <Globe className="w-4 h-4 text-primary-500" /> SEO Metadata (Optional)
                  </h3>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">SEO Title</label>
                    <input
                      type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="Defaults to service title"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">SEO Keywords</label>
                    <input
                      type="text" value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)}
                      placeholder="e.g. retouch, clipping path"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">SEO Meta Description</label>
                    <textarea
                      rows={2} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)}
                      placeholder="Short snippet for Google search..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs resize-none outline-none"
                    />
                  </div>
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-6 border-t dark:border-slate-800 gap-4">
              <button type="button" onClick={resetForm} className="px-6 py-2.5 font-bold text-slate-500 text-sm hover:underline">Cancel</button>
              <button
                type="submit" disabled={submitting}
                className="bg-primary-600 hover:bg-primary-700 text-white px-10 py-2.5 rounded-xl font-bold shadow-lg disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                {editingId ? "Update Service" : "Save Service"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services Grid List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 group hover:shadow-md transition-shadow">
              <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
                {service.imageUrl ? (
                  <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={40} /></div>
                )}
                
                {/* Overlay Action Buttons */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button 
                    onClick={() => handleEdit(service)}
                    className="p-3 bg-white text-slate-800 rounded-full hover:bg-primary-50 hover:text-primary-600 transition-all shadow-md"
                    title="Edit Service"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(service.id)}
                    className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-md"
                    title="Delete Service"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-primary-600">
                  {service.category}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white truncate">{service.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed h-[32px]">{service.shortDescription}</p>
                <div className="pt-4 mt-4 border-t dark:border-slate-800 flex justify-between items-center text-xs font-bold">
                  <span className={service.status === 'active' ? 'text-green-500' : 'text-amber-500'}>● {service.status.toUpperCase()}</span>
                  <span className="text-primary-600 dark:text-primary-400">Starting from ${service.startingPrice}</span>
                </div>
              </div>
            </div>
          ))}

          {services.length === 0 && (
            <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
              <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No services added yet</h3>
              <p className="text-slate-500 text-sm">Create services to display them on the homepage.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageServicesPage;