export interface Article {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  imageCaption: string;
  category: string;
  categoryName: string;
  tags: string[];
  authorName: string;
  status: 'published' | 'draft' | 'scheduled';
  featured: boolean;
  breaking: boolean;
  trending: boolean;
  publishedAt: string;
  scheduledFor?: string;
  views: number;
  likes: number;
  seoTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
}

export interface PopUpSettings {
  enabled: boolean;
  smartLinkUrl: string;
  title: string;
  description: string;
  buttonLabel: string;
  triggerTiming: 'immediate' | 'delay_3s' | 'delay_5s' | 'delay_10s';
  frequency: 'once_per_session' | 'every_24h' | 'every_page';
  scope: 'homepage_only' | 'all_pages';
  dismissible: boolean;
}

export interface AdPlacement {
  enabled: boolean;
  code: string;
  label: string;
}

export interface MonetagSettings {
  verificationMethod: 'none' | 'meta_tag' | 'html_file';
  verificationMetaTag: string;
  verificationFileName: string;
  verificationFileContent: string;
  ads: {
    header: AdPlacement;
    homepage: AdPlacement;
    sidebar: AdPlacement;
    insideArticle: AdPlacement;
    afterArticle: AdPlacement;
    footer: AdPlacement;
  };
}

export interface GoogleVerificationSettings {
  verificationMethod: 'none' | 'meta_tag' | 'html_file';
  verificationMetaTag: string;
  verificationFileName: string;
  verificationFileContent: string;
}

export interface SEOSettings {
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  keywords: string;
  siteName: string;
  canonicalDomain: string;
  twitterHandle: string;
  enableSitemap: boolean;
  enableRobotsTxt: boolean;
}

export interface WebsiteSettings {
  siteName: string;
  tagline: string;
  contactEmail: string;
  adminEmail: string;
  allowVisitorRegistration: boolean;
  footerAbout: string;
  socialLinks: {
    twitter: string;
    instagram: string;
    facebook: string;
    youtube: string;
    tiktok: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'visitor';
  createdAt: string;
  isInitialSetupCompleted?: boolean;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  ip?: string;
}

export interface PublicSettingsPayload {
  website: WebsiteSettings;
  popUp: PopUpSettings;
  monetag: {
    verificationMethod: 'none' | 'meta_tag' | 'html_file';
    verificationMetaTag: string;
    ads: MonetagSettings['ads'];
  };
  google: {
    verificationMethod: 'none' | 'meta_tag' | 'html_file';
    verificationMetaTag: string;
  };
  seo: SEOSettings;
  visitorRegistrationEnabled: boolean;
}
