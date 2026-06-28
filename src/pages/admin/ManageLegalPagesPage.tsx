import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Loader2, Save, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getLegalPage, updateLegalPage } from '../../services/legalPageService';

const LEGAL_PAGES = [
  { id: 'privacy-policy', title: 'Privacy Policy' },
  { id: 'terms-conditions', title: 'Terms & Conditions' },
  { id: 'refund-policy', title: 'Refund Policy' },
];

const ManageLegalPagesPage = () => {
  const [selectedPage, setSelectedPage] = useState(LEGAL_PAGES[0].id);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getLegalPage(selectedPage);
      setContent(data?.content || '');
      setLoading(false);
    };
    fetchData();
  }, [selectedPage]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateLegalPage(selectedPage, { content });
      toast.success('পেজ আপডেট সফল হয়েছে!');
    } catch (error) {
      toast.error('আপডেট করতে ব্যর্থ হয়েছে।');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Helmet><title>Manage Legal Pages | Admin</title></Helmet>

      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Legal Pages</h1>
          <p className="text-slate-500 text-sm mt-1">Edit your Privacy Policy, Terms, and Refund policies here.</p>
        </div>

        <div className="flex gap-4 p-1 bg-slate-100 rounded-xl w-fit">
          {LEGAL_PAGES.map((page) => (
            <button
              key={page.id}
              onClick={() => setSelectedPage(page.id)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                selectedPage === page.id ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {page.title}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary-600" size={32} />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6 space-y-6">
            <div className="h-96">
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent}
                className="h-[300px]"
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link'],
                    ['clean']
                  ],
                }}
              />
            </div>

            <div className="pt-20 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all disabled:opacity-70"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageLegalPagesPage;