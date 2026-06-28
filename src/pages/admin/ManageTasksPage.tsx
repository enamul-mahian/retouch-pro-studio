import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { collection, getDocs, addDoc, updateDoc, doc, serverTimestamp, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { getAllTeammates } from '../../services/teammateService';
import type { Teammate, AssignedTask } from '../../types/teammate.types';
import { 
  Briefcase, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ArrowRight,
  MessageSquare,
  Link as LinkIcon,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  packageName: string;
  userEmail: string;
  status: string;
  createdAt: any;
}

const ManageTasksPage = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'unassigned' | 'active' | 'review'>('unassigned');
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [tasks, setTasks] = useState<AssignedTask[]>([]);
  
  // Assignment State
  const [selectedTeammate, setSelectedTeammate] = useState<Record<string, string>>({});
  const [isAssigning, setIsAssigning] = useState<string | null>(null);

  useEffect(() => {
    fetchBoardData();
  }, []);

  const fetchBoardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Teammates
      const fetchedTeammates = await getAllTeammates();
      setTeammates(fetchedTeammates.filter(t => t.status === 'active'));

      // 2. Fetch Active Orders
      const ordersSnap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
      const fetchedOrders: Order[] = [];
      ordersSnap.forEach(doc => {
        const data = doc.data();
        if (data.status !== 'completed' && data.status !== 'cancelled') {
          fetchedOrders.push({ id: doc.id, ...data } as Order);
        }
      });
      setOrders(fetchedOrders);

      // 3. Fetch Assigned Tasks
      const tasksSnap = await getDocs(collection(db, 'assignedTasks'));
      const fetchedTasks: AssignedTask[] = [];
      tasksSnap.forEach(doc => {
        fetchedTasks.push({ id: doc.id, ...doc.data() } as AssignedTask);
      });
      setTasks(fetchedTasks);

    } catch (error) {
      console.error("Error fetching board data:", error);
      toast.error("Failed to load task board.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Assigning Task
  const handleAssignTask = async (orderId: string) => {
    const teammateId = selectedTeammate[orderId];
    if (!teammateId) {
      toast.error("Please select a teammate first.");
      return;
    }

    setIsAssigning(orderId);
    try {
      const newTask = {
        orderId,
        teammateId,
        status: 'pending',
        assignedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'assignedTasks'), newTask);
      
      toast.success("Task assigned successfully!");
      
      // Update local state
      setTasks([...tasks, { id: docRef.id, ...newTask, assignedAt: new Date().toISOString() } as AssignedTask]);
      
    } catch (error) {
      console.error("Error assigning task:", error);
      toast.error("Failed to assign task.");
    } finally {
      setIsAssigning(null);
    }
  };

  // Data Segregation
  const assignedOrderIds = tasks.map(t => t.orderId);
  const unassignedOrders = orders.filter(o => !assignedOrderIds.includes(o.id));
  
  const activeTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress');
  const reviewTasks = tasks.filter(t => t.status === 'submitted' || t.status === 'completed');

  const getTeammateName = (id: string) => teammates.find(t => t.id === id)?.name || 'Unknown User';
  const getOrderDetails = (id: string) => orders.find(o => o.id === id);

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <Helmet>
        <title>Task Board | Production Management</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary-600" />
            Production Task Board
          </h1>
          <p className="text-slate-500 text-sm mt-1">Assign orders to teammates and track progress.</p>
        </div>
      </div>

      {/* Custom Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
        <button
          onClick={() => setActiveTab('unassigned')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'unassigned' ? 'bg-primary-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <AlertCircle className="w-4 h-4" /> Unassigned
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'unassigned' ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
            {unassignedOrders.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'active' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" /> In Progress
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'active' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
            {activeTasks.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('review')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'review' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" /> Review & Feedback
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'review' ? 'bg-purple-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
            {reviewTasks.length}
          </span>
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
          <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Syncing production data...</p>
        </div>
      ) : (
        <div className="animate-in fade-in duration-300">
          
          {/* TAB 1: UNASSIGNED ORDERS */}
          {activeTab === 'unassigned' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unassignedOrders.length > 0 ? unassignedOrders.map(order => (
                <div key={order.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
                  <div className="mb-6">
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        Needs Assignee
                      </span>
                      <span className="text-xs text-slate-400 font-medium">#{order.id.slice(-6).toUpperCase()}</span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white mt-3">{order.packageName || 'Custom Order'}</h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-1">{order.userEmail}</p>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Select Teammate</label>
                    <select 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium outline-none focus:ring-2 focus:ring-primary-500"
                      value={selectedTeammate[order.id] || ''}
                      onChange={(e) => setSelectedTeammate({...selectedTeammate, [order.id]: e.target.value})}
                    >
                      <option value="">-- Choose Editor/Designer --</option>
                      {teammates.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({t.role})</option>
                      ))}
                    </select>
                    <button 
                      onClick={() => handleAssignTask(order.id)}
                      disabled={isAssigning === order.id}
                      className="w-full py-2.5 bg-slate-900 dark:bg-primary-600 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all flex justify-center gap-2 disabled:opacity-50"
                    >
                      {isAssigning === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Assign Task'}
                    </button>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">All caught up!</h3>
                  <p className="text-slate-500 text-sm mt-1">There are no unassigned active orders.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ACTIVE TASKS */}
          {activeTab === 'active' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeTasks.length > 0 ? activeTasks.map(task => {
                const order = getOrderDetails(task.orderId);
                return (
                  <div key={task.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-l-4 border-blue-500 shadow-sm flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                          {task.status.replace('-', ' ')}
                        </span>
                        <span className="text-xs text-slate-400 font-bold">Order #{task.orderId.slice(-6).toUpperCase()}</span>
                      </div>
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white">{order?.packageName || 'Unknown Order'}</h3>
                      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 w-fit px-3 py-1.5 rounded-lg">
                        <Users className="w-4 h-4 text-primary-500" />
                        Assigned to: <span className="text-primary-600 dark:text-primary-400">{getTeammateName(task.teammateId)}</span>
                      </div>
                    </div>
                    <div className="flex items-center md:items-end justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800">
                      <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                );
              }) : (
                <div className="col-span-full py-16 text-center">
                  <p className="text-slate-500 font-medium">No tasks are currently in progress.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REVIEW & FEEDBACK */}
          {activeTab === 'review' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviewTasks.length > 0 ? reviewTasks.map(task => {
                const order = getOrderDetails(task.orderId);
                return (
                  <div key={task.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-l-4 border-purple-500 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 inline-block">
                          {task.status === 'submitted' ? 'Ready for Review' : 'Completed'}
                        </span>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white">{order?.packageName || 'Order'}</h3>
                        <p className="text-xs text-slate-500 mt-1">Editor: {getTeammateName(task.teammateId)}</p>
                      </div>
                    </div>

                    <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      {task.workFileUrl ? (
                        <a href={task.workFileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-primary-600 hover:underline">
                          <LinkIcon className="w-4 h-4" /> View Submitted Files
                        </a>
                      ) : (
                        <p className="text-sm text-slate-500 italic">No files submitted yet.</p>
                      )}
                      
                      {task.clientFeedback && (
                        <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                          <p className="flex items-center gap-1.5 text-xs font-bold text-amber-600 mb-1">
                            <MessageSquare className="w-3 h-3" /> Client Feedback
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{task.clientFeedback}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }) : (
                <div className="col-span-full py-16 text-center">
                  <p className="text-slate-500 font-medium">No tasks are waiting for review right now.</p>
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default ManageTasksPage;