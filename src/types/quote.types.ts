// কোটেশনের বর্তমান অবস্থা বা স্ট্যাটাস কী হতে পারে তা এখানে ডিফাইন করা হলো
export type QuoteStatus = 'pending' | 'reviewed' | 'approved' | 'rejected' | 'completed';

// ফায়ারস্টোর ডাটাবেসে একটি কোটেশন রিকোয়েস্টের যে যে তথ্য থাকবে
export interface QuoteRequest {
  id?: string;               // ফায়ারস্টোর থেকে পাওয়া ইউনিক আইডি
  clientId: string;          // যে ইউজার রিকোয়েস্ট পাঠিয়েছে তার UID (লগিন না থাকলে 'guest')
  name: string;              // ইউজারের নাম
  email: string;             // ইউজারের ইমেইল
  serviceType: string;       // সার্ভিসের ধরন (যেমন: Clipping Path)
  quantity?: string;         // কতগুলো ইমেজ বা ভিডিও
  deadline?: string;         // কত সময়ের মধ্যে ডেলিভারি লাগবে
  description: string;       // প্রজেক্টের বিস্তারিত বর্ণনা
  fileUrls: string[];        // ক্লাউডিনারি থেকে আসা ফাইলের লিঙ্কগুলোর লিস্ট (Array)
  status: QuoteStatus;       // বর্তমান স্ট্যাটাস
  adminNote?: string;        // অ্যাডমিন যদি কোনো নোট লেখে (যেমন: দাম বা অফার)
  createdAt: any;            // রিকোয়েস্ট পাঠানোর সময়
  updatedAt: any;            // সর্বশেষ আপডেটের সময়
}

// ড্যাশবোর্ডে স্ট্যাটিক ডাটা দেখানোর পরিবর্তে এই ইন্টারফেসটি ব্যবহার হবে
export interface QuoteStats {
  total: number;
  pending: number;
  reviewed: number;
  approved: number;
  rejected: number;
}