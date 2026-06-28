import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../hooks/useAuth';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { 
  Folder, 
  FileImage, 
  FileVideo, 
  Download, 
  Loader2, 
  CloudRain, 
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

// ফাইলের টাইপ ডিফাইন করা হলো
interface FileItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'other';
  date: string;
  source: 'quote' | 'order';
  projectName: string;
}

const MyFilesPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'delivered' | 'source'>('delivered');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserFiles();
    }
  }, [user]);

  const fetchUserFiles = async () => {
    setLoading(true);
    try {
      const fetchedFiles: FileItem[] = [];

      // 1. Fetch Source Files from Quotes
      const quotesRef = collection(db, 'quoteRequests');
      const qQuotes = query(quotesRef, where('userId', '==', user?.uid));
      const quoteSnap = await getDocs(qQuotes);
      
      quoteSnap.forEach((doc) => {
        const data = doc.data();
        if (data.fileUrl) {
          fetchedFiles.push({
            id: `quote-${doc.id}`,
            name: `Source_${doc.id.slice(-6)}.jpg`, // Demo name if original isn't saved
            url: data.fileUrl,
            type: data.fileUrl.includes('video') ? 'video' : 'image',
            date: data.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000).toISOString() : new Date().toISOString(),
            source: 'quote',
            projectName: data.serviceName || 'Custom Quote Request'
          });
        }
      });

      // 2. Fetch Delivered Files from Orders
      const ordersRef = collection(db, 'orders');
      const qOrders = query(ordersRef, where('userId', '==', user?.uid));
      const orderSnap = await getDocs(qOrders);

      orderSnap.forEach((doc) => {
        const data = doc.data();
        // Assuming orders have a 'deliveredFileUrl' or similar field when completed
        if (data.deliveredFileUrl) {
          fetchedFiles.push({
            id: `order-${doc.id}`,
            name: `Delivery_${doc.id.slice(-6)}.zip`,
            url: data.deliveredFileUrl,
            type: 'other',
            date: data.updatedAt?.seconds ? new Date(data.updatedAt.seconds * 1000).toISOString() : new Date().toISOString(),
            source: 'order',
            projectName: data.packageName || 'Order Delivery'
          });
        }
      });

      // Sort by date (newest first)
      fetchedFiles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setFiles(fetchedFiles);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Failed to load files.");
    } finally {
      setLoading(false);
    }
  };

  const deliveredFiles = files.filter(f => f.source === 'order');
  const sourceFiles = files.filter(f => f.source === 'quote');
  
  const currentFiles = activeTab === 'delivered' ? deliveredFiles : sourceFiles;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <Helmet>
        <title>My Files | Client Dashboard</title>
      </Helmet>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Folder className="w-6 h-6 text-primary-600" />
            File Manager
          </h1>
          <p className="text-slate-500 text-sm mt-1">Access all your uploaded sources and delivered files.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-8 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-fit">
        <button
          onClick={() => setActiveTab('delivered')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'delivered' 
            ? 'bg-primary-600 text-white shadow-md' 
            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Delivered Files
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === 'delivered' ? 'bg-primary-500 text-white' : 'bg-slate-100'}`}>
            {deliveredFiles.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('source')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'source' 
            ? 'bg-primary-600 text-white shadow-md' 
            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <CloudRain className="w-4 h-4" />
          Source Files
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === 'source' ? 'bg-primary-500 text-white' : 'bg-slate-100'}`}>
            {sourceFiles.length}
          </span>
        </button>
      </div>

      {/* Files Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-100">
          <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
          <p className="mt-4 text-slate-500 font-medium">Scanning your files...</p>
        </div>
      ) : currentFiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentFiles.map((file) => (
            <div key={file.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden">
              {/* File Preview Area */}
              <div className="aspect-video bg-slate-50 border-b border-slate-100 relative flex items-center justify-center overflow-hidden">
                {file.type === 'image' ? (
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : file.type === 'video' ? (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white group-hover:scale-105 transition-transform duration-500">
                    <FileVideo className="w-12 h-12 opacity-50" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary-600 group-hover:scale-105 transition-transform duration-500">
                    <Folder className="w-12 h-12 opacity-50" />
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white text-slate-800 rounded-full hover:bg-primary-50 hover:text-primary-600 transition-colors tooltip" title="Open Link">
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <a href={file.url} download className="p-2.5 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-lg" title="Download">
                    <Download className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* File Details */}
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {file.type === 'image' ? <FileImage className="w-5 h-5 text-blue-500" /> : <Folder className="w-5 h-5 text-amber-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-sm truncate" title={file.projectName}>
                      {file.projectName}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(file.date)}</span>
                      <span className="uppercase text-[10px] tracking-wider px-2 py-0.5 bg-slate-100 rounded-md">
                        {file.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center px-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Folder className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">No files found</h3>
          <p className="text-slate-500 max-w-sm">
            {activeTab === 'delivered' 
              ? "You don't have any delivered files yet. Completed orders will appear here." 
              : "You haven't uploaded any source files for quotes or orders yet."}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyFilesPage;