import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Plus, Search, Edit2, Trash2, Globe, DollarSign, 
  Layers, Image as ImageIcon, X, Loader2, CheckCircle2,
  AlertTriangle, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { getAllServices, createService, updateService, deleteService } from '../../services/serviceService';
import FileUpload from '../../components/forms/FileUpload';
import type { Service, ServiceStatus } from '../../types/service.types';

const ManageServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // ফরম স্টেট
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    category: 'Image Editing',
    startingPrice: 0,
    imageUrl: '',
    cloudinaryPublicId: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    status: 'active' as ServiceStatus
  });

  // ডাটা লোড করা
  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getAllServices();
      setServices(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ইনপুট হ্যান্ডেলার
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      // যদি টাইটেল চেঞ্জ হয়, তবে অটোমেটিক স্লাগ (Slug) তৈরি করা
      if (name === 'title' && !editingId) {
        newData.slug = value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      }
      return newData;
    });
  };

  // রিচ টেক্সট এডিটর হ্যান্ডেলার
  const handleDescriptionChange = (content: string) => {
    setFormData(prev => ({ ...prev, fullDescription: content }));
  };

  // ইমেজ আপলোড হ্যান্ডেলার
  const handleImageUpload = (urls: string[]) => {
    if (urls.length > 0) {
      setFormData(prev => ({ 
        ...prev, 
        imageUrl: urls[0],
        cloudinaryPublicId: 'uploaded_via_form' // এটি ক্লাউডিনারি রেসপন্স থেকে আরও নিখুঁত করা যায়
      }));
    }
  };

  // ফরম রিসেট করা
  const resetForm = () => {
    setFormData({
      title: '', slug: '', shortDescription: '', fullDescription: '',
      category: 'Image Editing', startingPrice: 0, imageUrl: '',
      cloudinaryPublicId: '', seoTitle: '', seoDescription: '',
      seoKeywords: '', status: 'active'
    });
    setEditingId(null);
  };

  // সার্ভিস সেভ বা আপডেট করা
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      toast.error('দয়া করে সার্ভিসের একটি ইমেজ আপলোড করুন।');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateService(editingId, formData);
        toast.success('সার্ভিস সফলভাবে আপডেট হয়েছে!');
      } else {
        await createService(formData);
        toast.success('নতুন সার্ভিস সফলভাবে যুক্ত হয়েছে!');
      }
      setIsModalOpen(false);
      resetForm();
      fetchServices();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // সার্ভিস ডিলিট করা
  const handleDelete = async (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই সার্ভিসটি ডিলিট করতে চান?')) {
      try {
        await deleteService(id);
        toast.success('সার্ভিস ডিলিট করা হয়েছে।');
        fetchServices();
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  // এডিট মোড ওপেন করা
  const openEditModal = (service: Service) => {
    setFormData({
      title: service.title,
      slug: service.slug,
      shortDescription: service.shortDescription,
      fullDescription: service.fullDescription,
      category: service.category,
      startingPrice: service.startingPrice,
      imageUrl: service.imageUrl,
      cloudinaryPublicId: service.cloudinaryPublicId,
      seoTitle: service.seoTitle,
      seoDescription: service.seoDescription,
      seoKeywords: service.seoKeywords,
      status: service.status
    });
    setEditingId(service.id || null);
    setIsModalOpen(true);
  };

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && services.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 size={40} className="text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Manage Services | Admin Panel</title>
      </Helmet>

      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Manage Services</h1>
            <p className="text-slate-500 text-sm mt-1">Add or update your image and video editing services.</p>
          </div>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold transition-all shadow-soft"
          >
            <Plus size={18} />
            Add New Service
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm"
          />
        </div>

        {/* Services Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                          <img src={service.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{service.title}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">{service.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-700">${service.startingPrice}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        service.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {service.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(service)}
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(service.id!)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-slide-up">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center">
                    {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{editingId ? 'Edit Service' : 'Add New Service'}</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <form id="service-form" onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Section 1: Basic Information */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Layers size={14} /> Basic Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Service Title *</label>
                        <input 
                          type="text" name="title" required value={formData.title} onChange={handleChange}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none text-sm"
                          placeholder="e.g. Professional Photo Retouching"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">URL Slug *</label>
                        <input 
                          type="text" name="slug" required value={formData.slug} onChange={handleChange}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none text-sm"
                          placeholder="photo-retouching"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Category</label>
                        <select 
                          name="category" value={formData.category} onChange={handleChange}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none text-sm"
                        >
                          <option value="Image Editing">Image Editing</option>
                          <option value="Video Editing">Video Editing</option>
                          <option value="Vector Conversion">Vector Conversion</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Starting Price ($)</label>
                        <input 
                          type="number" step="0.01" name="startingPrice" required value={formData.startingPrice} onChange={handleChange}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Short Description (for cards)</label>
                      <textarea 
                        name="shortDescription" required value={formData.shortDescription} onChange={handleChange} rows={2}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none text-sm resize-none"
                      />
                    </div>
                  </div>

                  {/* Section 2: Detailed Content (Rich Text) */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Edit2 size={14} /> Full Description
                    </h4>
                    <div className="h-64 mb-12">
                      <ReactQuill 
                        theme="snow" 
                        value={formData.fullDescription} 
                        onChange={handleDescriptionChange}
                        className="h-full rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Section 3: Media */}
                  <div className="space-y-4 pt-8">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <ImageIcon size={14} /> Service Image
                    </h4>
                    {formData.imageUrl ? (
                      <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-slate-200 group">
                        <img src={formData.imageUrl} alt="" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                          className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <FileUpload onUploadComplete={handleImageUpload} maxFiles={1} folder="services" />
                    )}
                  </div>

                  {/* Section 4: SEO Settings */}
                  <div className="space-y-4 pt-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Globe size={14} /> SEO Settings (Required)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">SEO Title</label>
                        <input 
                          type="text" name="seoTitle" required value={formData.seoTitle} onChange={handleChange}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">SEO Keywords</label>
                        <input 
                          type="text" name="seoKeywords" required value={formData.seoKeywords} onChange={handleChange}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none text-sm"
                          placeholder="clipping path, photo editing, uk"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">SEO Meta Description</label>
                      <textarea 
                        name="seoDescription" required value={formData.seoDescription} onChange={handleChange} rows={2}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none text-sm resize-none"
                      />
                    </div>
                  </div>

                  {/* Section 5: Status */}
                  <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-800">Publish Status</p>
                      <p className="text-xs text-slate-500">Active services are visible on the website.</p>
                    </div>
                    <select 
                      name="status" value={formData.status} onChange={handleChange}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border-none outline-none shadow-sm cursor-pointer ${
                        formData.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'
                      }`}
                    >
                      <option value="active">ACTIVE</option>
                      <option value="draft">DRAFT</option>
                    </select>
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button 
                  form="service-form"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-100 flex items-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                  {editingId ? 'Update Service' : 'Create Service'}
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageServicesPage;