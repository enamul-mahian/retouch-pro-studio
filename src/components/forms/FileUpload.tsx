import React, { useState, useRef } from 'react';
import { Upload, X, FileIcon, CheckCircle, Loader2, } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadToCloudinary, type CloudinaryUploadResponse } from '../../services/cloudinaryService';

interface FileUploadProps {
  onUploadComplete: (urls: string[]) => void;
  maxFiles?: number;
  folder?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onUploadComplete, 
  maxFiles = 5,
  folder = 'quote-requests' 
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ফাইল সিলেক্ট করার হ্যান্ডেলার
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      if (files.length + selectedFiles.length > maxFiles) {
        toast.error(`আপনি সর্বোচ্চ ${maxFiles}টি ফাইল আপলোড করতে পারবেন।`);
        return;
      }
      
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  // ফাইল রিমুভ করার হ্যান্ডেলার
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // আপলোড প্রসেস শুরু করার ফাংশন
  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('দয়া করে অন্তত একটি ফাইল সিলেক্ট করুন।');
      return;
    }

    setUploading(true);
    const urls: string[] = [];

    try {
      toast.loading('ফাইল আপলোড হচ্ছে, দয়া করে অপেক্ষা করুন...', { id: 'upload-toast' });

      // প্রতিটি ফাইল লুপ করে ক্লাউডিনারিতে পাঠানো হচ্ছে
      for (const file of files) {
        const response: CloudinaryUploadResponse = await uploadToCloudinary(file, folder);
        urls.push(response.secure_url);
      }

      setUploadedUrls(urls);
      onUploadComplete(urls); // প্যারেন্ট কম্পোনেন্টকে (ফর্মকে) URL গুলো পাঠিয়ে দিচ্ছে
      toast.success('সবগুলো ফাইল সফলভাবে আপলোড হয়েছে!', { id: 'upload-toast' });
      setFiles([]); // ফাইল লিস্ট ক্লিয়ার করা
    } catch (error) {
      console.error('Upload Process Error:', error);
      toast.error('ফাইল আপলোড করতে সমস্যা হয়েছে।', { id: 'upload-toast' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* ড্রপজোন এরিয়া */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center text-center
          ${files.length > 0 ? 'border-primary-300 bg-primary-50/30' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-primary-400'}
          ${uploading ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input 
          type="file" 
          multiple 
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*,.zip,.rar,.pdf"
        />
        
        <div className="w-12 h-12 rounded-full bg-white shadow-soft flex items-center justify-center text-primary-600 mb-4">
          <Upload size={24} />
        </div>
        
        <h3 className="text-sm font-bold text-slate-800">
          Click to upload or drag and drop
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Images, Videos or Zip files (Max {maxFiles} files)
        </p>
      </div>

      {/* সিলেক্ট করা ফাইলের লিস্ট */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                  <FileIcon size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-700 truncate max-w-[150px] md:max-w-[300px]">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          ))}

          {/* আপলোড বাটন */}
          {!uploading && (
            <button
              type="button"
              onClick={handleUpload}
              className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
            >
              Start Uploading {files.length} File(s)
            </button>
          )}
        </div>
      )}

      {/* আপলোড হওয়ার পর সাকসেস মেসেজ */}
      {uploading && (
        <div className="flex items-center justify-center gap-3 p-4 bg-primary-50 rounded-xl text-primary-700">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm font-semibold">Uploading to Secure Cloud...</span>
        </div>
      )}

      {uploadedUrls.length > 0 && !uploading && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl text-emerald-700 border border-emerald-100 animate-fade-in">
          <CheckCircle size={20} />
          <span className="text-sm font-semibold">{uploadedUrls.length} File(s) ready to submit!</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;