import React, { useState, useEffect } from 'react';
import { Article, PublicSettingsPayload } from '../types';
import { api } from '../services/api';
import {
  Clock,
  Eye,
  Heart,
  Share2,
  Calendar,
  User,
  Tag,
  ChevronRight,
  ArrowLeft,
  Check,
  Flame,
  Layers,
} from 'lucide-react';
import { MonetagAdSlot } from '../components/MonetagAdSlot';
import { SEOMetaManager } from '../components/SEOMetaManager';

interface ArticleDetailPageProps {
  slug: string;
  navigate: (route: string) => void;
  publicSettings?: PublicSettingsPayload | null;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  slug,
  navigate,
  publicSettings,
}) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    api
      .getArticle(slug)
      .then((res) => {
        if (!mounted) return;
        setArticle(res.article);
        setRelated(res.related);
        setLikesCount(res.article.likes || 0);
        setLoading(false);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Article not found');
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [slug]);

  const handleLike = async () => {
    if (!article || liked) return;
    try {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
      await api.likeArticle(article.id);
    } catch {}
  };

  const handleShare = (platform: 'twitter' | 'facebook' | 'whatsapp' | 'copy') => {
    const pageUrl = window.location.href;
    const shareTitle = article?.title || 'Check out this story on ALLVIBEZ11';

    if (platform === 'twitter') {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(pageUrl)}`,
        '_blank'
      );
    } else if (platform === 'facebook') {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
        '_blank'
      );
    } else if (platform === 'whatsapp') {
      window.open(
        `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + pageUrl)}`,
        '_blank'
      );
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-medium text-sm">Fetching article details...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black text-white mb-3">Story Not Found</h2>
        <p className="text-slate-400 mb-6 text-sm">
          The article you are looking for may have been moved, updated, or does not exist.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm inline-flex items-center gap-2 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Homepage
        </button>
      </div>
    );
  }

  // Calculate estimated reading time
  const words = (article.content || '').replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(words / 200));

  // Split content in half to inject "Inside Article" Monetag ad placement!
  const paragraphs = article.content.split('</p>');
  const midPoint = Math.floor(paragraphs.length / 2);
  const firstHalfHtml = paragraphs.slice(0, midPoint).join('</p>') + (midPoint > 0 ? '</p>' : '');
  const secondHalfHtml = paragraphs.slice(midPoint).join('</p>');

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <SEOMetaManager article={article} publicSettings={publicSettings} />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <button onClick={() => navigate('/')} className="hover:text-amber-400 transition">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <button
          onClick={() => navigate(`/category/${article.category}`)}
          className="hover:text-amber-400 transition uppercase font-bold"
        >
          {article.categoryName}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-slate-300 truncate max-w-xs">{article.title}</span>
      </nav>

      {/* Article Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigate(`/category/${article.category}`)}
            className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950"
          >
            {article.categoryName}
          </button>
          {article.breaking && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white flex items-center gap-1 animate-pulse">
              <Flame className="w-3 h-3" /> BREAKING
            </span>
          )}
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> {readTime} min read
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
          {article.title}
        </h1>

        {article.subtitle && (
          <p className="text-lg sm:text-xl text-slate-300 font-medium leading-relaxed">
            {article.subtitle}
          </p>
        )}

        {/* Author & Metrics Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-y border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-slate-950 font-black">
              {article.authorName.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-white text-sm">{article.authorName}</p>
              <p className="text-[11px] text-slate-400">
                Published on {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Eye className="w-4 h-4 text-slate-400" />
              {article.views.toLocaleString()} views
            </span>
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition ${
                liked
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-rose-500/40 hover:text-rose-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{likesCount}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-full max-h-[500px] object-cover object-center"
        />
        {article.imageCaption && (
          <p className="p-3 text-xs text-slate-400 text-center italic bg-slate-950/80 border-t border-slate-800/80">
            {article.imageCaption}
          </p>
        )}
      </div>

      {/* Social Share Strip */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-amber-400" /> Share Story:
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleShare('whatsapp')}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
          >
            WhatsApp
          </button>
          <button
            onClick={() => handleShare('twitter')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
          >
            X / Twitter
          </button>
          <button
            onClick={() => handleShare('facebook')}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
          >
            Facebook
          </button>
          <button
            onClick={() => handleShare('copy')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold flex items-center gap-1 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : null}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>

      {/* Article Body Content */}
      <div className="prose prose-invert prose-lg max-w-none text-slate-200 leading-relaxed font-sans space-y-6">
        {/* First Half */}
        <div
          dangerouslySetInnerHTML={{ __html: firstHalfHtml }}
          className="space-y-4 text-slate-200 leading-relaxed [&>h2]:text-2xl [&>h2]:font-black [&>h2]:text-white [&>h2]:mt-8 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-amber-300 [&>blockquote]:border-l-4 [&>blockquote]:border-amber-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-amber-200 [&>ul]:list-disc [&>ul]:pl-6"
        />

        {/* Inside Article Monetag Ad Placement */}
        <MonetagAdSlot
          placement={publicSettings?.monetag?.ads?.insideArticle}
          slotName="Inside Article Ad"
        />

        {/* Second Half */}
        <div
          dangerouslySetInnerHTML={{ __html: secondHalfHtml }}
          className="space-y-4 text-slate-200 leading-relaxed [&>h2]:text-2xl [&>h2]:font-black [&>h2]:text-white [&>h2]:mt-8 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-amber-300 [&>blockquote]:border-l-4 [&>blockquote]:border-amber-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-amber-200 [&>ul]:list-disc [&>ul]:pl-6"
        />
      </div>

      {/* After Article Monetag Ad Placement */}
      <MonetagAdSlot
        placement={publicSettings?.monetag?.ads?.afterArticle}
        slotName="After Article Ad"
      />

      {/* Article Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="pt-6 border-t border-slate-800 flex items-center flex-wrap gap-2">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-2">
            <Tag className="w-3.5 h-3.5 text-amber-400" /> Tags:
          </span>
          {article.tags.map((t) => (
            <button
              key={t}
              onClick={() => navigate(`/search?q=${encodeURIComponent(t)}`)}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 transition"
            >
              #{t}
            </button>
          ))}
        </div>
      )}

      {/* Related Articles Section */}
      {related.length > 0 && (
        <section className="pt-10 border-t border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              Related Stories in {article.categoryName}
            </h3>
            <button
              onClick={() => navigate(`/category/${article.category}`)}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              View More <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/article/${item.slug}`)}
                className="group cursor-pointer rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 overflow-hidden transition flex flex-col"
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={item.featuredImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition line-clamp-2">
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                    <span>{item.authorName}</span>
                    <span>{new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
