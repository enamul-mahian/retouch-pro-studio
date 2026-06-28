// টিম মেম্বারদের রোল
export type TeamRole = 'designer' | 'editor' | 'production-manager';

// টিম মেম্বারের তথ্য
export interface Teammate {
  id?: string;
  name: string;
  email: string;
  role: TeamRole;
  avatarUrl?: string;
  status: 'active' | 'inactive';
  createdAt?: any;
}

// টাস্ক বা প্রজেক্ট অ্যাসাইনমেন্টের ডাটা স্ট্রাকচার
export interface AssignedTask {
  id?: string;
  orderId: string; // যে অর্ডারের জন্য টাস্ক
  teammateId: string; // কাকে অ্যাসাইন করা হয়েছে
  status: 'pending' | 'in-progress' | 'submitted' | 'completed';
  workFileUrl?: string; // টিম মেম্বার যে ফাইল সাবমিট করবে
  clientFeedback?: string; // ক্লায়েন্টের ফিডব্যাক
  productionNotes?: string; // প্রোডাকশন ম্যানেজারের নোট
  assignedAt: any;
  updatedAt: any;
}