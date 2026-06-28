export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  behance?: string;
  youtube?: string;
}

export interface ContactSettings {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  workingHours: string;
}

export interface SiteSettings {
  id?: string;
  // Brand Info
  siteName: string;
  siteTagline: string;
  logoUrl: string;
  faviconUrl: string;
  
  // Contact Info
  contact: ContactSettings;
  
  // Social Media Links
  socialLinks: SocialLinks;
  
  // SEO Meta Info (Global)
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  
  // Footer Content
  footerText: string;
  copyrightText: string;
  
  // Status & Updates
  updatedAt: any;
}