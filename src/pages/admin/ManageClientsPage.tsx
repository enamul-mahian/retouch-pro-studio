import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { getAllUsers } from '../../services/userService';
import type { UserData } from '../../types/user.types';
import { 
  Users, 
  Search, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  UserCircle, 
  Loader2,
  ExternalLink,
  Phone,
  Globe,
  Building2
} from 'lucide-react';
import toast from 'react-hot-toast';

const ManageClientsPage = () => {
  const [clients, setClients] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await getAllUsers();
      setClients(data);
    } catch (error) {
      toast.error("Failed to load clients list");
    } finally {
      setLoading(false);
    }
  };

  // Filter clients based on search term (name or email)
  const filteredClients = clients.filter(client => 
    (client.name && client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return 'N/A';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Helmet>
        <title>Manage Clients | Admin Dashboard</title>
      </Helmet>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-primary-600" />
            Client Management
          </h1>
          <p className="text-slate-500 text-sm">View and manage all registered users in your studio.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Clients</p>
            <p className="text-2xl font-black text-primary-600">{clients.length}</p>
          </div>
          <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-xl text-primary-600">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Search by client name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none shadow-sm transition-all text-slate-700 dark:text-slate-200"
        />
      </div>

      {/* Clients Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
            <p className="mt-4 text-slate-500 font-medium">Loading database...</p>
          </div>
        ) : filteredClients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Client Details</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Company & Region</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {filteredClients.map((client) => (
                  <tr key={client.uid} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary-600 font-bold overflow-hidden border border-white dark:border-slate-700">
                          {client.photoURL ? (
                            <img src={client.photoURL} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <UserCircle className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white line-clamp-1 capitalize">
                            {client.name || 'Unnamed Client'}
                          </p>
                          <div className="flex flex-col gap-0.5">
                            <span className="flex items-center gap-1 text-[11px] text-slate-500">
                              <Mail className="w-3 h-3" /> {client.email}
                            </span>
                            {client.phone && (
                              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                                <Phone className="w-3 h-3" /> {client.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                        <p className="flex items-center gap-1.5 font-medium">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {client.companyName || 'N/A'}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Globe className="w-3 h-3 text-slate-400" />
                          {client.country || 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        client.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {client.role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                        {client.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-300" />
                        {formatDate(client.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all"
                        title="View Full Profile"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No matching clients</h3>
            <p className="text-slate-500 text-sm mt-1">Try searching with a different name or email.</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          End of client list
        </p>
      </div>
    </div>
  );
};

export default ManageClientsPage;