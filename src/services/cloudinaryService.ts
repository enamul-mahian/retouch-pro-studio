import axios from 'axios';

/**
 * ক্লাউডিনারি আপলোড রেসপন্স ইন্টারফেস
 */
export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  resource_type: string;
  format: string;
  bytes: number;
  original_filename: string;
}

// আপনার ক্লাউডিনারি ক্রিডেনশিয়াল (Directly added to ensure it works)
const CLOUD_NAME = "dcedfbulg";
const UPLOAD_PRESET = "retouch_preset";

/**
 * ক্লাউডিনারিতে ফাইল আপলোড করার মেইন ফাংশন
 * @param file - আপলোড করার ফাইল (Image/Video/Zip)
 * @param folder - ক্লাউডিনারির ফোল্ডার নাম
 */
export const uploadToCloudinary = async (
  file: File,
  folder: string = 'retouch-pro-studio'
): Promise<CloudinaryUploadResponse> => {
  
  // ক্লাউডিনারি এপিআই এন্ডপয়েন্ট
  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  try {
    const response = await axios.post<CloudinaryUploadResponse>(uploadUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Cloudinary Upload Error Details:', error.response?.data || error.message);
    throw new Error('ফাইল আপলোড করতে সমস্যা হয়েছে। দয়া করে আপনার ক্লাউডিনারি প্রেসেট চেক করুন।');
  }
};