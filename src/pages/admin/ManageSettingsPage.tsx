import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { getSiteSettings, updateSiteSettings } from '../../services/settingsService';
import type { SiteSettings } from '../../types/settings.types';
import FileUpload from '../../components/shared/FileUpload';
import { 
  Settings, 
  Globe, 
  Phone, 
  Mail, 
  MessageSquare, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube,
  Save, 
  Loader2,
  Image as ImageIcon,
  Search,
  CheckCircle2,
  Clock,
  MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';

const ManageSettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'social' | 'seo'>('general');
  
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Retouch Pro Studio',
    siteTagline: 'Professional Photo Editing Services',
    logoUrl: '',
    faviconUrl: '',
    contact: {
      email: '',
      phone: '',
      whatsapp: '',
      address: '',
      workingHours: 'Mon - Sat: 9am - 6pm'
    },
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      youtube: ''
    },
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    footerText: '',
    copyrightText: `© ${new Date().getFullYear()} Retouch Pro Studio. All rights reserved.`,
    updatedAt: null
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getSiteSettings();
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateSiteSettings(settings);
      toast.success("Settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-medium font-sans">Loading system settings...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <Helmet>
        <title>Site Settings | Admin Dashboard</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary-600" />
            Site Settings
          </h1>
          <p className="text-slate-500 text-sm">Configure your studio's global information and branding.</p>
        </div>
        
        <button
          onClick={handleUpdate}
          disabled={submitting}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary-200 transition-all disabled:opacity-50"
        >
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Tabs Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'general', label: 'General & Branding', icon: ImageIcon },
            { id: 'contact', label: 'Contact Info', icon: Phone },
            { id: 'social', label: 'Social Links', icon: Facebook },
            { id: 'seo', label: 'SEO & Footer', icon: Search },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab.id 
                ? 'bg-primary-600 text-white shadow-md' 
                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 min-h-[500px]">
          <form className="space-y-8">
            
            {/* --- General Settings --- */}
            {activeTab === 'general' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Site Name</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tagline</label>
                    <input
                      type="text"
                      value={settings.siteTagline}
                      onChange={(e) => setSettings({...settings, siteTagline: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700">Website Logo</label>
                    {settings.logoUrl ? (
                      <div className="relative w-full h-32 rounded-2xl border-2 border-slate-100 p-4 bg-slate-50 flex items-center justify-center">
                        <img src={settings.logoUrl} alt="Logo" className="max-h-full object-contain" />
                        <button 
                          onClick={() => setSettings({...settings, logoUrl: ''})}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-md"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <FileUpload onUploadSuccess={(url) => setSettings({...settings, logoUrl: url})} folder="settings" label="Upload Logo" />
                    )}
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700">Favicon (Small Icon)</label>
                    {settings.faviconUrl ? (
                      <div className="relative w-20 h-20 rounded-2xl border-2 border-slate-100 p-4 bg-slate-50 flex items-center justify-center mx-auto">
                        <img src={settings.faviconUrl} alt="Favicon" className="w-full h-full object-contain" />
                        <button 
                          onClick={() => setSettings({...settings, faviconUrl: ''})}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-md"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <FileUpload onUploadSuccess={(url) => setSettings({...settings, faviconUrl: url})} folder="settings" label="Upload Favicon" />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* --- Contact Settings --- */}
            {activeTab === 'contact' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <Mail className="w-4 h-4 text-primary-500" /> Support Email
                    </label>
                    <input
                      type="email"
                      value={settings.contact.email}
                      onChange={(e) => setSettings({
                        ...settings, 
                        contact: {...settings.contact, email: e.target.value}
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <Phone className="w-4 h-4 text-primary-500" /> Phone Number
                    </label>
                    <input
                      type="text"
                      value={settings.contact.phone}
                      onChange={(e) => setSettings({
                        ...settings, 
                        contact: {...settings.contact, phone: e.target.value}
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <MessageSquare className="w-4 h-4 text-green-500" /> WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={settings.contact.whatsapp}
                      onChange={(e) => setSettings({
                        ...settings, 
                        contact: {...settings.contact, whatsapp: e.target.value}
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <Clock className="w-4 h-4 text-primary-500" /> Working Hours
                    </label>
                    <input
                      type="text"
                      value={settings.contact.workingHours}
                      onChange={(e) => setSettings({
                        ...settings, 
                        contact: {...settings.contact, workingHours: e.target.value}
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <MapPin className="w-4 h-4 text-primary-500" /> Studio Address
                  </label>
                  <textarea
                    rows={3}
                    value={settings.contact.address}
                    onChange={(e) => setSettings({
                      ...settings, 
                      contact: {...settings.contact, address: e.target.value}
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
              </div>
            )}

            {/* --- Social Links --- */}
            {activeTab === 'social' && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <p className="text-sm text-slate-500 mb-4 italic">Paste your social media profile URLs below.</p>
                
                {[
                  { id: 'facebook', icon: Facebook, color: 'text-blue-600' },
                  { id: 'instagram', icon: Instagram, color: 'text-pink-600' },
                  { id: 'twitter', icon: Twitter, color: 'text-sky-500' },
                  { id: 'linkedin', icon: Linkedin, color: 'text-blue-700' },
                  { id: 'youtube', icon: Youtube, color: 'text-red-600' },
                ].map((social) => (
                  <div key={social.id} className="flex items-center gap-4">
                    <div className={`p-3 bg-slate-50 rounded-xl ${social.color}`}>
                      <social.icon className="w-5 h-5" />
                    </div>
                    <input
                      type="url"
                      placeholder={`${social.id.charAt(0).toUpperCase() + social.id.slice(1)} URL`}
                      value={(settings.socialLinks as any)[social.id]}
                      onChange={(e) => setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, [social.id]: e.target.value }
                      })}
                      className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* --- SEO & Footer --- */}
            {activeTab === 'seo' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary-600" /> Global SEO Metadata
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">Meta Title</label>
                      <input
                        type="text"
                        value={settings.metaTitle}
                        onChange={(e) => setSettings({...settings, metaTitle: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">Meta Description</label>
                      <textarea
                        rows={2}
                        value={settings.metaDescription}
                        onChange={(e) => setSettings({...settings, metaDescription: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-primary-600" /> Footer Content
                  </h3>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Footer Short Text</label>
                    <textarea
                      rows={2}
                      value={settings.footerText}
                      onChange={(e) => setSettings({...settings, footerText: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Copyright Text</label>
                    <input
                      type="text"
                      value={settings.copyrightText}
                      onChange={(e) => setSettings({...settings, copyrightText: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
};

// Helper internal Icon
const XIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default ManageSettingsPage;