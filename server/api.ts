import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import {
  db,
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  Article,
  User,
} from './db.js';

export const apiRouter = express.Router();

// Middleware: Admin Authentication
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }

  const currentDb = db.get();
  const user = currentDb.users.find((u) => u.id === payload.userId && u.role === 'admin');
  if (!user) {
    return res.status(403).json({ error: 'Forbidden: Admin privileges required' });
  }

  (req as any).user = user;
  next();
}

// -----------------------------------------------------------------
// PUBLIC ENDPOINTS
// -----------------------------------------------------------------

// 1. Public Configuration & Settings (for header, footer, ads, popup, SEO meta)
apiRouter.get('/public-settings', (req: Request, res: Response) => {
  const data = db.get();
  // Safe sanitized payload (no secrets, no password hashes)
  res.json({
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
  });
});

// 2. Categories
apiRouter.get('/categories', (req: Request, res: Response) => {
  res.json(db.get().categories);
});

// 3. Articles (public listing)
apiRouter.get('/articles', (req: Request, res: Response) => {
  const data = db.get();
  const { category, search, tag, featured, breaking, trending, limit = '20', page = '1' } = req.query;

  const now = new Date();
  // Filter only published and scheduled that have passed
  let list = data.articles.filter((art) => {
    if (art.status !== 'published') return false;
    if (art.scheduledFor && new Date(art.scheduledFor) > now) return false;
    return true;
  });

  if (category && typeof category === 'string' && category !== 'all') {
    list = list.filter((art) => art.category.toLowerCase() === category.toLowerCase());
  }

  if (tag && typeof tag === 'string') {
    list = list.filter((art) =>
      art.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(
      (art) =>
        art.title.toLowerCase().includes(q) ||
        art.excerpt.toLowerCase().includes(q) ||
        art.tags.some((t) => t.toLowerCase().includes(q)) ||
        art.categoryName.toLowerCase().includes(q) ||
        art.authorName.toLowerCase().includes(q)
    );
  }

  if (featured === 'true') {
    list = list.filter((art) => art.featured);
  }
  if (breaking === 'true') {
    list = list.filter((art) => art.breaking);
  }
  if (trending === 'true') {
    list = list.filter((art) => art.trending || art.views > 2000);
  }

  // Sort by publishedAt descending
  list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const pageNum = parseInt(page as string, 10) || 1;
  const pageLimit = parseInt(limit as string, 10) || 20;
  const total = list.length;
  const paginated = list.slice((pageNum - 1) * pageLimit, pageNum * pageLimit);

  res.json({
    articles: paginated,
    total,
    page: pageNum,
    limit: pageLimit,
    totalPages: Math.ceil(total / pageLimit),
  });
});

// 4. Single Article by Slug or ID
apiRouter.get('/articles/:slugOrId', (req: Request, res: Response) => {
  const { slugOrId } = req.params;
  const currentDb = db.get();

  const article = currentDb.articles.find(
    (a) => a.slug === slugOrId || a.id === slugOrId
  );

  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }

  // Increment view count asynchronously
  db.update((d) => {
    const target = d.articles.find((a) => a.id === article.id);
    if (target) {
      target.views += 1;
    }
    d.visitorCount += 1;
  });

  // Get related articles in same category
  const related = currentDb.articles
    .filter((a) => a.id !== article.id && a.category === article.category && a.status === 'published')
    .slice(0, 4);

  res.json({
    article: { ...article, views: article.views + 1 },
    related,
  });
});

// 5. Like Article
apiRouter.post('/articles/:id/like', (req: Request, res: Response) => {
  const { id } = req.params;
  let newLikes = 0;
  db.update((d) => {
    const art = d.articles.find((a) => a.id === id);
    if (art) {
      art.likes += 1;
      newLikes = art.likes;
    }
  });
  res.json({ success: true, likes: newLikes });
});

// -----------------------------------------------------------------
// AUTHENTICATION: ADMIN
// -----------------------------------------------------------------

