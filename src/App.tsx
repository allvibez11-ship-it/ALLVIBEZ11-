import React, { useState, useEffect } from 'react';
import { api, getAdminToken, removeAdminToken } from './services/api';
import { Article, Category, PublicSettingsPayload, User } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SmartLinkPopUp } from './components/SmartLinkPopUp';
import { SEOMetaManager } from './components/SEOMetaManager';

// Pages
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { SearchPage } from './pages/SearchPage';
import { StaticPages } from './pages/StaticPages';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Helper to detect repository subpath on GitHub Pages (e.g. /ALLVIBEZ11- or /allvibez11-ship-it)
export function getBasePrefix(): string {
  if (typeof window === 'undefined') return '';
  const isGithubPages = window.location.hostname.endsWith('github.io');
  if (isGithubPages) {
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts.length > 0) {
      return '/' + parts[0];
    }
  }
  return '';
}

// Extract internal route stripped of repository base prefix or hash
export function extractInternalRoute(): string {
  if (typeof window === 'undefined') return '/';

  // 1. Check hash routing first (e.g. #/article/xyz or #/admin)
  if (window.location.hash) {
    const cleanHash = window.location.hash.replace(/^#\/?/, '/');
    return cleanHash || '/';
  }

  // 2. Extract from pathname
  const basePrefix = getBasePrefix();
  let path = window.location.pathname;
  if (basePrefix && path.startsWith(basePrefix)) {
    path = path.substring(basePrefix.length);
  }
  if (!path || path === '') return '/';
  return path;
}

export default function App() {
  // Navigation / Routing State
  const [currentRoute, setCurrentRoute] = useState<string>(extractInternalRoute);
  const [searchParams, setSearchParams] = useState<string>(
    typeof window !== 'undefined' ? window.location.search : ''
  );

  // Global Public Data
  const [publicSettings, setPublicSettings] = useState<PublicSettingsPayload | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  // Admin Auth State
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [initialSetupRequired, setInitialSetupRequired] = useState(false);
  const [checkingAdminAuth, setCheckingAdminAuth] = useState(true);

  // Sync with browser navigation (popstate & hashchange)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(extractInternalRoute());
      setSearchParams(window.location.search || '');
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (to: string) => {
    const basePrefix = getBasePrefix();
    // Build full path including repo base prefix for pushState
    const fullUrl = to.startsWith('/') ? `${basePrefix}${to}` : `${basePrefix}/${to}`;
    window.history.pushState({}, '', fullUrl);

    const [path, query] = to.split('?');
    setCurrentRoute(path.startsWith('/') ? path : `/${path}`);
    setSearchParams(query ? `?${query}` : '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initial Data Fetch
  const loadPublicData = async () => {
    try {
      const [settingsData, categoriesData, articlesData] = await Promise.all([
        api.getPublicSettings().catch(() => null),
        api.getCategories().catch(() => []),
        api.getArticles({ limit: 40 }).catch(() => ({ articles: [] })),
      ]);

      if (settingsData) setPublicSettings(settingsData);
      if (categoriesData) setCategories(categoriesData);
      if (articlesData?.articles) setArticles(articlesData.articles);
    } catch (e) {
      console.error('Failed to load initial data:', e);
    } finally {
      setLoadingArticles(false);
    }
  };

  // Check Admin Status & Credentials
  const checkAdminAuth = async () => {
    setCheckingAdminAuth(true);
    try {
      const status = await api.getAdminStatus();
      setInitialSetupRequired(status.initialSetupRequired);

      const token = getAdminToken();
      if (token) {
        const user = await api.getAdminMe().catch(() => null);
        if (user && user.role === 'admin') {
          setAdminUser(user);
        } else {
          removeAdminToken();
          setAdminUser(null);
        }
      }
    } catch (err) {
      console.error('Error verifying admin authorization:', err);
    } finally {
      setCheckingAdminAuth(false);
    }
  };

  useEffect(() => {
    loadPublicData();
    checkAdminAuth();
  }, []);

  // Determine which page to render based on currentRoute
  const isHomepage = currentRoute === '/';
  const isAdminRoute = currentRoute.startsWith('/admin');

  // Breaking news story for top ticker
  const breakingStory = articles.find((a) => a.breaking) || articles[0];

  // RENDER ADMIN DASHBOARD OR LOGIN
  if (isAdminRoute) {
    if (checkingAdminAuth) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
          <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4" />
          <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">
            Securing Administrative Access...
          </p>
        </div>
      );
    }

    if (!adminUser) {
      return (
        <div className="min-h-screen bg-slate-950">
          <AdminLogin
            initialSetupRequired={initialSetupRequired}
            adminEmail={publicSettings?.website?.adminEmail || 'allvibez11@gmail.com'}
            onLoginSuccess={(user) => {
              setAdminUser(user);
              setInitialSetupRequired(false);
            }}
            navigate={navigate}
          />
        </div>
      );
    }

    return (
      <AdminDashboard
        currentUser={adminUser}
        onLogout={() => {
          setAdminUser(null);
          navigate('/admin');
        }}
        navigate={navigate}
      />
    );
  }

  // RENDER PUBLIC WEBSITE
  const renderPublicPage = () => {
    // 1. Article Detail: /article/:slug
    if (currentRoute.startsWith('/article/')) {
      const slug = currentRoute.replace('/article/', '');
      return (
        <ArticleDetailPage
          slug={slug}
          navigate={navigate}
          publicSettings={publicSettings}
        />
      );
    }

    // 2. Category Page: /category/:slug or /music or /movies etc.
    if (currentRoute.startsWith('/category/')) {
      const catSlug = currentRoute.replace('/category/', '');
      return (
        <CategoryPage
          categorySlug={catSlug}
          articles={articles}
          categories={categories}
          navigate={navigate}
          publicSettings={publicSettings}
        />
      );
    }

    // Direct Category shortcuts (e.g. /music, /musicians, /movies, etc.)
    const directCategories = ['music', 'musicians', 'movies', 'actors', 'nollywood', 'hollywood', 'celebrity-news'];
    const matchedDirect = directCategories.find((dc) => currentRoute === `/${dc}`);
    if (matchedDirect) {
      return (
        <CategoryPage
          categorySlug={matchedDirect}
          articles={articles}
          categories={categories}
          navigate={navigate}
          publicSettings={publicSettings}
        />
      );
    }

    // 3. Trending Page: /trending
    if (currentRoute === '/trending') {
      return (
        <CategoryPage
          categorySlug="trending"
          articles={articles.filter((a) => a.trending || a.views > 2000)}
          categories={categories}
          navigate={navigate}
          publicSettings={publicSettings}
        />
      );
    }

    // 4. Search Page: /search
    if (currentRoute === '/search') {
      const q = new URLSearchParams(searchParams).get('q') || '';
      return (
        <SearchPage
          initialQuery={q}
          articles={articles}
          categories={categories}
          navigate={navigate}
        />
      );
    }

    // 5. Static Pages: /about, /contact, /privacy, /terms, /disclaimer
    if (currentRoute === '/about') {
      return <StaticPages page="about" publicSettings={publicSettings} />;
    }
    if (currentRoute === '/contact') {
      return <StaticPages page="contact" publicSettings={publicSettings} />;
    }
    if (currentRoute === '/privacy') {
      return <StaticPages page="privacy" publicSettings={publicSettings} />;
    }
    if (currentRoute === '/terms') {
      return <StaticPages page="terms" publicSettings={publicSettings} />;
    }
    if (currentRoute === '/disclaimer') {
      return <StaticPages page="disclaimer" publicSettings={publicSettings} />;
    }

    // Default: Homepage
    return (
      <HomePage
        articles={articles}
        categories={categories}
        navigate={navigate}
        publicSettings={publicSettings}
        loading={loadingArticles}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Dynamic SEO, Meta Tags, and Schema.org Structured Data */}
      <SEOMetaManager publicSettings={publicSettings} />

      {/* Main Public Navigation Bar */}
      <Navbar
        currentRoute={currentRoute}
        navigate={navigate}
        publicSettings={publicSettings}
        categories={categories}
        breakingTitle={breakingStory?.title}
        breakingSlug={breakingStory?.slug}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {renderPublicPage()}
      </main>

      {/* Monetag Smart Link Pop-Up Modal */}
      <SmartLinkPopUp
        settings={publicSettings?.popUp}
        isHomepage={isHomepage}
        isPreview={false}
      />

      {/* Public Footer */}
      <Footer
        navigate={navigate}
        publicSettings={publicSettings}
        categories={categories}
      />
    </div>
  );
}
