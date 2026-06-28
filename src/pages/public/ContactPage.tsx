import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../../components/contexts/SettingsContext';
import { db } from '../../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const { settings } = useSettings();
  
  // ডাইনামিক সেটিংস থেকে কন্টাক্ট ইনফো নেওয়া হচ্ছে, না থাকলে ডিফল্ট ভ্যালু দেখাবে
  const contactInfo = settings?.contact || {
    email: 'hello@retouchprostudio.com',
    phone: '+44 20 1234 5678',
    whatsapp: '+44 7700 900000',
    address: '123 Business Avenue,\nLondon, UK SW1A 1AA',
    workingHours: 'Mon - Sat: 9am - 6pm'
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      // ফায়ারবেসে মেসেজ সেভ করা হচ্ছে
      await addDoc(collection(db, 'contactMessages'), {
        ...formData,
        status: 'unread',
        createdAt: serverTimestamp()
      });

      setIsSuccess(true);
      toast.success("Message sent successfully!");
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // 5 সেকেন্ড পর সাকসেস মেসেজ হাইড করে আবার ফর্ম দেখাবে
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Retouch Pro Studio</title>
        <meta name="description" content="Get in touch with Retouch Pro Studio for high-quality photo and video editing services. We are available 24/7 to assist you." />
      </Helmet>

      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-24 font-sans">
        
        {/* Header Hero Section */}
        <section className="bg-slate-900 pt-32 pb-24 px-4 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto max-w-7xl relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">Conversation</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Have a question about our services or need a custom quote for a bulk project? Our team is ready to help you 24/7.
            </p>
          </div>
        </section>

        {/* Contact Content Section */}
        <section className="container mx-auto px-4 max-w-7xl -mt-10 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              {/* Address Card */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-2xl flex items-center justify-center mb-6">
                  <MapPin size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Our Location</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                  {contactInfo.address}
                </p>
              </div>

              {/* Contact Details Card */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <Phone size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Contact Details</h3>
                <div className="space-y-4">
                  <a href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`} className="flex items-center gap-3 text-slate-500 hover:text-primary-600 transition-colors group">
                    <Phone size={18} className="text-slate-400 group-hover:text-primary-600" />
                    <span className="font-medium">{contactInfo.phone}</span>
                  </a>
                  <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-3 text-slate-500 hover:text-primary-600 transition-colors group">
                    <Mail size={18} className="text-slate-400 group-hover:text-primary-600" />
                    <span className="font-medium">{contactInfo.email}</span>
                  </a>
                  {contactInfo.whatsapp && (
                    <a href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-500 hover:text-green-500 transition-colors group">
                      <MessageSquare size={18} className="text-slate-400 group-hover:text-green-500" />
                      <span className="font-medium">WhatsApp Available</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Working Hours Card */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                  <Clock size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Working Hours</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  {contactInfo.workingHours}
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  (Support team is available 24/7)
                </p>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 h-full">
                {isSuccess ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-500 mb-6">
                      <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-4">Message Sent!</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                      Thank you for reaching out. Our support team will get back to you at <span className="font-medium text-slate-700 dark:text-slate-300">{formData.email}</span> very soon.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-3">Send us a Message</h2>
                      <p className="text-slate-500 dark:text-slate-400">Fill out the form below and we will get back to you within 24 hours.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Your Name <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="w-full px-5 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all text-slate-800 dark:text-slate-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Email Address <span className="text-red-500">*</span></label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            className="w-full px-5 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all text-slate-800 dark:text-slate-200"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Subject</label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="How can we help you?"
                          className="w-full px-5 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all text-slate-800 dark:text-slate-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Message <span className="text-red-500">*</span></label>
                        <textarea
                          name="message"
                          required
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us about your project or inquiry..."
                          className="w-full px-5 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all resize-none text-slate-800 dark:text-slate-200"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-200 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <><Loader2 size={20} className="animate-spin" /> Sending...</>
                        ) : (
                          <><Send size={20} /> Send Message</>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
            
          </div>
        </section>

      </div>
    </>
  );
};

export default ContactPage;