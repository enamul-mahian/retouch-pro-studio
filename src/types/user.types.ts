// ইউজারের রোল (Role) ডিফাইন করা হলো। আমাদের সিস্টেমে দুই ধরনের ইউজার থাকবে।
export type UserRole = 'client' | 'admin';

// ফায়ারস্টোর ডাটাবেসে ইউজারদের যে ডাটাগুলো সেভ হবে, তার স্ট্রাকচার
export interface UserData {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  country: string;
  companyName: string;
  photoURL: string;
  createdAt: string; 
  updatedAt: string;
}

// লগিন বা রেজিস্ট্রেশনের সময় আমরা ইউজারের কাছ থেকে যে ডাটাগুলো নিব
export interface AuthResponse {
  user: UserData | null;
  error: string | null;
  isLoading: boolean;
}