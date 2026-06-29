export type QuoteStatus = 'pending' | 'reviewed' | 'approved' | 'completed' | 'rejected';

export interface QuoteRequest {
  id?: string;
  userId: string;
  name: string;
  email: string;
  country?: string;
  serviceType: string;
  quantity?: string;
  deadline?: string;
  description: string;
  fileUrls?: string[];
  status: QuoteStatus;
  adminNote?: string;
  createdAt: any;
  updatedAt?: any;
}