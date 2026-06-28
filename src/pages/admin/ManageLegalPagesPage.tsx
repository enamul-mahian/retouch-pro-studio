import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  Shield, 
  Loader2, 
  CheckCircle2, 
  Save, 
  FileText 
} from 'lucide-react';
import toast from 'react-hot-toast';

type LegalTab = 'privacy-policy' | 'terms-and-conditions' | 'refund-policy';

const ManageLegalPagesPage = () => {
  const [activeTab, setActiveTab] = useState<LegalTab>('privacy-policy');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPageContent();
  }, [activeTab]);

  const fetchPageContent = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'legalPages', activeTab);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setContent(docSnap.data().content || '');
      } else {
        setContent(''); // যদি কোনো ডাটা আগে সেভ করা না থাকে
      }
    } catch (error) {
      console.error("Error fetching legal page content:", error);
      toast.error("Failed to load page content.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error("Please write some content before saving.");
      return;
    }

    setSaving(true);
    try {
      const docRef = doc(db, 'legalPages', activeTab);
      await setDoc(docRef, {
        content,
        updatedAt: serverTimestamp()
      }, { merge: true });

      toast.success("Page updated successfully!");
    } catch (error) {
      console.error("Error saving legal page:", error);
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
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
        <title>Manage Legal Pages | Admin Dashboard</title>
      </Helmet>

      {/* কাস্টম সিএসএস স্টাইলব্লক - রিঅ্যাক্ট কুইল এডিটরের ডার্ক মোড কালার ফিক্স করার জন্য */}
      <style>{`
        .ql-editor {
          color: #f8fafc !important; /* text-slate-50 (ডার্ক মোডে লেখার কালার সাদা) */
          font-family: inherit;
          font-size: 14px;
          min-height: 250px;
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary-600" />
          Manage Legal Pages
        </h1>
        <p className="text-slate-500 text-sm mt-1">Edit your Privacy Policy, Terms, and Refund policies here.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
        <button
          onClick={() => setActiveTab('privacy-policy')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'privacy-policy' ? 'bg-primary-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setActiveTab('terms-and-conditions')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'terms-and-conditions' ? 'bg-primary-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          Terms & Conditions
        </button>
        <button
          onClick={() => setActiveTab('refund-policy')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'refund-policy' ? 'bg-primary-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          Refund Policy
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 dark:border-slate-800">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading page content...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="prose max-w-none dark:prose-invert">
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent}
                modules={quillModules}
                formats={quillFormats}
                className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden min-h-[300px]"
              />
            </div>

            <div className="flex justify-end pt-4 border-t dark:border-slate-800">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary-600 hover:bg-primary-700 text-white px-10 py-3 rounded-xl font-bold shadow-lg disabled:opacity-50 flex items-center gap-2 transition-all"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageLegalPagesPage;