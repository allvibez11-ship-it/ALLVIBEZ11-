import React, { useState, useEffect } from 'react';
import { Article, Category } from '../types';
import { Search, Eye, Filter } from 'lucide-react';

interface SearchPageProps {
  initialQuery?: string;
  articles: Article[];
  categories: Category[];
  navigate: (route: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  initialQuery = '',
  articles,
  categories,
  navigate,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const q = query.toLowerCase().trim();
  const results = articles.filter((art) => {
    if (selectedCategory !== 'all' && art.category !== selectedCategory) {
      return false;
    }
    if (!q) return true;
    return (
      art.title.toLowerCase().includes(q) ||
      art.excerpt.toLowerCase().includes(q) ||
      art.tags.some((t) => t.toLowerCase().includes(q)) ||
      art.authorName.toLowerCase().includes(q) ||
      art.categoryName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Search Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-10 shadow-xl space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-2">
            Search ALLVIBEZ11
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Find artists, blockbusters, Nollywood scoops, Hollywood interviews, and trending pop culture.
          </p>
        </div>

        {/* Input Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type keyword, artist name, movie title, or topic..."
            className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-2xl text-white text-sm focus:outline-none transition shadow-inner"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-amber-400" /> Filter:
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.slug)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition shrink-0 ${
                selectedCategory === c.slug
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-2">
        <span>
          Found {results.length} {results.length === 1 ? 'result' : 'results'} {q ? `for "${query}"` : ''}
        </span>
      </div>

      {/* Grid */}
      {results.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 border border-slate-800 rounded-3xl p-8">
          <h3 className="text-base font-bold text-white mb-2">No Matches Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Try adjusting your search query, checking spelling, or browsing our primary categories.
          </p>
          <button
            onClick={() => {
              setQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold hover:bg-amber-400"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((item) => (
            <article
              key={item.id}
              onClick={() => navigate(`/article/${item.slug}`)}
              className="group rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-amber-500/40 overflow-hidden cursor-pointer transition flex flex-col shadow-lg"
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={item.featuredImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950/80 text-amber-400 backdrop-blur-sm border border-slate-800">
                  {item.categoryName}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {item.subtitle || item.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/40">
                  <span>{item.authorName}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-slate-400" />
                    {item.views}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
