import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, 
  User, 
  Mail, 
  Layers, 
  Hash, 
  Calendar, 
  MessageSquare, 
  Loader2,
  FileCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import FileUpload from './FileUpload';

const SERVICES = [
  "Clipping Path",
  "Photo Retouching",
  "Image Masking",
  "Shadow Making",
  "E-Commerce Photo Editing",
  "Ghost Mannequin Effect",
  "Real Estate Photo Editing",
  "Short Video Editing",
  "Other"
];

const QuoteRequestForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFileUrls, setUploadedFileUrls] = useState<string[]>([]);

  // ফর্ম স্টেট
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    serviceType: '',
    quantity: '1',
    deadline: '24 Hours',
    description: '',
  });

  // ইউজার লগিন থাকলে ডাটা অটো-ফিল করা
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        country: user.country || '',
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ফাইল আপলোড শেষ হলে এই ফাংশনটি কল হবে
  const handleUploadComplete = (urls: string[]) => {
    setUploadedFileUrls(urls || []);
    console.log("Files uploaded successfully to state:", urls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.serviceType || !formData.description) {
      toast.error('দয়া করে প্রয়োজনীয় সব তথ্য দিন।');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('আপনার রিকোয়েস্টটি পাঠানো হচ্ছে...');

    try {
      // ফায়ারস্টোর সেভ করার আগে প্রতিটি ফিল্ড চেক করে undefined ভ্যালু দূর করা হলো
      const submissionData = {
        name: formData.name || '',
        email: formData.email || '',
        country: formData.country || 'Not Specified',
        serviceType: formData.serviceType || '',
        quantity: formData.quantity || '1',
        deadline: formData.deadline || '24 Hours',
        description: formData.description || '',
        fileUrls: uploadedFileUrls || [], // নিশ্চিত করা হলো এটি যেন undefined না হয়
        userId: user?.uid || 'guest',
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      console.log("Submitting sanitized data:", submissionData);

      // ফায়ারস্টোরে ডাটা সেভ করা
      const docRef = await addDoc(collection(db, 'quoteRequests'), submissionData);
      console.log("Document successfully written with ID: ", docRef.id);

      toast.success('আপনার কোটেশন রিকোয়েস্টটি সফলভাবে জমা হয়েছে!', { id: loadingToast });
      
      // ফর্ম রিঅ্যাক্ট স্টেট রিসেট করা
      setFormData({
        name: '',
        email: '',
        country: '',
        serviceType: '',
        quantity: '1',
        deadline: '24 Hours',
        description: '',
      });
      setUploadedFileUrls([]);

      setTimeout(() => {
        if (user) {
          navigate('/dashboard/quotes');
        } else {
          navigate('/');
        }
      }, 2000);

    } catch (error: any) {
      console.error('Detailed Quote Submission Error:', error);
      toast.error('দুঃখিত, রিকোয়েস্ট পাঠানো সম্ভব হয়নি। দয়া করে আবার চেষ্টা করুন।', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* কন্টাক্ট ইনফরমেশন */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <User size={16} className="text-primary-500" /> Full Name *
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name || ''}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm text-slate-900 dark:text-white"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Mail size={16} className="text-primary-500" /> Email Address *
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email || ''}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm text-slate-900 dark:text-white"
            placeholder="john@example.com"
          />
        </div>
      </div>

      {/* প্রজেক্ট ডিটেইলস */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Layers size={16} className="text-primary-500" /> Service Type *
          </label>
          <select
            name="serviceType"
            required
            value={formData.serviceType || ''}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm text-slate-900 dark:text-white"
          >
            <option value="">Select a service</option>
            {SERVICES.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Hash size={16} className="text-primary-500" /> Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity || ''}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm text-slate-900 dark:text-white"
            placeholder="e.g. 100"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Calendar size={16} className="text-primary-500" /> Deadline
          </label>
          <input
            type="text"
            name="deadline"
            value={formData.deadline || ''}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm text-slate-900 dark:text-white"
            placeholder="e.g. 24 Hours"
          />
        </div>
      </div>

      {/* মেসেজ সেকশন */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <MessageSquare size={16} className="text-primary-500" /> Project Description *
        </label>
        <textarea
          name="description"
          required
          rows={4}
          value={formData.description || ''}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none text-sm text-slate-900 dark:text-white resize-none"
          placeholder="Please describe your instructions..."
        />
      </div>

      {/* ফাইল আপলোড কম্পোনেন্ট */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <FileCheck size={16} className="text-primary-500" /> Upload Sample Files
        </label>
        <FileUpload onUploadComplete={handleUploadComplete} maxFiles={10} />
      </div>

      {/* সাবমিট বাটন */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold transition-all shadow-premium hover:shadow-primary/40 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Submitting Quote Request...
          </>
        ) : (
          <>
            Submit Quote Request
            <Send size={18} />
          </>
        )}
      </button>

      <p className="text-[11px] text-slate-400 text-center leading-relaxed">
        Our team will analyze your files and send you a custom price quote shortly.
      </p>
    </form>
  );
};

export default QuoteRequestForm;