export type PaymentMethod = 'stripe' | 'paypal' | 'wise' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface PaymentRecord {
  id?: string;
  clientId: string;
  orderId: string; // যে অর্ডারের বিপরীতে পেমেন্ট
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string; // পেমেন্ট গেটওয়ে থেকে পাওয়া ট্রানজ্যাকশন আইডি
  paymentNote?: string;
  createdAt: any;
  updatedAt: any;
}