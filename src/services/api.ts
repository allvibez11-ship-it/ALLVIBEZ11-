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

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const adminToken = getAdminToken();
  if (adminToken && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${adminToken}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Public
  getPublicSettings: () => request<PublicSettingsPayload>('/api/public-settings'),
  getCategories: () => request<Category[]>('/api/categories'),
  getArticles: (params: {
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
    return request<{
      articles: Article[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`/api/articles?${q.toString()}`);
  },
  getArticle: (slugOrId: string) =>
    request<{ article: Article; related: Article[] }>(`/api/articles/${slugOrId}`),
  likeArticle: (id: string) =>
    request<{ success: boolean; likes: number }>(`/api/articles/${id}/like`, { method: 'POST' }),

  // Visitor Auth
  registerVisitor: (body: { email: string; password: string; name?: string }) =>
    request<{ success: boolean; token: string; user: User }>('/api/auth/visitor/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  loginVisitor: (body: { email: string; password: string }) =>
    request<{ success: boolean; token: string; user: User }>('/api/auth/visitor/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  // Admin Auth
  getAdminStatus: () =>
    request<{ email: string; initialSetupRequired: boolean }>('/api/auth/admin/status'),
  setupAdminPassword: (body: { email: string; password: string; confirmPassword: string; name?: string }) =>
    request<{ success: boolean; token: string; user: User }>('/api/auth/admin/setup', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  loginAdmin: (body: { email: string; password: string }) =>
    request<{ success: boolean; token: string; user: User }>('/api/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  resetAdminPassword: (body: { email: string; newPassword: string; confirmPassword: string; adminRecoveryCode: string }) =>
    request<{ success: boolean; message: string }>('/api/auth/admin/reset-password', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  getAdminMe: () => request<User>('/api/auth/admin/me'),

  // Protected Admin
  getAdminStats: () =>
    request<{
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
    }>('/api/admin/stats'),
  getAdminArticles: (params: { status?: string; category?: string; search?: string } = {}) => {
    const q = new URLSearchParams();
    if (params.status) q.set('status', params.status);
    if (params.category) q.set('category', params.category);
    if (params.search) q.set('search', params.search);
    return request<Article[]>(`/api/admin/articles?${q.toString()}`);
  },
  createArticle: (articleData: Partial<Article> & { customSlug?: string }) =>
    request<Article>('/api/admin/articles', {
      method: 'POST',
      body: JSON.stringify(articleData),
    }),
  updateArticle: (id: string, updates: Partial<Article>) =>
    request<Article>(`/api/admin/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteArticle: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/admin/articles/${id}`, {
      method: 'DELETE',
    }),

  // Media
  getMedia: () => request<MediaItem[]>('/api/admin/media'),
  uploadMedia: (body: { name: string; base64Data: string; type: string }) =>
    request<MediaItem>('/api/admin/media/upload', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  deleteMedia: (id: string) =>
    request<{ success: boolean }>(`/api/admin/media/${id}`, {
      method: 'DELETE',
    }),

  // Settings
  getAdminSettings: () =>
    request<{
      website: WebsiteSettings;
      popUp: PopUpSettings;
      monetag: MonetagSettings;
      google: GoogleVerificationSettings;
      seo: SEOSettings;
    }>('/api/admin/settings'),
  updateWebsiteSettings: (settings: Partial<WebsiteSettings>) =>
    request<{ success: boolean; website: WebsiteSettings }>('/api/admin/settings/website', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
  updatePopUpSettings: (settings: Partial<PopUpSettings>) =>
    request<{ success: boolean; popUp: PopUpSettings }>('/api/admin/settings/popup', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
  updateMonetagSettings: (settings: Partial<MonetagSettings>) =>
    request<{ success: boolean; monetag: MonetagSettings }>('/api/admin/settings/monetag', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
  updateGoogleSettings: (settings: Partial<GoogleVerificationSettings>) =>
    request<{ success: boolean; google: GoogleVerificationSettings }>('/api/admin/settings/google', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
  updateSEOSettings: (settings: Partial<SEOSettings>) =>
    request<{ success: boolean; seo: SEOSettings }>('/api/admin/settings/seo', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
  changeAdminPassword: (body: { currentPassword: string; newPassword: string; confirmPassword: string }) =>
    request<{ success: boolean; message: string }>('/api/admin/security/password', {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  getAdminUsers: () => request<User[]>('/api/admin/users'),
  deleteUser: (id: string) =>
    request<{ success: boolean }>(`/api/admin/users/${id}`, {
      method: 'DELETE',
    }),
  getAdminLogs: () => request<ActivityLog[]>('/api/admin/logs'),
};
