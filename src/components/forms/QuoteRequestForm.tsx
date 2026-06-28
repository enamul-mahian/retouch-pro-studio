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
    quantity: '',
    deadline: '',
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
    setUploadedFileUrls(urls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.serviceType || !formData.description) {
      toast.error('দয়া করে প্রয়োজনীয় সব তথ্য দিন।');
      return;
    }

    // যদি প্রজেক্টের জন্য ফাইল আপলোড করা বাধ্যতামূলক করতে চান, নিচের লজিকটি চালু করতে পারেন
    /*
    if (uploadedFileUrls.length === 0) {
      toast.error('দয়া করে অন্তত একটি স্যাম্পল ফাইল আপলোড করুন।');
      return;
    }
    */

    setIsSubmitting(true);
    try {
      // ফায়ারস্টোরে ডাটা সেভ করা
      await addDoc(collection(db, 'quoteRequests'), {
        ...formData,
        fileUrls: uploadedFileUrls, // ক্লাউডিনারির ফাইল লিঙ্কগুলো এখানে সেভ হচ্ছে
        clientId: user?.uid || 'guest',
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success('আপনার কোটেশন রিকোয়েস্টটি সফলভাবে জমা হয়েছে!');
      
      if (user) {
        navigate('/dashboard/quotes');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Quote Submission Error:', error);
      toast.error('দুঃখিত, রিকোয়েস্ট পাঠানো সম্ভব হয়নি।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* কন্টাক্ট ইনফরমেশন */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <User size={16} className="text-primary-500" /> Full Name *
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Mail size={16} className="text-primary-500" /> Email Address *
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm"
            placeholder="john@example.com"
          />
        </div>
      </div>

      {/* প্রজেক্ট ডিটেইলস */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Layers size={16} className="text-primary-500" /> Service Type *
          </label>
          <select
            name="serviceType"
            required
            value={formData.serviceType}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm"
          >
            <option value="">Select a service</option>
            {SERVICES.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Hash size={16} className="text-primary-500" /> Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm"
            placeholder="e.g. 100"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Calendar size={16} className="text-primary-500" /> Deadline
          </label>
          <input
            type="text"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm"
            placeholder="e.g. 24 Hours"
          />
        </div>
      </div>

      {/* মেসেজ সেকশন */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <MessageSquare size={16} className="text-primary-500" /> Project Description *
        </label>
        <textarea
          name="description"
          required
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm resize-none"
          placeholder="Please describe your instructions..."
        />
      </div>

      {/* রিয়েল ফাইল আপলোড কম্পোনেন্ট */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
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