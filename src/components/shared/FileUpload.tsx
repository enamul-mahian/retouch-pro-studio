import React, { useState, useRef } from 'react';
import { Upload, Loader2, Image as ImageIcon, X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onUploadSuccess: (url: string) => void;
  folder?: string;
  label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onUploadSuccess, 
  folder = 'general',
  label = "Upload Image"
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size too large. Maximum 5MB allowed.");
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', `retouch_pro/${folder}`);

    try {
      setUploadProgress(30);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      setUploadProgress(70);
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setUploadProgress(100);
      
      toast.success("Image uploaded successfully!");
      onUploadSuccess(data.secure_url);
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      toast.error("Failed to upload image. Check your connection.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*"
        className="hidden"
      />
      
      <div 
        onClick={!isUploading ? triggerFileInput : undefined}
        className={`
          relative group cursor-pointer border-2 border-dashed rounded-xl p-6 transition-all duration-200
          ${isUploading 
            ? 'bg-slate-50 border-primary-300' 
            : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-primary-400 hover:bg-primary-50/30'
          }
        `}
      >
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          {isUploading ? (
            <>
              <div className="relative">
                <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-primary-700">
                  {uploadProgress}%
                </span>
              </div>
              <p className="text-sm font-medium text-slate-600">Uploading to Cloudinary...</p>
            </>
          ) : (
            <>
              <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-full text-primary-600 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{label}</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG or WEBP (Max 5MB)</p>
              </div>
            </>
          )}
        </div>

        {/* Progress Bar Background */}
        {isUploading && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100 rounded-b-xl overflow-hidden">
            <div 
              className="h-full bg-primary-600 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;