// Check Admin Status (Setup Required or Ready to Login)
apiRouter.get('/auth/admin/status', (req: Request, res: Response) => {
  const data = db.get();
  const adminUser = data.users.find(
    (u) => u.email === data.websiteSettings.adminEmail && u.role === 'admin'
  );

  const initialSetupRequired = !adminUser || !adminUser.passwordHash || !adminUser.isInitialSetupCompleted;

  res.json({
    email: data.websiteSettings.adminEmail,
    initialSetupRequired,
  });
});

// Initial Admin Password Setup (For allvibez11@gmail.com on first setup)
apiRouter.post('/auth/admin/setup', (req: Request, res: Response) => {
  const { email, password, confirmPassword, name } = req.body;
  const data = db.get();

  if (email.toLowerCase().trim() !== data.websiteSettings.adminEmail.toLowerCase().trim()) {
    return res.status(400).json({ error: `Initial setup can only be activated for designated administrator: ${data.websiteSettings.adminEmail}` });
  }

  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  let adminUser = data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (adminUser && adminUser.isInitialSetupCompleted && adminUser.passwordHash) {
    return res.status(400).json({ error: 'Admin account has already been set up. Please log in directly.' });
  }

  const { hash, salt } = hashPassword(password);

  db.update((d) => {
    let target = d.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (target) {
      target.passwordHash = hash;
      target.salt = salt;
      target.isInitialSetupCompleted = true;
      if (name) target.name = name;
    } else {
      target = {
        id: 'admin-' + Date.now(),
        email: email.toLowerCase().trim(),
        name: name || 'Site Administrator',
        role: 'admin',
        passwordHash: hash,
        salt,
        isInitialSetupCompleted: true,
        createdAt: new Date().toISOString(),
      };
      d.users.push(target);
    }
  });

  const updatedAdmin = db.get().users.find((u) => u.email.toLowerCase() === email.toLowerCase())!;
  const token = generateToken(updatedAdmin.id);

  db.logActivity('Admin Activated', `Initial administrative credentials configured for ${email}`);

  res.json({
    success: true,
    message: 'Admin account configured successfully!',
    token,
    user: {
      id: updatedAdmin.id,
      email: updatedAdmin.email,
      name: updatedAdmin.name,
      role: updatedAdmin.role,
    },
  });
});

// Admin Login
apiRouter.post('/auth/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const data = db.get();
  const user = data.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.role === 'admin');

  if (!user || !user.passwordHash || !user.salt) {
    return res.status(401).json({ error: 'Invalid credentials or administrator account not yet configured' });
  }

  const isValid = verifyPassword(password, user.passwordHash, user.salt);
  if (!isValid) {
    db.logActivity('Failed Login Attempt', `Unsuccessful login attempt for admin email ${email}`);
    return res.status(401).json({ error: 'Invalid administrator email or password' });
  }

  const token = generateToken(user.id);
  db.logActivity('Admin Login', `Administrator logged in: ${user.email}`);

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

// Admin Recovery / Password Reset
apiRouter.post('/auth/admin/reset-password', (req: Request, res: Response) => {
  const { email, newPassword, confirmPassword, adminRecoveryCode } = req.body;
  const data = db.get();

  if (email.toLowerCase().trim() !== data.websiteSettings.adminEmail.toLowerCase().trim()) {
    return res.status(400).json({ error: 'Invalid recovery request email' });
  }

  // Check recovery code (defaults to administrative pin or confirmation code)
  if (!adminRecoveryCode || adminRecoveryCode !== 'ALLVIBEZ-SECURE-2026') {
    return res.status(400).json({ error: 'Invalid administrative recovery authorization code' });
  }

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  const { hash, salt } = hashPassword(newPassword);

  db.update((d) => {
    const admin = d.users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.role === 'admin');
    if (admin) {
      admin.passwordHash = hash;
      admin.salt = salt;
    }
  });

  db.logActivity('Password Reset', `Administrator password reset successfully for ${email}`);
  res.json({ success: true, message: 'Administrator password reset successfully. Please log in.' });
});

// Admin Me
apiRouter.get('/auth/admin/me', requireAdmin, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
});

// -----------------------------------------------------------------
// AUTHENTICATION: OPTIONAL VISITOR
// -----------------------------------------------------------------

