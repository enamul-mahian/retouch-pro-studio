import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';
import FileUpload from '../../components/shared/FileUpload'; // আমাদের তৈরি করা কমন আপলোডার
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Loader2, 
  X, 
  CheckCircle2, 
  ImageIcon, 
  Globe,
  BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  coverImageUrl: string;
  cloudinaryPublicId?: string;
  category: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  status: 'published' | 'draft';
  createdAt: any;
  updatedAt: any;
}

const ManageBlogPage = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Tutorial');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState('');
  
  // SEO State
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BlogPost[];
      setBlogs(list);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blog posts");
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

    if (!coverImageUrl) {
      toast.error("দয়া করে ব্লগের জন্য একটি কভার ইমেজ আপলোড করুন।");
      return;
    }

    setSubmitting(true);
    try {
      const generatedSlug = generateSlug(title);
      
      const blogData = {
        title,
        slug: generatedSlug,
        content,
        category,
        coverImageUrl,
        cloudinaryPublicId,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || title,
        seoKeywords,
        status,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, 'blogPosts', editingId), blogData);
        toast.success("Blog post updated successfully!");
      } else {
        await addDoc(collection(db, 'blogPosts'), {
          ...blogData,
          createdAt: serverTimestamp()
        });
        toast.success("Blog post created successfully!");
      }

      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error("Failed to save blog post");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (blog: BlogPost) => {
    setEditingId(blog.id || null);
    setTitle(blog.title);
    setContent(blog.content);
    setCategory(blog.category || 'Tutorial');
    setCoverImageUrl(blog.coverImageUrl);
    setCloudinaryPublicId(blog.cloudinaryPublicId || '');
    setSeoTitle(blog.seoTitle || '');
    setSeoDescription(blog.seoDescription || '');
    setSeoKeywords(blog.seoKeywords || '');
    setStatus(blog.status);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id || !window.confirm("Are you sure you want to delete this blog post?")) return;
    try {
      await deleteDoc(doc(db, 'blogPosts', id));
      toast.success("Blog post deleted");
      setBlogs(blogs.filter(b => b.id !== id));
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('Tutorial');
    setCoverImageUrl('');
    setCloudinaryPublicId('');
    setSeoTitle('');
    setSeoDescription('');
    setSeoKeywords('');
    setStatus('published');
    setEditingId(null);
    setIsFormOpen(false);
  };

  // কাস্টম রিঅ্যাক্ট কুইল মডিউল ও ফরম্যাটস (এডভান্সড অপশনস সহ)
  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // বোল্ড, ইটালিক, আন্ডারলাইন, স্ট্রাইকথ্রু
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],         // হেডিংস/প্যারাগ্রাফ ড্রপডাউন
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],      // অর্ডারড ও বুলেট লিস্ট
      [{ 'align': [] }],                                // text alignment (Left, Center, Right, Justify)
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
        <title>Manage Blogs | Admin Dashboard</title>
      </Helmet>

      {/* কাস্টম সিএসএস স্টাইলব্লক - রিঅ্যাক্ট কুইল এডিটরের ডার্ক মোড কালার ফিক্স করার জন্য */}
      <style>{`
        .ql-editor {
          color: #f8fafc !important; /* text-slate-50 (ডার্ক মোডে লেখার কালার সাদা) */
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
          stroke: #94a3b8 !important; /* slate-400 (আইকনের কালার হালকা করার জন্য) */
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
            <BookOpen className="w-6 h-6 text-primary-600" />
            Manage Blogs
          </h1>
          <p className="text-slate-500 text-sm">Create, edit, or publish blog posts here.</p>
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
          {isFormOpen ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add New Blog</>}
        </button>
      </div>

      {/* Blog Form */}
      {isFormOpen && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 dark:border-slate-800 mb-8 animate-in fade-in duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Column 1: Core details */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Blog Title</label>
                    <input
                      type="text" required value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Photography tips for beginners"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Category</label>
                    <select
                      value={category} onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    >
                      <option value="Tutorial" className="bg-white dark:bg-slate-800">Tutorial</option>
                      <option value="Design Tips" className="bg-white dark:bg-slate-800">Design Tips</option>
                      <option value="Video Editing" className="bg-white dark:bg-slate-800">Video Editing</option>
                      <option value="Studio News" className="bg-white dark:bg-slate-800">Studio News</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Publish Status</label>
                  <select
                    value={status} onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="published" className="bg-white dark:bg-slate-800">Published (Visible)</option>
                    <option value="draft" className="bg-white dark:bg-slate-800">Draft (Hidden)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Blog Content</label>
                  <div className="prose max-w-none dark:prose-invert">
                    <ReactQuill 
                      theme="snow" 
                      value={content} 
                      onChange={setContent}
                      modules={quillModules}
                      formats={quillFormats}
                      className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden min-h-[250px]"
                    />
                  </div>
                </div>
              </div>

              {/* Column 2: Uploads & SEO */}
              <div className="space-y-6">
                
                {/* Image Upload Area */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Cover Image</label>
                  {coverImageUrl ? (
                    <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-800 shadow-sm">
                      <img src={coverImageUrl} alt="Blog Cover" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => { setCoverImageUrl(''); setCloudinaryPublicId(''); }}
                        className="absolute top-2.5 right-2.5 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <FileUpload 
                      onUploadSuccess={(url) => {
                        setCoverImageUrl(url);
                        const publicId = url.split('/').pop()?.split('.')[0] || '';
                        setCloudinaryPublicId(publicId);
                      }} 
                      folder="blogs" 
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
                      placeholder="Defaults to blog title"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">SEO Keywords</label>
                    <input
                      type="text" value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)}
                      placeholder="e.g. photography tips, lighting"
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
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
                {editingId ? "Update Post" : "Save Blog Post"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blogs Grid List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 group hover:shadow-md transition-shadow">
              <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
                {blog.coverImageUrl ? (
                  <img src={blog.coverImageUrl} alt={blog.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={40} /></div>
                )}
                
                {/* Overlay Action Buttons */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button 
                    onClick={() => handleEdit(blog)}
                    className="p-3 bg-white text-slate-800 rounded-full hover:bg-primary-50 hover:text-primary-600 transition-all shadow-md"
                    title="Edit Blog"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(blog.id)}
                    className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-md"
                    title="Delete Blog"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-primary-600">
                  {blog.category}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white truncate">{blog.title}</h3>
                <div className="pt-4 mt-4 border-t dark:border-slate-800 flex justify-between items-center text-xs font-bold">
                  <span className={blog.status === 'published' ? 'text-green-500' : 'text-amber-500'}>● {blog.status.toUpperCase()}</span>
                  <span className="text-slate-400">Slug: {blog.slug.slice(0, 15)}...</span>
                </div>
              </div>
            </div>
          ))}

          {blogs.length === 0 && (
            <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
              <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No blog posts added yet</h3>
              <p className="text-slate-500 text-sm">Create blogs to display them on the website.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageBlogPage;