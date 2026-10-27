import React, { useState } from 'react';
import { Article, Category, PublicSettingsPayload } from '../types';
import { Eye, Clock, ArrowUpDown, ChevronRight, Layers } from 'lucide-react';
import { MonetagAdSlot } from '../components/MonetagAdSlot';

interface CategoryPageProps {
  categorySlug: string;
  articles: Article[];
  categories: Category[];
  navigate: (route: string) => void;
  publicSettings?: PublicSettingsPayload | null;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categorySlug,
  articles,
  categories,
  navigate,
  publicSettings,
}) => {
  const [sortBy, setSortBy] = useState<'latest' | 'views' | 'likes'>('latest');

  const currentCategory = categories.find(
    (c) => c.slug.toLowerCase() === categorySlug.toLowerCase()
  ) || {
    id: categorySlug,
    name: categorySlug.replace(/-/g, ' ').toUpperCase(),
    slug: categorySlug,
    description: `All the latest news, updates, and feature articles in ${categorySlug.replace(/-/g, ' ')}.`,
    color: 'from-amber-500 to-rose-600',
  };

  let list = articles.filter((a) => a.category.toLowerCase() === categorySlug.toLowerCase());

  if (sortBy === 'latest') {
    list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  } else if (sortBy === 'views') {
    list.sort((a, b) => b.views - a.views);
  } else if (sortBy === 'likes') {
    list.sort((a, b) => b.likes - a.likes);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Category Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-8 lg:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 via-rose-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950">
            <span>Category Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
            {currentCategory.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
            {currentCategory.description}
          </p>
          <p className="text-xs text-amber-400 font-bold pt-1">
            {list.length} {list.length === 1 ? 'Article' : 'Articles'} Published
          </p>
        </div>
      </div>

      {/* Header Ad Placement */}
      <MonetagAdSlot
        placement={publicSettings?.monetag?.ads?.header}
        slotName="Category Header Ad"
      />

      {/* Filter and Sort Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 text-xs">
        <span className="text-slate-400 font-bold uppercase tracking-wider">
          Stories in {currentCategory.name}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 hidden sm:inline flex items-center gap-1 font-semibold">
            <ArrowUpDown className="w-3.5 h-3.5" /> Sort by:
          </span>
          {(['latest', 'views', 'likes'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setSortBy(mode)}
              className={`px-3 py-1.5 rounded-lg font-bold capitalize transition ${
                sortBy === mode
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {list.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
          <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">No Articles Yet</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Stay tuned! Our editorial team is currently preparing exclusive scoops for {currentCategory.name}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((item) => (
            <article
              key={item.id}
              onClick={() => navigate(`/article/${item.slug}`)}
              className="group rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-amber-500/40 overflow-hidden cursor-pointer transition flex flex-col shadow-lg"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={item.featuredImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950/80 text-amber-400 backdrop-blur-sm border border-slate-800">
                  {item.categoryName}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition line-clamp-2 leading-snug mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.subtitle || item.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800/50">
                  <span className="font-semibold text-slate-300">{item.authorName}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      {item.views}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
