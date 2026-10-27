import {
  Article,
  Category,
  PublicSettingsPayload,
  PopUpSettings,
  MonetagSettings,
  GoogleVerificationSettings,
  SEOSettings,
  WebsiteSettings,
  MediaItem,
  User,
  ActivityLog,
} from '../types';
import { clientDb } from './storage';
import { supabase, isSupabaseConfigured } from '../supabase';

const ADMIN_TOKEN_KEY = 'allvibez11_admin_token';
const VISITOR_TOKEN_KEY = 'allvibez11_visitor_token';

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function removeAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function getVisitorToken(): string | null {
  return localStorage.getItem(VISITOR_TOKEN_KEY);
}

export function setVisitorToken(token: string) {
  localStorage.setItem(VISITOR_TOKEN_KEY, token);
}

export function removeVisitorToken() {
  localStorage.removeItem(VISITOR_TOKEN_KEY);
}

// Check if we are running in an environment with a live Express backend
async function checkBackendAvailability(): Promise<boolean> {
  try {
    const res = await fetch('/api/public-settings', { method: 'GET', headers: { Accept: 'application/json' } });
    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      return contentType.includes('application/json');
    }
  } catch {}
  return false;
}

let isBackendLive: boolean | null = null;

async function tryServerRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  if (isBackendLive === false) return null;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const adminToken = getAdminToken();
    if (adminToken && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${adminToken}`;
    }

    const res = await fetch(endpoint, { ...options, headers });
    const contentType = res.headers.get('content-type') || '';

    // If server returned HTML (e.g. 404 from GitHub Pages), it's static hosting
    if (!contentType.includes('application/json')) {
      isBackendLive = false;
      return null;
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Request failed with status ${res.status}`);
    }

    isBackendLive = true;
    return (await res.json()) as T;
  } catch (err: any) {
    if (err.message && !err.message.includes('status')) {
      isBackendLive = false;
    }
    return null;
  }
}

// Simple browser-safe string hash for client-side password verification
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(36) + '_' + str.length;
}

