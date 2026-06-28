export interface PortfolioItem {
  id?: string;
  title: string;
  category: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  cloudinaryPublicIds: string[];
  description: string;
  status: 'active' | 'draft';
  createdAt: any;
}