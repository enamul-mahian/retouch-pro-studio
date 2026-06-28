import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { getAllTeammates, addTeammate, deleteTeammate } from '../../services/teammateService';
import type { Teammate } from '../../types/teammate.types';
import { 
  Plus, 
  Trash2, 
  Users, 
  Loader2, 
  CheckCircle2, 
  UserPlus,
  X,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';

const ManageTeammatesPage = () => {
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'designer' as 'designer' | 'editor' | 'production-manager',
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    fetchTeammates();
  }, []);

  const fetchTeammates = async () => {
    try {
      const data = await getAllTeammates();
      setTeammates(data);
    } catch (error) {
      toast.error("Failed to load team");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addTeammate(formData);
      toast.success("Teammate added successfully!");
      resetForm();
      fetchTeammates();
    } catch (error) {
      toast.error("Failed to add teammate");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id || !window.confirm("Remove this teammate?")) return;
    try {
      await deleteTeammate(id);
      toast.success("Teammate removed");
      setTeammates(teammates.filter(t => t.id !== id));
    } catch (error) {
      toast.error("Failed to remove");
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', role: 'designer', status: 'active' });
    setIsFormOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Helmet>
        <title>Manage Teammates | Admin Dashboard</title>
      </Helmet>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-primary-600" /> Team Members
          </h1>
          <p className="text-slate-500 text-sm">Manage your studio production team.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary-200"
        >
          {isFormOpen ? <X className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          {isFormOpen ? "Cancel" : "Add Teammate"}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm mb-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" placeholder="Full Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="px-4 py-2 rounded-xl border border-slate-200 dark:bg-slate-800 outline-none" />
            <input type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="px-4 py-2 rounded-xl border border-slate-200 dark:bg-slate-800 outline-none" />
            <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value as any})} className="px-4 py-2 rounded-xl border border-slate-200 dark:bg-slate-800 outline-none">
              <option value="designer">Designer</option>
              <option value="editor">Editor</option>
              <option value="production-manager">Manager</option>
            </select>
            <button type="submit" disabled={submitting} className="bg-emerald-600 text-white rounded-xl font-bold">
              {submitting ? <Loader2 className="animate-spin mx-auto" /> : "Save"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-primary-600" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teammates.map((member) => (
            <div key={member.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-600">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white">{member.name}</h3>
                  <p className="text-xs text-slate-500 uppercase font-bold">{member.role}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(member.id!)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={18} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageTeammatesPage;