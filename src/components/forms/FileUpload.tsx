import React, { useState, useRef, useCallback } from 'react';
import { Upload, Loader2, FileCheck, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onUploadComplete: (urls: string[]) => void;
  maxFiles: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete, maxFiles }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (files: FileList) => {
    if (files.length + uploadedFiles.length > maxFiles) {
      toast.error(`You can only upload a maximum of ${maxFiles} files.`);
      return;
    }

    setIsUploading(true);
    const uploadPromises = Array.from(files).map(file => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET!);
      formData.append('folder', `quotes`);

      return fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      }).then(res => res.json());
    });

    try {
      const results = await Promise.all(uploadPromises);
      const urls = results.map(res => res.secure_url);
      const newUrls = [...uploadedFiles, ...urls];
      setUploadedFiles(newUrls);
      onUploadComplete(newUrls);
    } catch (error) {
      toast.error('File upload failed.');
    } finally {
      setIsUploading(false);
    }
  }, [uploadedFiles, maxFiles, onUploadComplete]);

  return (
    <div>
      <div 
        onDrop={(e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files); }}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer"
      >
        <input 
          type="file" 
          multiple 
          ref={fileInputRef} 
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="hidden" 
        />
        {isUploading ? <Loader2 className="animate-spin mx-auto"/> : <Upload className="mx-auto"/>}
        <p>Click to upload or drag and drop</p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-4 p-2 bg-green-100 rounded-lg text-green-700 flex items-center gap-2">
          <FileCheck/> {uploadedFiles.length} File(s) ready to submit!
        </div>
      )}
    </div>
  );
};

export default FileUpload;