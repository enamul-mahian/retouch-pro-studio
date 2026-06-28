import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  getAllPackages, 
  addPackage, 
  updatePackage, 
  deletePackage 
} from '../../services/packageService';
import type { PricingPackage } from '../../types/package.types';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Loader2, 
  DollarSign, 
  Check, 
  X, 
  Star, 
  Image as ImageIcon, 
  Video, 
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';

const ManagePackagesPage = () => {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Omit<PricingPackage, 'id' | 'createdAt'>>({
    name: '',
    description: '',
    price: 0,
    unit: 'per image',
    features: [],
    isPopular: false,
    category: 'image-editing',
    status: 'active',
    displayOrder: 0
  });

  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const data = await getAllPackages();
      setPackages(data);
    } catch (error) {
      toast.error("Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData({ ...formData, features: [...formData.features, newFeature.trim()] });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updatedFeatures });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Smart Logic: যদি ইউজার বক্সে কিছু লিখে কিন্তু প্লাস (+) বাটনে ক্লিক না করে
    let finalFeatures = [...formData.features];
    if (newFeature.trim()) {
      finalFeatures.push(newFeature.trim());
      setNewFeature(''); // ইনপুট বক্স ক্লিয়ার করে দিলাম
    }

    if (finalFeatures.length === 0) {
      toast.error("Please add at least one feature");
      return;
    }

    const dataToSave = { ...formData, features: finalFeatures };

    setSubmitting(true);
    try {
      if (editingId) {
        await updatePackage(editingId, dataToSave);
        toast.success("Package updated successfully!");
      } else {
        await addPackage(dataToSave);
        toast.success("Package added successfully!");
      }
      resetForm();
      fetchPackages();
    } catch (error) {
      toast.error("Error saving package");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (pkg: PricingPackage) => {
    setEditingId(pkg.id || null);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      unit: pkg.unit,
      features: pkg.features,
      isPopular: pkg.isPopular,
      category: pkg.category,
      status: pkg.status,
      displayOrder: pkg.displayOrder
    });
    setNewFeature('');
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this package?")) return;

    try {
      await deletePackage(id);
      toast.success("Item deleted successfully");
      setPackages(packages.filter(item => item.id !== id));
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      unit: 'per image',
      features: [],
      isPopular: false,
      category: 'image-editing',
      status: 'active',
      displayOrder: packages.length
    });
    setNewFeature('');
    setEditingId(null);
    setIsFormOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Helmet>
        <title>Manage Pricing | Admin Dashboard</title>
      </Helmet>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-primary-600" />
            Pricing Packages
          </h1>
          <p className="text-slate-500 text-sm">Create and manage your service pricing plans.</p>
        </div>

        <button
          onClick={() => {
            if(isFormOpen) resetForm();
            else setIsFormOpen(true);
          }}
          className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all ${
            isFormOpen 
            ? 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300' 
            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-200 dark:shadow-none'
          }`}
        >
          {isFormOpen ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add New Package</>}
        </button>
      </div>

      {/* Add New Form */}
      {isFormOpen && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Column 1: Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, category: 'image-editing'})}
                      className={`py-2 rounded-lg border-2 flex items-center justify-center gap-2 font-bold text-xs transition-all ${formData.category === 'image-editing' ? 'border-primary-600 bg-primary-50 text-primary-600' : 'border-slate-100 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-800'}`}
                    >
                      <ImageIcon className="w-4 h-4" /> Image Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, category: 'video-editing'})}
                      className={`py-2 rounded-lg border-2 flex items-center justify-center gap-2 font-bold text-xs transition-all ${formData.category === 'video-editing' ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-slate-100 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-800'}`}
                    >
                      <Video className="w-4 h-4" /> Video Edit
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs uppercase">Package Name</label>
                  <input
                    type="text" required value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. 15 Second video"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs uppercase">Price ($)</label>
                    <input
                      type="number" step="0.01" required value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs uppercase">Unit</label>
                    <input
                      type="text" required value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      placeholder="per video"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Column 2: Features */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs uppercase">Features List</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Type feature and press Enter..."
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-white"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                  />
                  <button
                    type="button" onClick={handleAddFeature}
                    className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-700">
                      <span className="text-sm text-slate-700 dark:text-slate-300 line-clamp-1">{feature}</span>
                      <button type="button" onClick={() => removeFeature(index)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded-md transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {formData.features.length === 0 && !newFeature && (
                    <p className="text-xs text-slate-400 italic">No features added yet.</p>
                  )}
                </div>
              </div>

              {/* Column 3: Extras */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs uppercase">Description</label>
                  <textarea
                    rows={3} value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Short summary..."
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-white"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 cursor-pointer" onClick={() => setFormData({...formData, isPopular: !formData.isPopular})}>
                   <div className="flex items-center gap-2">
                      <Star className={`w-5 h-5 ${formData.isPopular ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-500'}`} />
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Most Popular?</span>
                   </div>
                   <input
                      type="checkbox" checked={formData.isPopular}
                      readOnly
                      className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit" disabled={submitting}
                className="bg-primary-600 hover:bg-primary-700 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-primary-200 dark:shadow-none disabled:opacity-50 flex items-center gap-2 transition-all"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {editingId ? "Update Package" : "Save Package"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className={`bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 transition-all hover:shadow-md ${pkg.isPopular ? 'border-primary-500 shadow-lg' : 'border-slate-100 dark:border-slate-800 shadow-sm'}`}>
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${pkg.category === 'image-editing' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                  {pkg.category.replace('-', ' ')}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(pkg)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-primary-600 transition-colors"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => pkg.id && handleDelete(pkg.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{pkg.name}</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">${pkg.price}</span>
                <span className="text-slate-400 text-xs font-medium ml-1">/ {pkg.unit}</span>
              </div>

              <ul className="space-y-2 mb-6">
                {pkg.features.slice(0, 5).map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    <Check className="w-3 h-3 text-green-500 shrink-0 mt-0.5" /> <span className="line-clamp-1">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                <span className={pkg.status === 'active' ? 'text-green-500' : 'text-amber-500'}>{pkg.status}</span>
                {pkg.isPopular && <span className="text-primary-600 flex items-center gap-1"><Star className="w-3 h-3 fill-primary-600" /> Popular</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagePackagesPage;