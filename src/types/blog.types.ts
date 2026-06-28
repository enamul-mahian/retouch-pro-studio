export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Rich Text
  coverImageUrl: string;
  authorId: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  status: 'published' | 'draft';
  createdAt: any;
  updatedAt: any;
}