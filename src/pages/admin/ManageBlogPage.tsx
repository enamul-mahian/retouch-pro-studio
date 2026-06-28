import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit2, Trash2, Loader2, X, Save, FileText, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getAllBlogs, createBlog, updateBlog, deleteBlog } from '../../services/blogService';
import FileUpload from '../../components/forms/FileUpload';
import type { BlogPost } from '../../types/blog.types';

const ManageBlogPage = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ব্লগ ফরম স্টেট
  const [formData, setFormData] = useState<any>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImageUrl: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    status: 'draft'
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getAllBlogs();
      setBlogs(data);
    } catch (error) {
      toast.error('Error fetching blogs');
    } finally {
      setLoading(false);
    }
  };

  // টাইটেল পরিবর্তনের সাথে সাথে অটো-স্লাগ জেনারেশন
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev: any) => ({
      ...prev,
      title: val,
      slug: editingId ? prev.slug : val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.coverImageUrl) {
      toast.error('দয়া করে ব্লগের জন্য একটি কভার ইমেজ আপলোড করুন।');
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateBlog(editingId, formData);
        toast.success('ব্লগ পোস্ট সফলভাবে আপডেট করা হয়েছে!');
      } else {
        await createBlog({ ...formData, authorId: 'admin' });
        toast.success('নতুন ব্লগ পোস্ট সফলভাবে যুক্ত হয়েছে!');
      }
      setIsModalOpen(false);
      resetForm();
      fetchBlogs();
    } catch (error) {
      toast.error('ব্লগ সেভ করতে সমস্যা হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', slug: '', excerpt: '', content: '', coverImageUrl: '',
      seoTitle: '', seoDescription: '', seoKeywords: '', status: 'draft'
    });
    setEditingId(null);
  };

  const handleEdit = (blog: BlogPost) => {
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || '',
      content: blog.content,
      coverImageUrl: blog.coverImageUrl,
      seoTitle: blog.seoTitle || '',
      seoDescription: blog.seoDescription || '',
      seoKeywords: blog.seoKeywords || '',
      status: blog.status
    });
    setEditingId(blog.id || null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই ব্লগ পোস্টটি ডিলিট করতে চান?')) {
      try {
        await deleteBlog(id);
        toast.success('ব্লগটি সফলভাবে ডিলিট করা হয়েছে।');
        fetchBlogs();
      } catch (error) {
        toast.error('ডিলিট করা সম্ভব হয়নি।');
      }
    }
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 size={40} className="text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Manage Blogs | Admin</title></Helmet>
      <div className="space-y-6 font-sans">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Manage Blogs</h1>
            <p className="text-slate-500 text-sm mt-1">Create, edit, and publish blog posts.</p>
          </div>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }} 
            className="bg-primary-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold text-sm hover:bg-primary-700 transition-all shadow-soft"
          >
            <Plus size={18} /> Add Blog Post
          </button>
        </div>

        {/* Blog Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Cover & Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {blogs.map(blog => (
                  <tr key={blog.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                          <img src={blog.coverImageUrl} className="w-full h-full object-cover" alt="" />
                        </div>
                        <span className="font-bold text-slate-800 text-sm">{blog.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold border ${
                        blog.status === 'published' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(blog)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete(blog.id!)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-4xl p-6 md:p-8 rounded-3xl max-h-[90vh] overflow-y-auto space-y-6 animate-slide-up">
              <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                <h2 className="text-xl font-bold text-slate-800">{editingId ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-full transition-colors"><X /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Blog Title *</label>
                    <input type="text" placeholder="e.g. 5 Editing Tips for Amateurs" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 text-sm" value={formData.title} onChange={handleTitleChange} required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Slug *</label>
                    <input type="text" placeholder="slug-url" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 text-sm" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Excerpt (Short intro) *</label>
                  <textarea placeholder="Write a short summary..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 text-sm resize-none" rows={2} value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} required />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Blog Content *</label>
                  <div className="h-64 mb-12">
                    <ReactQuill theme="snow" value={formData.content} onChange={val => setFormData({...formData, content: val})} className="h-full" />
                  </div>
                </div>

                <div className="space-y-2 pt-6">
                  <label className="text-xs font-bold text-slate-700">Cover Image *</label>
                  {formData.coverImageUrl ? (
                    <div className="relative h-48 rounded-xl overflow-hidden group border border-slate-200">
                      <img src={formData.coverImageUrl} className="w-full h-full object-cover" alt="" />
                      <button type="button" onClick={() => setFormData({...formData, coverImageUrl: ''})} className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"><X size={16} /></button>
                    </div>
                  ) : (
                    <FileUpload onUploadComplete={(urls) => setFormData({...formData, coverImageUrl: urls[0]})} maxFiles={1} folder="blogs" />
                  )}
                </div>

                {/* SEO Block */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">SEO Title</label>
                    <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" value={formData.seoTitle} onChange={e => setFormData({...formData, seoTitle: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">SEO Keywords</label>
                    <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" value={formData.seoKeywords} onChange={e => setFormData({...formData, seoKeywords: e.target.value})} />
                  </div>
                </div>

                {/* Status Selector Dropdown (পাবলিশড বা ড্রাফট সিলেক্টর) */}
                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Publish Status</p>
                    <p className="text-xs text-slate-500">Only Published blogs are visible on the website.</p>
                  </div>
                  <select 
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border-none outline-none shadow-sm cursor-pointer text-white ${
                      formData.status === 'published' ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                  >
                    <option value="draft">DRAFT</option>
                    <option value="published">PUBLISHED</option>
                  </select>
                </div>
                
                <button type="submit" disabled={isSubmitting} className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 transition-all">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
                  Save Blog Post
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageBlogPage;