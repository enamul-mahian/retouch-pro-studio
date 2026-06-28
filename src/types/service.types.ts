// সার্ভিসের বর্তমান অবস্থা কী হতে পারে
export type ServiceStatus = 'active' | 'draft';

// ফায়ারস্টোর ডাটাবেসে একটি সার্ভিসের যে যে তথ্য থাকবে
export interface Service {
  id?: string;                    // ফায়ারস্টোর থেকে পাওয়া ইউনিক আইডি
  title: string;                 // সার্ভিসের নাম (যেমন: Clipping Path Service)
  slug: string;                  // ইউআরএল ফ্রেন্ডলি নাম (যেমন: clipping-path-service)
  shortDescription: string;      // কার্ডে দেখানোর জন্য ছোট বর্ণনা
  fullDescription: string;       // সার্ভিস পেজে দেখানোর জন্য বিস্তারিত বর্ণনা (Rich Text)
  category: string;              // ক্যাটাগরি (যেমন: Image Editing বা Video Editing)
  startingPrice: number;         // শুরুর দাম (যেমন: 0.49)
  imageUrl: string;              // ক্লাউডিনারি থেকে আসা ইমেজের লিঙ্ক
  cloudinaryPublicId: string;    // ক্লাউডিনারি ইমেজের পাবলিক আইডি (ডিলিট করার সময় লাগবে)
  
  // এসইও (SEO) রিকোয়ারমেন্ট অনুযায়ী ফিল্ডসমূহ
  seoTitle: string;              // সার্চ ইঞ্জিনের জন্য টাইটেল
  seoDescription: string;        // সার্চ ইঞ্জিনের জন্য মেটা ডেসক্রিপশন
  seoKeywords: string;           // এসইও কীওয়ার্ডস (কমা দিয়ে আলাদা করা)
  
  status: ServiceStatus;         // সার্ভিসটি কি এখন লাইভ (active) নাকি ড্রাফট (draft)
  createdAt: any;                // তৈরির সময়
  updatedAt: any;                // সর্বশেষ আপডেটের সময়
}

// সার্ভিস ক্যাটাগরির জন্য স্ট্রাকচার
export interface ServiceCategory {
  id?: string;
  name: string;
  slug: string;
  description: string;
  status: 'active' | 'inactive';
}