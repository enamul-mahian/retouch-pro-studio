import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../hooks/useAuth';
import { collection, getDocs, query, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import FileUpload from '../../components/shared/FileUpload';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  UploadCloud, 
  Loader2,
  MessageSquare,
  AlertCircle,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

// ইন্টারফেস ডিফাইন করা হলো
interface TeammateTask {
  id: string;
  orderId: string;
  status: string;
  workFileUrl?: string;
  clientFeedback?: string;
  assignedAt: any;
  orderInfo?: any; // অর্ডার সম্পর্কিত এক্সট্রা ডাটা
}

const TeammateDashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [teammateProfile, setTeammateProfile] = useState<any>(null);
  const [tasks, setTasks] = useState<TeammateTask[]>([]);
  
  // Submit Work Modal State
  const [submitTaskId, setSubmitTaskId] = useState<string | null>(null);
  const [workFileUrl, setWorkFileUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.email) {
      fetchTeammateData();
    }
  }, [user?.email]);

  const fetchTeammateData = async () => {
    setLoading(true);
    try {
      // ১. ইউজারের ইমেইল দিয়ে চেক করা হচ্ছে সে টিম মেম্বার কি না
      const teammateQuery = query(collection(db, 'teammates'), where('email', '==', user?.email));
      const teammateSnap = await getDocs(teammateQuery);
      
      if (teammateSnap.empty) {
        setLoading(false);
        return; // যদি টিম মেম্বার না হয় তবে রিটার্ন করবে
      }

      const teammateData = { id: teammateSnap.docs[0].id, ...teammateSnap.docs[0].data() };
      setTeammateProfile(teammateData);

      // ২. এই মেম্বারের নামে অ্যাসাইন করা টাস্কগুলো আনা হচ্ছে
      const tasksQuery = query(collection(db, 'assignedTasks'), where('teammateId', '==', teammateData.id));
      const tasksSnap = await getDocs(tasksQuery);
      
      const fetchedTasks: TeammateTask[] = [];
      
      // ৩. প্রতিটি টাস্কের অর্ডারের ইনফরমেশন (যেমন প্যাকেজ নাম) আনা হচ্ছে
      for (const taskDoc of tasksSnap.docs) {
        const taskData = taskDoc.data();
        
        // Order Info Fetch
        const orderQuery = query(collection(db, 'orders'), where('__name__', '==', taskData.orderId));
        const orderSnap = await getDocs(orderQuery);
        let orderInfo = null;
        
        if (!orderSnap.empty) {
          orderInfo = orderSnap.docs[0].data();
        }

        fetchedTasks.push({
          id: taskDoc.id,
          orderId: taskData.orderId,
          status: taskData.status,
          workFileUrl: taskData.workFileUrl,
          clientFeedback: taskData.clientFeedback,
          assignedAt: taskData.assignedAt,
          orderInfo
        });
      }

      // সর্টিং (নতুন কাজগুলো আগে দেখাবে)
      fetchedTasks.sort((a, b) => {
        const dateA = a.assignedAt?.seconds || 0;
        const dateB = b.assignedAt?.seconds || 0;
        return dateB - dateA;
      });

      setTasks(fetchedTasks);

    } catch (error) {
      console.error("Error fetching teammate tasks:", error);
      toast.error("Failed to load your tasks.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitTaskId || !workFileUrl) {
      toast.error("Please upload the work file first.");
      return;
    }

    setIsSubmitting(true);
    try {
      const taskRef = doc(db, 'assignedTasks', submitTaskId);
      await updateDoc(taskRef, {
        workFileUrl,
        status: 'submitted', // স্ট্যাটাস পরিবর্তন করে submitted করা হলো
        updatedAt: serverTimestamp()
      });

      toast.success("Work submitted successfully!");
      
      // লোকাল স্টেট আপডেট
      setTasks(tasks.map(t => 
        t.id === submitTaskId 
          ? { ...t, status: 'submitted', workFileUrl } 
          : t
      ));
      
      // মডাল ক্লোজ করা
      setSubmitTaskId(null);
      setWorkFileUrl('');
    } catch (error) {
      console.error("Error submitting work:", error);
      toast.error("Failed to submit work.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress' || t.status === 'revision');
  const completedTasks = tasks.filter(t => t.status === 'submitted' || t.status === 'completed');

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!teammateProfile) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-16 h-16 text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Not Authorized</h2>
        <p className="text-slate-500 mt-2 max-w-md">
          Your account is not registered as a production team member. Please contact the admin.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <Helmet>
        <title>Teammate Dashboard | Retouch Pro Studio</title>
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-primary-500/20 text-primary-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            {teammateProfile.role.replace('-', ' ')}
          </span>
          <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
            Active
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
          Hello, {teammateProfile.name}! 👋
        </h1>
        <p className="text-slate-300">
          You have <strong className="text-white">{activeTasks.length}</strong> active tasks waiting for your magic.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Active Tasks Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-500" /> Active Tasks
          </h2>
          
          <div className="space-y-4">
            {activeTasks.length > 0 ? activeTasks.map(task => (
              <div key={task.id} className="p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-primary-300 transition-all bg-slate-50 dark:bg-slate-800/50">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order #{task.orderId.slice(-6).toUpperCase()}</span>
                  <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-1 rounded text-[10px] font-bold uppercase">
                    {task.status}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">
                  {task.orderInfo?.packageName || 'Custom Editing Task'}
                </h3>
                
                {task.clientFeedback && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/50">
                    <p className="text-xs font-bold text-red-600 mb-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Revision Note:</p>
                    <p className="text-sm text-red-700 dark:text-red-300">{task.clientFeedback}</p>
                  </div>
                )}

                <button 
                  onClick={() => setSubmitTaskId(task.id)}
                  className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" /> Submit Work
                </button>
              </div>
            )) : (
              <div className="text-center py-10">
                <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No active tasks assigned to you.</p>
              </div>
            )}
          </div>
        </div>

        {/* Submitted / Completed Tasks */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" /> Submitted Work
          </h2>
          
          <div className="space-y-4">
            {completedTasks.length > 0 ? completedTasks.map(task => (
              <div key={task.id} className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800 dark:text-white">
                    {task.orderInfo?.packageName || 'Task'}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 uppercase">
                    {task.status}
                  </span>
                </div>
                <a href={task.workFileUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary-600 hover:underline flex items-center gap-1 mt-2">
                  <FileText className="w-4 h-4" /> View Submitted File
                </a>
              </div>
            )) : (
              <div className="text-center py-10">
                <CheckCircle2 className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">You haven't submitted any work yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Submit Work Modal */}
      {submitTaskId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl relative">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Submit Your Work</h2>
            <p className="text-slate-500 text-sm mb-6">Upload the completed file to send it to the production manager.</p>
            
            <form onSubmit={handleSubmitWork}>
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Work File (ZIP or Image)</label>
                {workFileUrl ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium flex items-center justify-between">
                    <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> File Uploaded</span>
                    <button type="button" onClick={() => setWorkFileUrl('')} className="text-red-500 text-sm hover:underline">Remove</button>
                  </div>
                ) : (
                  <FileUpload onUploadSuccess={(url) => setWorkFileUrl(url)} folder="completed_works" label="Upload Final File" />
                )}
              </div>
              
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => { setSubmitTaskId(null); setWorkFileUrl(''); }}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || !workFileUrl}
                  className="flex-1 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeammateDashboardPage;