export interface PricingPackage {
  id?: string;
  name: string;
  description: string;
  price: number;
  unit: string; // e.g., "per image" or "per minute"
  features: string[]; // Array of strings for checkmark list
  isPopular: boolean; // To show the "Most Popular" badge
  category: 'image-editing' | 'video-editing'; // To match your UI toggle
  status: 'active' | 'draft';
  displayOrder: number; // To control which package shows first
  createdAt?: any;
  updatedAt?: any;
}