export const api = {
  // 1. Public Settings
  getPublicSettings: async (): Promise<PublicSettingsPayload> => {
    const serverResult = await tryServerRequest<PublicSettingsPayload>('/api/public-settings');
    if (serverResult) return serverResult;

    const data = clientDb.get();
    return {
      website: data.websiteSettings,
      popUp: data.popUpSettings,
      monetag: {
        verificationMethod: data.monetagSettings.verificationMethod,
        verificationMetaTag: data.monetagSettings.verificationMetaTag,
        ads: data.monetagSettings.ads,
      },
      google: {
        verificationMethod: data.googleSettings.verificationMethod,
        verificationMetaTag: data.googleSettings.verificationMetaTag,
      },
      seo: data.seoSettings,
      visitorRegistrationEnabled: data.websiteSettings.allowVisitorRegistration,
    };
  },

  // 2. Categories
  getCategories: async (): Promise<Category[]> => {
    const serverResult = await tryServerRequest<Category[]>('/api/categories');
    if (serverResult) return serverResult;
    return clientDb.get().categories;
  },

  // 3. Articles (Public Feed)
  getArticles: async (params: {
    category?: string;
    search?: string;
    tag?: string;
    featured?: boolean;
    breaking?: boolean;
    trending?: boolean;
    limit?: number;
    page?: number;
  } = {}) => {
    const q = new URLSearchParams();
    if (params.category) q.set('category', params.category);
    if (params.search) q.set('search', params.search);
    if (params.tag) q.set('tag', params.tag);
    if (params.featured) q.set('featured', 'true');
    if (params.breaking) q.set('breaking', 'true');
    if (params.trending) q.set('trending', 'true');
    if (params.limit) q.set('limit', params.limit.toString());
    if (params.page) q.set('page', params.page.toString());

    const serverResult = await tryServerRequest<{
      articles: Article[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`/api/articles?${q.toString()}`);
    if (serverResult) return serverResult;

    const data = clientDb.get();
    let list = data.articles.filter((a) => a.status === 'published');

    if (params.category && params.category !== 'all') {
      list = list.filter((a) => a.category.toLowerCase() === params.category!.toLowerCase());
    }
    if (params.tag) {
      list = list.filter((a) => a.tags.some((t) => t.toLowerCase() === params.tag!.toLowerCase()));
    }
    if (params.search) {
      const query = params.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.excerpt.toLowerCase().includes(query) ||
          a.tags.some((t) => t.toLowerCase().includes(query)) ||
          a.authorName.toLowerCase().includes(query) ||
          a.categoryName.toLowerCase().includes(query)
      );
    }
    if (params.featured) list = list.filter((a) => a.featured);
    if (params.breaking) list = list.filter((a) => a.breaking);
    if (params.trending) list = list.filter((a) => a.trending || a.views > 2000);

    list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const page = params.page || 1;
    const limit = params.limit || 20;
    const total = list.length;
    const paginated = list.slice((page - 1) * limit, page * limit);

    return {
      articles: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  // 4. Single Article
  getArticle: async (slugOrId: string) => {
    const serverResult = await tryServerRequest<{ article: Article; related: Article[] }>(
      `/api/articles/${slugOrId}`
    );
    if (serverResult) return serverResult;

    const data = clientDb.get();
    const article = data.articles.find((a) => a.slug === slugOrId || a.id === slugOrId);
    if (!article) {
      throw new Error('Article not found');
    }

    // Increment view count locally
    clientDb.update((d) => {
      const target = d.articles.find((a) => a.id === article.id);
      if (target) target.views += 1;
      d.visitorCount += 1;
    });

    const related = data.articles
      .filter((a) => a.id !== article.id && a.category === article.category && a.status === 'published')
      .slice(0, 4);

    return { article: { ...article, views: article.views + 1 }, related };
  },

  // 5. Like Article
  likeArticle: async (id: string) => {
    const serverResult = await tryServerRequest<{ success: boolean; likes: number }>(
      `/api/articles/${id}/like`,
      { method: 'POST' }
    );
    if (serverResult) return serverResult;

    let newLikes = 0;
    clientDb.update((d) => {
      const art = d.articles.find((a) => a.id === id);
      if (art) {
        art.likes += 1;
        newLikes = art.likes;
      }
    });
    return { success: true, likes: newLikes };
  },

  // 6. Visitor Registration / Login
  registerVisitor: async (body: { email: string; password: string; name?: string }) => {
    const serverResult = await tryServerRequest<{ success: boolean; token: string; user: User }>(
      '/api/auth/visitor/register',
      { method: 'POST', body: JSON.stringify(body) }
    );
    if (serverResult) return serverResult;

    const data = clientDb.get();
    if (!data.websiteSettings.allowVisitorRegistration) {
      throw new Error('Visitor registration is disabled by the administrator');
    }

    const newUser: User = {
      id: 'vis-' + Date.now(),
      email: body.email.toLowerCase().trim(),
      name: body.name || body.email.split('@')[0],
      role: 'visitor',
      createdAt: new Date().toISOString(),
    };

    clientDb.update((d) => {
      d.users.push(newUser);
    });

    const token = 'tok_vis_' + Date.now();
    setVisitorToken(token);
    return { success: true, token, user: newUser };
  },

  loginVisitor: async (body: { email: string; password: string }) => {
    const serverResult = await tryServerRequest<{ success: boolean; token: string; user: User }>(
      '/api/auth/visitor/login',
      { method: 'POST', body: JSON.stringify(body) }
    );
    if (serverResult) return serverResult;

    const user = clientDb.get().users.find((u) => u.email.toLowerCase() === body.email.toLowerCase().trim());
    if (!user) throw new Error('Invalid email or password');

    const token = 'tok_vis_' + Date.now();
    setVisitorToken(token);
    return { success: true, token, user };
  },

  // 7. Admin Status
  getAdminStatus: async () => {
    const serverResult = await tryServerRequest<{ email: string; initialSetupRequired: boolean }>(
      '/api/auth/admin/status'
    );
    if (serverResult) return serverResult;

    const data = clientDb.get();
    const admin = data.users.find((u) => u.role === 'admin');
    return {
      email: data.websiteSettings.adminEmail,
      initialSetupRequired: !admin || !admin.isInitialSetupCompleted,
    };
  },

  // 8. Admin Setup
  setupAdminPassword: async (body: { email: string; password: string; confirmPassword: string; name?: string }) => {
    const serverResult = await tryServerRequest<{ success: boolean; token: string; user: User }>(
      '/api/auth/admin/setup',
      { method: 'POST', body: JSON.stringify(body) }
    );
    if (serverResult) return serverResult;

    if (body.password !== body.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    if (body.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const hash = simpleHash(body.password);
    let updatedAdmin: User;

    clientDb.update((d) => {
      let admin = d.users.find((u) => u.email.toLowerCase() === body.email.toLowerCase());
      if (admin) {
        admin.isInitialSetupCompleted = true;
        (admin as any).passwordHash = hash;
        if (body.name) admin.name = body.name;
        updatedAdmin = admin;
      } else {
        updatedAdmin = {
          id: 'admin-' + Date.now(),
          email: body.email.toLowerCase(),
          name: body.name || 'Site Administrator',
          role: 'admin',
          isInitialSetupCompleted: true,
          createdAt: new Date().toISOString(),
        };
        (updatedAdmin as any).passwordHash = hash;
        d.users.push(updatedAdmin);
      }
    });

    clientDb.log('Admin Activated', `Initial administrative credentials set for ${body.email}`);
    const token = 'tok_adm_' + Date.now();
    setAdminToken(token);
    return { success: true, token, user: clientDb.get().users.find((u) => u.role === 'admin')! };
  },

  // 9. Admin Login
  loginAdmin: async (body: { email: string; password: string }) => {
    const serverResult = await tryServerRequest<{ success: boolean; token: string; user: User }>(
      '/api/auth/admin/login',
      { method: 'POST', body: JSON.stringify(body) }
    );
    if (serverResult) return serverResult;

    const data = clientDb.get();
    const admin = data.users.find(
      (u) => u.email.toLowerCase() === body.email.toLowerCase().trim() && u.role === 'admin'
    );

    if (!admin) {
      throw new Error('Administrator record not found');
    }

    const inputHash = simpleHash(body.password);
    const storedHash = (admin as any).passwordHash;

    if (storedHash && storedHash !== inputHash) {
      throw new Error('Invalid administrator password');
    }

    const token = 'tok_adm_' + Date.now();
    setAdminToken(token);
    clientDb.log('Admin Login', `Administrator logged in: ${admin.email}`);
    return { success: true, token, user: admin };
  },

  // 10. Admin Reset Password
  resetAdminPassword: async (body: { email: string; newPassword: string; confirmPassword: string; adminRecoveryCode: string }) => {
    const serverResult = await tryServerRequest<{ success: boolean; message: string }>(
      '/api/auth/admin/reset-password',
      { method: 'POST', body: JSON.stringify(body) }
    );
    if (serverResult) return serverResult;

    if (body.adminRecoveryCode !== 'ALLVIBEZ-SECURE-2026') {
      throw new Error('Invalid recovery authorization code');
    }
    if (body.newPassword !== body.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    if (body.newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters');
    }

    const hash = simpleHash(body.newPassword);
    clientDb.update((d) => {
      const admin = d.users.find((u) => u.role === 'admin');
      if (admin) {
        (admin as any).passwordHash = hash;
        admin.isInitialSetupCompleted = true;
      }
    });

    clientDb.log('Password Reset', `Password reset using recovery authorization key`);
    return { success: true, message: 'Password reset successfully. Please sign in.' };
  },

  // 11. Admin Me
  getAdminMe: async (): Promise<User> => {
    const serverResult = await tryServerRequest<User>('/api/auth/admin/me');
    if (serverResult) return serverResult;

    const admin = clientDb.get().users.find((u) => u.role === 'admin');
    if (!admin) throw new Error('Not authenticated');
    return admin;
  },

  // 12. Admin Stats
  getAdminStats: async () => {
    const serverResult = await tryServerRequest<{
      totalArticles: number;
      published: number;
      drafts: number;
      scheduled: number;
      totalViews: number;
      totalLikes: number;
      visitorCount: number;
      mediaCount: number;
      usersCount: number;
      recentActivity: ActivityLog[];
    }>('/api/admin/stats');
    if (serverResult) return serverResult;

    const data = clientDb.get();
    return {
      totalArticles: data.articles.length,
      published: data.articles.filter((a) => a.status === 'published').length,
      drafts: data.articles.filter((a) => a.status === 'draft').length,
      scheduled: data.articles.filter((a) => a.status === 'scheduled').length,
      totalViews: data.articles.reduce((acc, a) => acc + (a.views || 0), 0),
      totalLikes: data.articles.reduce((acc, a) => acc + (a.likes || 0), 0),
      visitorCount: data.visitorCount,
      mediaCount: data.media.length,
      usersCount: data.users.length,
      recentActivity: data.activityLogs.slice(0, 10),
    };
  },

  // 13. Admin Articles (All statuses)
  getAdminArticles: async (params: { status?: string; category?: string; search?: string } = {}) => {
    const q = new URLSearchParams();
    if (params.status) q.set('status', params.status);
    if (params.category) q.set('category', params.category);
    if (params.search) q.set('search', params.search);

    const serverResult = await tryServerRequest<Article[]>(`/api/admin/articles?${q.toString()}`);
    if (serverResult) return serverResult;

    let list = [...clientDb.get().articles];
    if (params.status && params.status !== 'all') list = list.filter((a) => a.status === params.status);
    if (params.category && params.category !== 'all') list = list.filter((a) => a.category === params.category);
    if (params.search) {
      const s = params.search.toLowerCase();
      list = list.filter((a) => a.title.toLowerCase().includes(s) || a.tags.some((t) => t.toLowerCase().includes(s)));
    }
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  },

  // 14. Create Article
  createArticle: async (articleData: Partial<Article> & { customSlug?: string }) => {
    const serverResult = await tryServerRequest<Article>('/api/admin/articles', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
    if (serverResult) return serverResult;

    const data = clientDb.get();
    const baseSlug = articleData.customSlug
      ? articleData.customSlug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      : (articleData.title || 'story').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    let uniqueSlug = baseSlug;
    let counter = 1;
    while (data.articles.some((a) => a.slug === uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const catObj = data.categories.find((c) => c.slug === articleData.category);
    const newArt: Article = {
      id: 'art-' + Date.now(),
      title: articleData.title || 'Untitled',
      slug: uniqueSlug,
      subtitle: articleData.subtitle || '',
      content: articleData.content || '',
      excerpt: articleData.excerpt || (articleData.title || '').substring(0, 160),
      featuredImage: articleData.featuredImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      imageCaption: articleData.imageCaption || '',
      category: articleData.category || 'music',
      categoryName: catObj ? catObj.name : 'Entertainment',
      tags: articleData.tags || ['Entertainment'],
      authorName: articleData.authorName || 'Editorial Team',
      status: articleData.status || 'published',
      featured: Boolean(articleData.featured),
      breaking: Boolean(articleData.breaking),
      trending: Boolean(articleData.trending),
      publishedAt: articleData.status === 'published' ? new Date().toISOString() : '',
      scheduledFor: articleData.scheduledFor,
      views: 0,
      likes: 0,
      seoTitle: articleData.seoTitle || `${articleData.title} | ALLVIBEZ11`,
      metaDescription: articleData.metaDescription || articleData.excerpt || articleData.title || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    clientDb.update((d) => {
      d.articles.unshift(newArt);
    });
    clientDb.log('Article Created', `Published or drafted: "${newArt.title}" (${newArt.slug})`);

    // Optional Supabase Sync if configured
    if (isSupabaseConfigured && supabase) {
      Promise.resolve(supabase.from('articles').insert([newArt])).catch(() => {});
    }

    return newArt;
  },

  // 15. Update Article
  updateArticle: async (id: string, updates: Partial<Article>) => {
    const serverResult = await tryServerRequest<Article>(`/api/admin/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (serverResult) return serverResult;

    let updated: Article | null = null;
    clientDb.update((d) => {
      const idx = d.articles.findIndex((a) => a.id === id);
      if (idx !== -1) {
        d.articles[idx] = {
          ...d.articles[idx],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        updated = d.articles[idx];
      }
    });

    if (!updated) throw new Error('Article not found');
    clientDb.log('Article Updated', `Updated "${(updated as Article).title}"`);
    return updated;
  },

  // 16. Delete Article
  deleteArticle: async (id: string) => {
    const serverResult = await tryServerRequest<{ success: boolean; message: string }>(
      `/api/admin/articles/${id}`,
      { method: 'DELETE' }
    );
    if (serverResult) return serverResult;

    clientDb.update((d) => {
      d.articles = d.articles.filter((a) => a.id !== id);
    });
    clientDb.log('Article Deleted', `Removed article ID: ${id}`);
    return { success: true, message: 'Article deleted successfully' };
  },

  // 17. Media Library
  getMedia: async (): Promise<MediaItem[]> => {
    const serverResult = await tryServerRequest<MediaItem[]>('/api/admin/media');
    if (serverResult) return serverResult;
    return clientDb.get().media;
  },

  uploadMedia: async (body: { name: string; base64Data: string; type: string }) => {
    const serverResult = await tryServerRequest<MediaItem>('/api/admin/media/upload', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (serverResult) return serverResult;

    const newItem: MediaItem = {
      id: 'med-' + Date.now(),
      name: body.name,
      url: body.base64Data, // Store directly as data URI on static host!
      size: Math.round(body.base64Data.length * 0.75),
      type: body.type,
      uploadedAt: new Date().toISOString(),
    };

    clientDb.update((d) => {
      d.media.unshift(newItem);
    });
    clientDb.log('Media Uploaded', `Uploaded asset: ${body.name}`);
    return newItem;
  },

  deleteMedia: async (id: string) => {
    const serverResult = await tryServerRequest<{ success: boolean }>(`/api/admin/media/${id}`, {
      method: 'DELETE',
    });
    if (serverResult) return serverResult;

    clientDb.update((d) => {
      d.media = d.media.filter((m) => m.id !== id);
    });
    return { success: true };
  },

  // 18. Settings
  getAdminSettings: async () => {
    const serverResult = await tryServerRequest<{
      website: WebsiteSettings;
      popUp: PopUpSettings;
      monetag: MonetagSettings;
      google: GoogleVerificationSettings;
      seo: SEOSettings;
    }>('/api/admin/settings');
    if (serverResult) return serverResult;

    const data = clientDb.get();
    return {
      website: data.websiteSettings,
      popUp: data.popUpSettings,
      monetag: data.monetagSettings,
      google: data.googleSettings,
      seo: data.seoSettings,
    };
  },

  updateWebsiteSettings: async (settings: Partial<WebsiteSettings>) => {
    const serverResult = await tryServerRequest<{ success: boolean; website: WebsiteSettings }>(
      '/api/admin/settings/website',
      { method: 'PUT', body: JSON.stringify(settings) }
    );
    if (serverResult) return serverResult;

    clientDb.update((d) => {
      d.websiteSettings = { ...d.websiteSettings, ...settings };
    });
    return { success: true, website: clientDb.get().websiteSettings };
  },

  updatePopUpSettings: async (settings: Partial<PopUpSettings>) => {
    const serverResult = await tryServerRequest<{ success: boolean; popUp: PopUpSettings }>(
      '/api/admin/settings/popup',
      { method: 'PUT', body: JSON.stringify(settings) }
    );
    if (serverResult) return serverResult;

    clientDb.update((d) => {
      d.popUpSettings = { ...d.popUpSettings, ...settings };
    });
    clientDb.log('Pop-Up Updated', `Monetag Smart Link pop-up ${settings.enabled ? 'enabled' : 'disabled'}`);
    return { success: true, popUp: clientDb.get().popUpSettings };
  },

  updateMonetagSettings: async (settings: Partial<MonetagSettings>) => {
    const serverResult = await tryServerRequest<{ success: boolean; monetag: MonetagSettings }>(
      '/api/admin/settings/monetag',
      { method: 'PUT', body: JSON.stringify(settings) }
    );
    if (serverResult) return serverResult;

    clientDb.update((d) => {
      d.monetagSettings = {
        ...d.monetagSettings,
        ...settings,
        ads: {
          ...d.monetagSettings.ads,
          ...(settings.ads || {}),
        },
      };
    });
    clientDb.log('Monetag Settings', 'Updated Monetag ads and verification');
    return { success: true, monetag: clientDb.get().monetagSettings };
  },

  updateGoogleSettings: async (settings: Partial<GoogleVerificationSettings>) => {
    const serverResult = await tryServerRequest<{ success: boolean; google: GoogleVerificationSettings }>(
      '/api/admin/settings/google',
      { method: 'PUT', body: JSON.stringify(settings) }
    );
    if (serverResult) return serverResult;

    clientDb.update((d) => {
      d.googleSettings = { ...d.googleSettings, ...settings };
    });
    clientDb.log('Google Verification', 'Updated Google Search Console settings');
    return { success: true, google: clientDb.get().googleSettings };
  },

  updateSEOSettings: async (settings: Partial<SEOSettings>) => {
    const serverResult = await tryServerRequest<{ success: boolean; seo: SEOSettings }>(
      '/api/admin/settings/seo',
      { method: 'PUT', body: JSON.stringify(settings) }
    );
    if (serverResult) return serverResult;

    clientDb.update((d) => {
      d.seoSettings = { ...d.seoSettings, ...settings };
    });
    return { success: true, seo: clientDb.get().seoSettings };
  },

  changeAdminPassword: async (body: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    const serverResult = await tryServerRequest<{ success: boolean; message: string }>(
      '/api/admin/security/password',
      { method: 'PUT', body: JSON.stringify(body) }
    );
    if (serverResult) return serverResult;

    if (body.newPassword !== body.confirmPassword) throw new Error('New passwords do not match');
    if (body.newPassword.length < 8) throw new Error('Password must be at least 8 characters');

    const admin = clientDb.get().users.find((u) => u.role === 'admin');
    if (!admin) throw new Error('Admin account not found');

    const currentHash = (admin as any).passwordHash;
    if (currentHash && currentHash !== simpleHash(body.currentPassword)) {
      throw new Error('Current password is incorrect');
    }

    clientDb.update((d) => {
      const a = d.users.find((u) => u.role === 'admin');
      if (a) (a as any).passwordHash = simpleHash(body.newPassword);
    });

    return { success: true, message: 'Password updated successfully' };
  },

  getAdminUsers: async (): Promise<User[]> => {
    const serverResult = await tryServerRequest<User[]>('/api/admin/users');
    if (serverResult) return serverResult;
    return clientDb.get().users;
  },

  deleteUser: async (id: string) => {
    const serverResult = await tryServerRequest<{ success: boolean }>(`/api/admin/users/${id}`, {
      method: 'DELETE',
    });
    if (serverResult) return serverResult;

    clientDb.update((d) => {
      d.users = d.users.filter((u) => u.id !== id);
    });
    return { success: true };
  },

  getAdminLogs: async (): Promise<ActivityLog[]> => {
    const serverResult = await tryServerRequest<ActivityLog[]>('/api/admin/logs');
    if (serverResult) return serverResult;
    return clientDb.get().activityLogs;
  },
};
