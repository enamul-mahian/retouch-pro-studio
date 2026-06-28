export type OrderStatus = 'in-progress' | 'review' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid';

export interface Order {
  id?: string;
  clientId: string;
  quoteId: string;
  serviceType: string;
  title: string;
  description: string;
  inputFiles: string[];  // ক্লায়েন্টের পাঠানো ফাইল
  outputFiles: string[]; // আপনার ডেলিভারি দেওয়া ফাইল
  amount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  deadline: string;
  revisionCount: number;
  createdAt: any;
  updatedAt: any;
}