apiRouter.post('/auth/visitor/register', (req: Request, res: Response) => {
  const data = db.get();
  if (!data.websiteSettings.allowVisitorRegistration) {
    return res.status(403).json({ error: 'Visitor registration is currently disabled by the administrator' });
  }

  const { email, password, name } = req.body;
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ error: 'Valid email and password (min 6 characters) required' });
  }

  const normalized = email.toLowerCase().trim();
  const existing = data.users.find((u) => u.email.toLowerCase() === normalized);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const { hash, salt } = hashPassword(password);
  const newUser: User = {
    id: 'visitor-' + Date.now(),
    email: normalized,
    name: name || normalized.split('@')[0],
    role: 'visitor',
    passwordHash: hash,
    salt,
    createdAt: new Date().toISOString(),
  };

  db.update((d) => {
    d.users.push(newUser);
  });

  const token = generateToken(newUser.id);
  res.json({
    success: true,
    token,
    user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
  });
});

apiRouter.post('/auth/visitor/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const data = db.get();
  const user = data.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.role === 'visitor');

  if (!user || !user.passwordHash || !user.salt) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isValid = verifyPassword(password, user.passwordHash, user.salt);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = generateToken(user.id);
  res.json({
    success: true,
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

// -----------------------------------------------------------------
// PROTECTED ADMIN ENDPOINTS
// -----------------------------------------------------------------

// Admin Dashboard Overview Stats
apiRouter.get('/admin/stats', requireAdmin, (req: Request, res: Response) => {
  const data = db.get();
  const totalArticles = data.articles.length;
  const published = data.articles.filter((a) => a.status === 'published').length;
  const drafts = data.articles.filter((a) => a.status === 'draft').length;
  const scheduled = data.articles.filter((a) => a.status === 'scheduled').length;
  const totalViews = data.articles.reduce((acc, a) => acc + (a.views || 0), 0);
  const totalLikes = data.articles.reduce((acc, a) => acc + (a.likes || 0), 0);

  res.json({
    totalArticles,
    published,
    drafts,
    scheduled,
    totalViews,
    totalLikes,
    visitorCount: data.visitorCount,
    mediaCount: data.media.length,
    usersCount: data.users.length,
    recentActivity: data.activityLogs.slice(0, 10),
  });
});

// Admin All Articles (includes drafts & scheduled)
apiRouter.get('/admin/articles', requireAdmin, (req: Request, res: Response) => {
  const { status, category, search } = req.query;
  let list = [...db.get().articles];

  if (status && status !== 'all') {
    list = list.filter((a) => a.status === status);
  }
  if (category && category !== 'all') {
    list = list.filter((a) => a.category === category);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter((a) => a.title.toLowerCase().includes(q) || a.tags.some((t) => t.toLowerCase().includes(q)));
  }

  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(list);
});

// Admin Create Article
apiRouter.post('/admin/articles', requireAdmin, (req: Request, res: Response) => {
  const {
    title,
    subtitle,
    content,
    excerpt,
    featuredImage,
    imageCaption,
    category,
    tags,
    authorName,
    status = 'published',
    featured = false,
    breaking = false,
    trending = false,
    scheduledFor,
    seoTitle,
    metaDescription,
    customSlug,
  } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  // Create clean slug
  const baseSlug = customSlug
    ? customSlug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    : title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const data = db.get();
  let uniqueSlug = baseSlug;
  let counter = 1;
  while (data.articles.some((a) => a.slug === uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  const categoryObj = data.categories.find((c) => c.slug === category);
  const categoryName = categoryObj ? categoryObj.name : category || 'Entertainment';

  const newArticle: Article = {
    id: 'art-' + Date.now(),
    title,
    slug: uniqueSlug,
    subtitle: subtitle || '',
    content,
    excerpt: excerpt || title.substring(0, 160),
    featuredImage: featuredImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    imageCaption: imageCaption || '',
    category: category || 'music',
    categoryName,
    tags: Array.isArray(tags) ? tags : (tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
    authorName: authorName || 'Editorial Team',
    status: status || 'published',
    featured: Boolean(featured),
    breaking: Boolean(breaking),
    trending: Boolean(trending),
    publishedAt: status === 'published' ? new Date().toISOString() : '',
    scheduledFor: status === 'scheduled' ? scheduledFor : undefined,
    views: 0,
    likes: 0,
    seoTitle: seoTitle || `${title} | ALLVIBEZ11`,
    metaDescription: metaDescription || excerpt || title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.update((d) => {
    d.articles.unshift(newArticle);
  });

  db.logActivity('Article Created', `Published or drafted: "${title}" (${newArticle.slug})`);

  res.status(201).json(newArticle);
});

// Admin Update Article
apiRouter.put('/admin/articles/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  let updatedArticle: Article | null = null;

  db.update((d) => {
    const idx = d.articles.findIndex((a) => a.id === id);
    if (idx !== -1) {
      const existing = d.articles[idx];
      let categoryName = existing.categoryName;
      if (updates.category && updates.category !== existing.category) {
        const cat = d.categories.find((c) => c.slug === updates.category);
        if (cat) categoryName = cat.name;
      }

      const tags = Array.isArray(updates.tags)
        ? updates.tags
        : typeof updates.tags === 'string'
        ? updates.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        : existing.tags;

      d.articles[idx] = {
        ...existing,
        ...updates,
        tags,
        categoryName,
        updatedAt: new Date().toISOString(),
      };
      // If status changed to published and publishedAt empty, set it
      if (updates.status === 'published' && !d.articles[idx].publishedAt) {
        d.articles[idx].publishedAt = new Date().toISOString();
      }
      updatedArticle = d.articles[idx];
    }
  });

  if (!updatedArticle) {
    return res.status(404).json({ error: 'Article not found' });
  }

  db.logActivity('Article Updated', `Updated article ID ${id}: "${(updatedArticle as Article).title}"`);
  res.json(updatedArticle);
});

// Admin Delete Article
apiRouter.delete('/admin/articles/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  let deletedTitle = '';

  db.update((d) => {
    const art = d.articles.find((a) => a.id === id);
    if (art) {
      deletedTitle = art.title;
      d.articles = d.articles.filter((a) => a.id !== id);
    }
  });

  if (!deletedTitle) {
    return res.status(404).json({ error: 'Article not found' });
  }

  db.logActivity('Article Deleted', `Deleted article: "${deletedTitle}"`);
  res.json({ success: true, message: `Article "${deletedTitle}" deleted successfully` });
});

// -----------------------------------------------------------------
// MEDIA LIBRARY
// -----------------------------------------------------------------

apiRouter.get('/admin/media', requireAdmin, (req: Request, res: Response) => {
  res.json(db.get().media);
});

apiRouter.post('/admin/media/upload', requireAdmin, (req: Request, res: Response) => {
  const { name, base64Data, type = 'image/jpeg' } = req.body;
  if (!base64Data) {
    return res.status(400).json({ error: 'Image data is required' });
  }

  try {
    const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    const ext = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : 'jpg';
    const filename = `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const uploadsDir = path.resolve(process.cwd(), 'public/uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, buffer);

    const mediaItem = {
      id: 'med-' + Date.now(),
      name: name || filename,
      url: `/uploads/${filename}`,
      size: buffer.length,
      type,
      uploadedAt: new Date().toISOString(),
    };

    db.update((d) => {
      d.media.unshift(mediaItem);
    });

    db.logActivity('Media Uploaded', `Uploaded media file: ${mediaItem.name}`);
    res.json(mediaItem);
  } catch (e: any) {
    res.status(500).json({ error: `Upload failed: ${e.message}` });
  }
});

apiRouter.delete('/admin/media/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  db.update((d) => {
    const item = d.media.find((m) => m.id === id);
    if (item && item.url.startsWith('/uploads/')) {
      const filePath = path.resolve(process.cwd(), 'public', item.url.replace(/^\//, ''));
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch {}
      }
    }
    d.media = d.media.filter((m) => m.id !== id);
  });
  res.json({ success: true });
});

// -----------------------------------------------------------------
// SETTINGS MANAGEMENT
// -----------------------------------------------------------------

apiRouter.get('/admin/settings', requireAdmin, (req: Request, res: Response) => {
  const data = db.get();
  res.json({
    website: data.websiteSettings,
    popUp: data.popUpSettings,
    monetag: data.monetagSettings,
    google: data.googleSettings,
    seo: data.seoSettings,
  });
});

// Website settings
apiRouter.put('/admin/settings/website', requireAdmin, (req: Request, res: Response) => {
  const updates = req.body;
  db.update((d) => {
    d.websiteSettings = { ...d.websiteSettings, ...updates };
  });
  db.logActivity('Settings Updated', 'General website settings updated');
  res.json({ success: true, website: db.get().websiteSettings });
});

// Pop-up & Monetag Smart Link settings
apiRouter.put('/admin/settings/popup', requireAdmin, (req: Request, res: Response) => {
  const updates = req.body;
  db.update((d) => {
    d.popUpSettings = { ...d.popUpSettings, ...updates };
  });
  db.logActivity('Pop-up Settings Updated', `Monetag Smart Link pop-up ${updates.enabled ? 'enabled' : 'disabled'}`);
  res.json({ success: true, popUp: db.get().popUpSettings });
});

// Monetag Ads & Verification settings
apiRouter.put('/admin/settings/monetag', requireAdmin, (req: Request, res: Response) => {
  const updates = req.body;
  db.update((d) => {
    d.monetagSettings = {
      ...d.monetagSettings,
      ...updates,
      ads: {
        ...d.monetagSettings.ads,
        ...(updates.ads || {}),
      },
    };
  });
  db.logActivity('Monetag Settings Updated', 'Monetag ads & ownership verification settings saved');
  res.json({ success: true, monetag: db.get().monetagSettings });
});

// Google Search Console settings
apiRouter.put('/admin/settings/google', requireAdmin, (req: Request, res: Response) => {
  const updates = req.body;
  db.update((d) => {
    d.googleSettings = { ...d.googleSettings, ...updates };
  });
  db.logActivity('Google Verification Updated', 'Google Search Console verification settings saved');
  res.json({ success: true, google: db.get().googleSettings });
});

// SEO settings
apiRouter.put('/admin/settings/seo', requireAdmin, (req: Request, res: Response) => {
  const updates = req.body;
  db.update((d) => {
    d.seoSettings = { ...d.seoSettings, ...updates };
  });
  db.logActivity('SEO Settings Updated', 'Search engine optimization configuration updated');
  res.json({ success: true, seo: db.get().seoSettings });
});

// Security: Change Admin Password
apiRouter.put('/admin/security/password', requireAdmin, (req: Request, res: Response) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const user = (req as any).user as User;

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'New passwords do not match' });
  }

  const data = db.get();
  const dbUser = data.users.find((u) => u.id === user.id);
  if (!dbUser || !dbUser.passwordHash || !dbUser.salt) {
    return res.status(400).json({ error: 'User record not found' });
  }

  const isValid = verifyPassword(currentPassword, dbUser.passwordHash, dbUser.salt);
  if (!isValid) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }

  const { hash, salt } = hashPassword(newPassword);
  db.update((d) => {
    const target = d.users.find((u) => u.id === user.id);
    if (target) {
      target.passwordHash = hash;
      target.salt = salt;
    }
  });

  db.logActivity('Password Changed', `Administrator updated password for ${user.email}`);
  res.json({ success: true, message: 'Password updated successfully' });
});

// Users management
apiRouter.get('/admin/users', requireAdmin, (req: Request, res: Response) => {
  const users = db.get().users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    createdAt: u.createdAt,
    isInitialSetupCompleted: u.isInitialSetupCompleted,
  }));
  res.json(users);
});

apiRouter.delete('/admin/users/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user as User;
  if (id === user.id) {
    return res.status(400).json({ error: 'Cannot delete your own active administrator account' });
  }

  db.update((d) => {
    d.users = d.users.filter((u) => u.id !== id);
  });
  res.json({ success: true });
});

// Activity logs
apiRouter.get('/admin/logs', requireAdmin, (req: Request, res: Response) => {
  res.json(db.get().activityLogs);
});
