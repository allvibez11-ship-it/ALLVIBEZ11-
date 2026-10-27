import React, { useState } from 'react';
import {
  Search,
  Menu,
  X,
  Flame,
  Shield,
  User as UserIcon,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Logo } from './Logo';
import { PublicSettingsPayload, Category } from '../types';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
  publicSettings?: PublicSettingsPayload | null;
  categories: Category[];
  breakingTitle?: string;
  breakingSlug?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  navigate,
  publicSettings,
  categories,
  breakingTitle,
  breakingSlug,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navCategories = [
    { name: 'Home', path: '/' },
    { name: 'Music', path: '/category/music' },
    { name: 'Musicians', path: '/category/musicians' },
    { name: 'Movies', path: '/category/movies' },
    { name: 'Actors & Actresses', path: '/category/actors' },
    { name: 'Nollywood', path: '/category/nollywood' },
    { name: 'Hollywood', path: '/category/hollywood' },
    { name: 'Celebrity News', path: '/category/celebrity-news' },
    { name: 'Trending', path: '/trending' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      {/* 1. Top Ticker Bar */}
      <div className="bg-slate-900 border-b border-slate-800 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-600 text-white tracking-wider animate-pulse">
              <Flame className="w-3 h-3" /> BREAKING
            </span>
            <button
              onClick={() => breakingSlug && navigate(`/article/${breakingSlug}`)}
              className="text-slate-300 hover:text-amber-400 font-medium truncate text-left transition"
            >
              {breakingTitle || 'Burna Boy, Funke Akindele, & Tems dominate global entertainment charts this season.'}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4 text-slate-400 shrink-0">
            <span className="text-[11px] font-medium text-slate-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <div className="h-3 w-px bg-slate-700" />
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
              title="Admin Portal"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Brand Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => navigate('/')}
          className="text-left focus:outline-none group transition"
        >
          <Logo />
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white px-3.5 py-2 rounded-xl text-xs transition"
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline font-medium">Search entertainment...</span>
          </button>

          {/* Admin shortcut for mobile */}
          <button
            onClick={() => navigate('/admin')}
            className="md:hidden p-2 text-slate-400 hover:text-amber-400 bg-slate-900 rounded-lg border border-slate-800"
            title="Admin Portal"
          >
            <Shield className="w-4 h-4 text-amber-400" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white bg-slate-900 rounded-lg border border-slate-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. Category Navigation (Desktop) */}
      <nav className="hidden lg:block border-t border-slate-800/60 bg-slate-950/70">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto no-scrollbar">
          <ul className="flex items-center space-x-1 py-1">
            {navCategories.map((cat) => {
              const active = currentRoute === cat.path;
              return (
                <li key={cat.path}>
                  <button
                    onClick={() => navigate(cat.path)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                      active
                        ? 'bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-400 border border-amber-500/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2 py-1">
            <button
              onClick={() => navigate('/trending')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 transition"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trending Radar</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[108px] bg-slate-950 border-b border-slate-800 p-4 shadow-2xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-1">
            {navCategories.map((cat) => {
              const active = currentRoute === cat.path;
              return (
                <button
                  key={cat.path}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(cat.path);
                  }}
                  className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold tracking-wide transition ${
                    active
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}

            <div className="pt-4 mt-2 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/admin');
                }}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30"
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Admin Dashboard
                </span>
                <span className="text-xs font-mono">/admin</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-amber-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search musicians, movies, Nollywood, Hollywood, celebrity news..."
                className="w-full pl-12 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-3 p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </form>

            {/* Quick tags */}
            <div className="mt-3 flex items-center flex-wrap gap-2 text-xs">
              <span className="text-slate-400 font-semibold">Popular:</span>
              {['Burna Boy', 'Nollywood', 'Funke Akindele', 'Tems', 'Hollywood', 'Davido', 'Oscars'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    navigate(`/search?q=${encodeURIComponent(tag)}`);
                  }}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
