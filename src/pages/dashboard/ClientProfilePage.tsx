import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Building, 
  Save, 
  Loader2,
  ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { updateUserProfile } from '../../services/userService';

const ClientProfilePage = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ফর্ম স্টেট
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    country: '',
    companyName: '',
  });

  // পেজ লোড হওয়ার সময় ইউজারের বর্তমান তথ্যগুলো ফর্মে বসানো
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        country: user.country || '',
        companyName: user.companyName || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.uid) return;

    if (!formData.name || !formData.phone) {
      toast.error('নাম এবং ফোন নম্বর দেওয়া আবশ্যক।');
      return;
    }

    setIsSubmitting(true);
    try {
      // userService ব্যবহার করে ডাটাবেসে তথ্য আপডেট করা
      await updateUserProfile(user.uid, formData);
      toast.success('প্রোফাইল সফলভাবে আপডেট করা হয়েছে!');
    } catch (error: any) {
      toast.error(error.message || 'আপডেট করতে সমস্যা হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Profile Settings | Retouch Pro Studio</title>
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Profile Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your personal and company information.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Side: Profile Summary Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft text-center">
              <div className="w-24 h-24 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-3xl font-bold border-4 border-white shadow-md mx-auto mb-4">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-lg font-bold text-slate-800">{user?.name}</h2>
              <p className="text-sm text-slate-400 mb-6">{user?.email}</p>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                <ShieldCheck size={14} />
                Verified Client
              </div>
            </div>

            <div className="bg-primary-600 p-6 rounded-3xl text-white shadow-premium">
              <h3 className="font-bold mb-2">Account Status</h3>
              <p className="text-primary-100 text-xs leading-relaxed">
                Your account is in good standing. You can manage your projects and payments easily.
              </p>
            </div>
          </div>

          {/* Right Side: Edit Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden">
              <div className="p-6 md:p-8 space-y-6">
                
                {/* Personal Info Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <User size={16} className="text-primary-500" /> Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm"
                      />
                    </div>

                    <div className="space-y-1.5 opacity-60">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Mail size={16} className="text-slate-400" /> Email Address
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl cursor-not-allowed text-sm text-slate-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Phone size={16} className="text-primary-500" /> Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Globe size={16} className="text-primary-500" /> Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-slate-50" />

                {/* Company Info Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Business Information</h3>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Building size={16} className="text-primary-500" /> Company Name
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm"
                      placeholder="e.g. Acme Agency Ltd."
                    />
                  </div>
                </div>

              </div>

              {/* Form Footer / Actions */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all shadow-soft disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Save Changes
                      <Save size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </>
  );
};

export default ClientProfilePage;