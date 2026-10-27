import React, { useState } from 'react';
import { Article, Category, PublicSettingsPayload } from '../types';
import {
  Flame,
  TrendingUp,
  Clock,
  Eye,
  ChevronRight,
  Sparkles,
  Share2,
  Bookmark,
  Calendar,
  Layers,
} from 'lucide-react';
import { MonetagAdSlot } from '../components/MonetagAdSlot';

interface HomePageProps {
  articles: Article[];
  categories: Category[];
  navigate: (route: string) => void;
  publicSettings?: PublicSettingsPayload | null;
  loading: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  articles,
  categories,
  navigate,
  publicSettings,
  loading,
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-semibold text-sm">Loading the hottest entertainment vibez...</p>
      </div>
    );
  }

  // Segment articles
  const heroArticle = articles.find((a) => a.featured) || articles[0];
  const sideFeatured = articles.filter((a) => a.id !== heroArticle?.id && (a.featured || a.trending)).slice(0, 2);
  const trendingArticles = articles.filter((a) => a.trending || a.views > 2000).slice(0, 6);
  
  // Category filter for the latest articles feed
  const filteredLatest = selectedCategoryFilter === 'all'
    ? articles
    : articles.filter((a) => a.category === selectedCategoryFilter);

  // Group by category spotlights
  const musicArticles = articles.filter((a) => a.category === 'music' || a.category === 'musicians').slice(0, 4);
  const nollywoodArticles = articles.filter((a) => a.category === 'nollywood').slice(0, 4);
  const hollywoodArticles = articles.filter((a) => a.category === 'hollywood' || a.category === 'actors').slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-12">
      {/* 1. Header Ad Placement (Top) */}
      <MonetagAdSlot
        placement={publicSettings?.monetag?.ads?.header}
        slotName="Header Ad"
      />

      {/* 2. Hero Featured Grid */}
      {heroArticle && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Hero (8 cols) */}
          <div
            onClick={() => navigate(`/article/${heroArticle.slug}`)}
            className="lg:col-span-8 group relative rounded-3xl overflow-hidden cursor-pointer bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 min-h-[420px] lg:min-h-[500px] flex flex-col justify-end p-6 lg:p-10 shadow-2xl"
          >
            {/* Background Image with Overlay */}
            <img
              src={heroArticle.featuredImage}
              alt={heroArticle.title}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-75 group-hover:brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            {/* Content Content Overlay */}
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 shadow-md">
                  {heroArticle.categoryName}
                </span>
                {heroArticle.breaking && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white flex items-center gap-1 animate-pulse">
                    <Flame className="w-3 h-3" /> BREAKING
                  </span>
                )}
                <span className="text-xs text-slate-300 flex items-center gap-1 font-medium bg-slate-900/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-slate-700/50">
                  <Clock className="w-3 h-3 text-amber-400" />
                  {new Date(heroArticle.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white group-hover:text-amber-300 transition tracking-tight leading-tight">
                {heroArticle.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-200 line-clamp-2 max-w-3xl font-medium leading-relaxed drop-shadow-sm">
                {heroArticle.subtitle || heroArticle.excerpt}
              </p>

              <div className="flex items-center justify-between pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-amber-400">By {heroArticle.authorName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    {heroArticle.views.toLocaleString()} reads
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                  Read Full Story <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>

          {/* Secondary Features (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {sideFeatured.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/article/${item.slug}`)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition flex-1 min-h-[220px] flex flex-col justify-end p-5 shadow-lg"
              >
                <img
                  src={item.featuredImage}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
                <div className="relative z-10 space-y-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                    {item.categoryName}
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
                    <span>{item.authorName}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-slate-400" />
                      {item.views.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Homepage Billboard Ad Placement */}
      <MonetagAdSlot
        placement={publicSettings?.monetag?.ads?.homepage}
        slotName="Homepage Billboard Ad"
      />

      {/* 4. Trending Stories Row */}
      <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Flame className="w-4 h-4 fill-rose-500/20" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider">
                Trending on ALLVIBEZ11
              </h2>
              <p className="text-xs text-slate-400">The most talked about entertainment scoops right now</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/trending')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingArticles.map((item, index) => (
            <div
              key={item.id}
              onClick={() => navigate(`/article/${item.slug}`)}
              className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/50 hover:border-amber-500/30 cursor-pointer transition group"
            >
              <div className="text-2xl font-black text-amber-500/60 group-hover:text-amber-400 w-7 shrink-0 text-center font-mono">
                #{index + 1}
              </div>
              <img
                src={item.featuredImage}
                alt={item.title}
                className="w-16 h-16 rounded-lg object-cover shrink-0 group-hover:scale-105 transition"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase text-amber-400">
                  {item.categoryName}
                </span>
                <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition line-clamp-2 leading-snug">
                  {item.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                  <span>{item.authorName}</span>
                  <span>•</span>
                  <span>{item.views} reads</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Main Content Feed with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Latest Articles Feed (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              Latest Articles
            </h2>

            {/* Quick Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setSelectedCategoryFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  selectedCategoryFilter === 'all'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              {categories.slice(0, 4).map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setSelectedCategoryFilter(c.slug)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap ${
                    selectedCategoryFilter === c.slug
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredLatest.map((item) => (
              <article
                key={item.id}
                onClick={() => navigate(`/article/${item.slug}`)}
                className="group p-4 rounded-2xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800/60 hover:border-amber-500/30 transition cursor-pointer flex flex-col sm:flex-row gap-5"
              >
                <div className="sm:w-56 h-40 rounded-xl overflow-hidden shrink-0 relative">
                  <img
                    src={item.featuredImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950/80 text-amber-400 backdrop-blur-sm border border-slate-800">
                    {item.categoryName}
                  </span>
                </div>

                <div className="flex flex-col justify-between py-1 space-y-2 flex-1">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition line-clamp-2 leading-snug mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
                      {item.subtitle || item.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800/40">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-300">{item.authorName}</span>
                      <span>•</span>
                      <span>{new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        {item.views}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Right Column: Sticky Sidebar (4 cols) */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Sidebar Monetag Ad */}
          <MonetagAdSlot
            placement={publicSettings?.monetag?.ads?.sidebar}
            slotName="Desktop Sidebar Ad"
          />

          {/* Category Cloud */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Browse Categories
            </h3>
            <div className="space-y-2">
              {categories.map((c) => {
                const count = articles.filter((a) => a.category === c.slug).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => navigate(`/category/${c.slug}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition text-left text-xs font-semibold text-slate-300 hover:text-amber-400 group"
                  >
                    <span>{c.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 group-hover:bg-amber-500/20 group-hover:text-amber-400">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nollywood Cinema Spotlight Card */}
          <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Nollywood Spotlight
            </div>
            <h4 className="text-base font-bold text-white">
              African Cinema Rising: Historic Box Office Milestones
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Explore in-depth analyses of how Nigerian and Pan-African filmmakers are transforming worldwide box office metrics and streaming charts.
            </p>
            <button
              onClick={() => navigate('/category/nollywood')}
              className="w-full py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs uppercase tracking-wider border border-emerald-500/40 transition"
            >
              Explore Nollywood Channel
            </button>
          </div>

          {/* Social Follow Hub */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider border-l-2 border-rose-500 pl-2">
              Join the Vibe Tribe
            </h3>
            <p className="text-xs text-slate-400">
              Follow ALLVIBEZ11 across social channels for instant music drops, red carpet photos, and live coverage.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href={publicSettings?.website?.socialLinks?.twitter || 'https://twitter.com/allvibez11'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-center text-xs font-bold text-slate-200 transition"
              >
                Twitter / X
              </a>
              <a
                href={publicSettings?.website?.socialLinks?.instagram || 'https://instagram.com/allvibez11'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-center text-xs font-bold text-rose-300 transition"
              >
                Instagram
              </a>
              <a
                href={publicSettings?.website?.socialLinks?.youtube || 'https://youtube.com/@allvibez11'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-center text-xs font-bold text-red-300 transition"
              >
                YouTube
              </a>
              <a
                href={publicSettings?.website?.socialLinks?.facebook || 'https://facebook.com/allvibez11'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-center text-xs font-bold text-blue-300 transition"
              >
                Facebook
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
