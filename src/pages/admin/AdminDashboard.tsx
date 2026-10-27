import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Settings,
  DollarSign,
  Search,
  Users,
  Shield,
  LogOut,
  ExternalLink,
  Flame,
  Globe,
  Plus,
  Menu,
  X,
  AlertCircle,
} from 'lucide-react';
import { Logo } from '../../components/Logo';
import { api, removeAdminToken } from '../../services/api';
import {
  Article,
  Category,
  MediaItem,
  User,
  WebsiteSettings,
  PopUpSettings,
  MonetagSettings,
  GoogleVerificationSettings,
  SEOSettings,
  ActivityLog,
} from '../../types';

// Tab Components
import { OverviewTab } from './tabs/OverviewTab';
import { ArticlesTab } from './tabs/ArticlesTab';
import { MediaTab } from './tabs/MediaTab';
import { WebsiteSettingsTab } from './tabs/WebsiteSettingsTab';
import { PopUpSettingsTab } from './tabs/PopUpSettingsTab';
import { MonetagSettingsTab } from './tabs/MonetagSettingsTab';
import { GoogleVerificationTab } from './tabs/GoogleVerificationTab';
import { SEOSettingsTab } from './tabs/SEOSettingsTab';
import { UserManagementTab } from './tabs/UserManagementTab';
import { SecuritySettingsTab } from './tabs/SecuritySettingsTab';

interface AdminDashboardProps {
  currentUser: User;
  onLogout: () => void;
  navigate: (route: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onLogout,
  navigate,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Loaded Data
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings | null>(null);
  const [popUpSettings, setPopUpSettings] = useState<PopUpSettings | null>(null);
  const [monetagSettings, setMonetagSettings] = useState<MonetagSettings | null>(null);
  const [googleSettings, setGoogleSettings] = useState<GoogleVerificationSettings | null>(null);
  const [seoSettings, setSeoSettings] = useState<SEOSettings | null>(null);

  // Direct article edit trigger from overview
  const [openEditorArticle, setOpenEditorArticle] = useState<Article | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        statsRes,
        articlesRes,
        categoriesRes,
        mediaRes,
        settingsRes,
        usersRes,
        logsRes,
      ] = await Promise.all([
        api.getAdminStats(),
        api.getAdminArticles(),
        api.getCategories(),
        api.getMedia(),
        api.getAdminSettings(),
        api.getAdminUsers(),
        api.getAdminLogs(),
      ]);

      setStats(statsRes);
      setArticles(articlesRes);
      setCategories(categoriesRes);
      setMedia(mediaRes);
      setWebsiteSettings(settingsRes.website);
      setPopUpSettings(settingsRes.popUp);
      setMonetagSettings(settingsRes.monetag);
      setGoogleSettings(settingsRes.google);
      setSeoSettings(settingsRes.seo);
      setUsers(usersRes);
      setLogs(logsRes);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogoutClick = () => {
    removeAdminToken();
    onLogout();
  };

  const navItems = [
    { id: 'overview', label: '1. Overview', icon: LayoutDashboard },
    { id: 'articles', label: '2. Articles & Categories', icon: FileText },
    { id: 'media', label: '3. Media Library', icon: ImageIcon },
    { id: 'website', label: '4. Website Settings', icon: Settings },
    { id: 'popup', label: '5. Pop-up & Smart Link', icon: DollarSign },
    { id: 'monetag', label: '6. Monetag Ads & Verification', icon: Flame },
    { id: 'google', label: '7. Google Search Console', icon: Search },
    { id: 'seo', label: '8. SEO Settings', icon: Globe },
    { id: 'users', label: '9. User Management', icon: Users },
    { id: 'security', label: '10. Security & Credentials', icon: Shield },
  ];

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-bold text-sm">Loading ALLVIBEZ11 Administrative Console...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950 text-slate-100 antialiased">
      {/* 1. Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
        <Logo variant="compact" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="p-2 text-slate-400 hover:text-white"
            title="View public website"
          >
            <ExternalLink className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 text-slate-400 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 2. Admin Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-5 transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Logo & Brand */}
          <div className="pt-2">
            <button onClick={() => navigate('/')} className="text-left focus:outline-none">
              <Logo variant="compact" />
            </button>
            <div className="mt-2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-300">
              <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{currentUser.email}</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-260px)] no-scrollbar text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition font-medium"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" /> View Public Site
            </span>
          </button>
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition font-bold"
          >
            <LogOut className="w-4 h-4" /> Logout Session
          </button>
        </div>
      </aside>

      {/* 3. Main Content View Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto overflow-y-auto">
        {activeTab === 'overview' && (
          <OverviewTab
            stats={stats}
            articles={articles}
            setActiveTab={setActiveTab}
            navigate={navigate}
            onNewArticle={() => {
              setOpenEditorArticle(null);
              setActiveTab('articles');
            }}
          />
        )}

        {activeTab === 'articles' && (
          <ArticlesTab
            articles={articles}
            categories={categories}
            media={media}
            onRefresh={fetchDashboardData}
            openEditorWithArticle={openEditorArticle}
            onClearEditArticle={() => setOpenEditorArticle(null)}
          />
        )}

        {activeTab === 'media' && (
          <MediaTab media={media} onRefresh={fetchDashboardData} />
        )}

        {activeTab === 'website' && websiteSettings && (
          <WebsiteSettingsTab
            initialSettings={websiteSettings}
            onRefresh={fetchDashboardData}
          />
        )}

        {activeTab === 'popup' && popUpSettings && (
          <PopUpSettingsTab
            initialSettings={popUpSettings}
            onRefresh={fetchDashboardData}
          />
        )}

        {activeTab === 'monetag' && monetagSettings && (
          <MonetagSettingsTab
            initialSettings={monetagSettings}
            onRefresh={fetchDashboardData}
          />
        )}

        {activeTab === 'google' && googleSettings && (
          <GoogleVerificationTab
            initialSettings={googleSettings}
            onRefresh={fetchDashboardData}
          />
        )}

        {activeTab === 'seo' && seoSettings && (
          <SEOSettingsTab
            initialSettings={seoSettings}
            onRefresh={fetchDashboardData}
          />
        )}

        {activeTab === 'users' && websiteSettings && (
          <UserManagementTab
            users={users}
            websiteSettings={websiteSettings}
            onRefresh={fetchDashboardData}
          />
        )}

        {activeTab === 'security' && (
          <SecuritySettingsTab
            logs={logs}
            onLogout={handleLogoutClick}
            adminEmail={currentUser.email}
          />
        )}
      </main>
    </div>
  );
};
