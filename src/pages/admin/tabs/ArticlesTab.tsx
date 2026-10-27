import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Check,
  Calendar,
  Clock,
  Sparkles,
  ExternalLink,
  Flame,
  X,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { Article, Category, MediaItem } from '../../../types';
import { api } from '../../../services/api';

interface ArticlesTabProps {
  articles: Article[];
  categories: Category[];
  media: MediaItem[];
  onRefresh: () => void;
  openEditorWithArticle?: Article | null;
  onClearEditArticle?: () => void;
}

export const ArticlesTab: React.FC<ArticlesTabProps> = ({
  articles,
  categories,
  media,
  onRefresh,
  openEditorWithArticle,
  onClearEditArticle,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(Boolean(openEditorWithArticle));
  const [editingArticle, setEditingArticle] = useState<Article | null>(openEditorWithArticle || null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState(categories[0]?.slug || 'music');
  const [featuredImage, setFeaturedImage] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [tags, setTags] = useState('');
  const [authorName, setAuthorName] = useState('Editorial Desk');
  const [status, setStatus] = useState<'published' | 'draft' | 'scheduled'>('published');
  const [scheduledFor, setScheduledFor] = useState('');
  const [featured, setFeatured] = useState(false);
  const [breaking, setBreaking] = useState(false);
  const [trending, setTrending] = useState(false);
  const [customSlug, setCustomSlug] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // Preview Modal State
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Submission State
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Open Editor Function
  const openEditor = (article?: Article) => {
    setError(null);
    setSuccess(null);
    if (article) {
      setEditingArticle(article);
      setTitle(article.title);
      setSubtitle(article.subtitle || '');
      setContent(article.content);
      setExcerpt(article.excerpt || '');
      setCategory(article.category);
      setFeaturedImage(article.featuredImage);
      setImageCaption(article.imageCaption || '');
      setTags(article.tags.join(', '));
      setAuthorName(article.authorName);
      setStatus(article.status);
      setScheduledFor(article.scheduledFor || '');
      setFeatured(article.featured);
      setBreaking(article.breaking);
      setTrending(article.trending);
      setCustomSlug(article.slug);
      setSeoTitle(article.seoTitle || '');
      setMetaDescription(article.metaDescription || '');
    } else {
      setEditingArticle(null);
      setTitle('');
      setSubtitle('');
      setContent(
        '<p class="lead">Write your captivating opening paragraph here...</p>\n<h2>Story Background</h2>\n<p>Add compelling facts, insights, and background details.</p>\n<blockquote>"Include a remarkable quote from the artist or filmmaker."</blockquote>'
      );
      setExcerpt('');
      setCategory(categories[0]?.slug || 'music');
      setFeaturedImage('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80');
      setImageCaption('');
      setTags('Entertainment, Music, Exclusive');
      setAuthorName('Editorial Desk');
      setStatus('published');
      setScheduledFor('');
      setFeatured(false);
      setBreaking(false);
      setTrending(false);
      setCustomSlug('');
      setSeoTitle('');
      setMetaDescription('');
    }
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingArticle(null);
    if (onClearEditArticle) onClearEditArticle();
  };

  // Save Article Handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and story content are required');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      title,
      subtitle,
      content,
      excerpt: excerpt || title.substring(0, 160),
      category,
      featuredImage,
      imageCaption,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      authorName,
      status,
      scheduledFor: status === 'scheduled' ? scheduledFor : undefined,
      featured,
      breaking,
      trending,
      customSlug: customSlug || undefined,
      seoTitle: seoTitle || `${title} | ALLVIBEZ11`,
      metaDescription: metaDescription || excerpt || title,
    };

    try {
      if (editingArticle) {
        await api.updateArticle(editingArticle.id, payload);
        setSuccess('Article updated successfully!');
      } else {
        await api.createArticle(payload);
        setSuccess('New article published/drafted successfully!');
      }
      onRefresh();
      setTimeout(() => {
        closeEditor();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to save article.');
    } finally {
      setSaving(false);
    }
  };

  // Delete Article Handler
  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }
    try {
      await api.deleteArticle(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete article');
    }
  };

  // Filter Articles
  const filteredArticles = articles.filter((art) => {
    if (statusFilter !== 'all' && art.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && art.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        art.tags.some((t) => t.toLowerCase().includes(q)) ||
        art.authorName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">
            Article Publishing &amp; Management
          </h2>
          <p className="text-xs text-slate-400">
            Publish, schedule, edit, or draft articles across all entertainment channels.
          </p>
        </div>

        <button
          onClick={() => openEditor()}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 self-start sm:self-auto transition"
        >
          <Plus className="w-4 h-4" /> Create Article
        </button>
      </div>

      {/* Filter and Search Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl text-xs">
        <div className="sm:col-span-5 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, tag, or author..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
            <option value="scheduled">Scheduled Only</option>
          </select>
        </div>

        <div className="sm:col-span-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Story</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Metrics</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500 italic">
                    No articles match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 max-w-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={art.featuredImage}
                          alt={art.title}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate text-xs">{art.title}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {art.featured && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-amber-500/20 text-amber-400">
                                Hero
                              </span>
                            )}
                            {art.breaking && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-rose-500/20 text-rose-400">
                                Breaking
                              </span>
                            )}
                            {art.trending && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-pink-500/20 text-pink-400">
                                Trending
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                        {art.categoryName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          art.status === 'published'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : art.status === 'scheduled'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {art.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        {art.views.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                      {art.publishedAt
                        ? new Date(art.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Draft'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`${window.location.hostname.endsWith('github.io') && window.location.pathname.split('/').filter(Boolean)[0] ? '/' + window.location.pathname.split('/').filter(Boolean)[0] : ''}/article/${art.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
                          title="View on site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => openEditor(art)}
                          className="p-1.5 rounded-lg text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 transition"
                          title="Edit article"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(art.id, art.title)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 transition"
                          title="Delete article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL ARTICLE EDITOR MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  {editingArticle ? 'Edit Article' : 'Compose New Entertainment Article'}
                </h3>
                <p className="text-xs text-slate-400">
                  {editingArticle ? `Updating: ${editingArticle.slug}` : 'Publish immediately, save draft, or schedule.'}
                </p>
              </div>
              <button
                onClick={closeEditor}
                className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6 text-xs">
              {/* Title & Subtitle */}
              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Article Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Asake Drops Unannounced Afrobeat Visuals Breaking Global Streaming Records"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Subtitle / Hook</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Short engaging secondary headline..."
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Category, Status, Author */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Publishing Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 font-bold"
                  >
                    <option value="published">Publish Immediately</option>
                    <option value="draft">Save as Draft</option>
                    <option value="scheduled">Schedule for Future</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Author Name</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Editorial Desk"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Schedule Date (if scheduled) */}
              {status === 'scheduled' && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <label className="block font-bold text-blue-300 mb-1">Publication Date &amp; Time</label>
                  <input
                    type="datetime-local"
                    value={scheduledFor}
                    onChange={(e) => setScheduledFor(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {/* Featured Image & Caption */}
              <div className="space-y-3">
                <label className="block font-bold text-slate-300">Featured Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                  {media.length > 0 && (
                    <select
                      onChange={(e) => e.target.value && setFeaturedImage(e.target.value)}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                    >
                      <option value="">Pick from Media Library</option>
                      {media.map((m) => (
                        <option key={m.id} value={m.url}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {featuredImage && (
                  <div className="h-32 w-full max-w-sm rounded-xl overflow-hidden border border-slate-800">
                    <img src={featuredImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-400 mb-1">Image Caption &amp; Credit</label>
                  <input
                    type="text"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    placeholder="Photo credits, concert location, or red carpet event..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Body Content Editor */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-300">
                    Article Body Content (HTML &amp; Rich Formatting) <span className="text-rose-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsPreviewModalOpen(true)}
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Full Article Preview
                  </button>
                </div>
                <textarea
                  required
                  rows={12}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="<p>Article body content...</p>"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              {/* Tags & Excerpt */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Burna Boy, Nollywood, Grammys, Afrobeats"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Short Excerpt (for feeds &amp; social)</label>
                  <input
                    type="text"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief 1-2 sentence teaser summary"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Placement Badges */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span className="font-bold text-slate-200">Featured in Hero Grid</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={breaking}
                    onChange={(e) => setBreaking(e.target.checked)}
                    className="rounded text-rose-500 focus:ring-rose-500"
                  />
                  <span className="font-bold text-slate-200">Breaking News Ticker</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={trending}
                    onChange={(e) => setTrending(e.target.checked)}
                    className="rounded text-pink-500 focus:ring-pink-500"
                  />
                  <span className="font-bold text-slate-200">Trending Countdown Radar</span>
                </label>
              </div>

              {/* SEO Title, Slug, & SERP Preview */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                  SEO &amp; URL Slug Optimization
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-400 mb-1">Custom URL Slug</label>
                    <input
                      type="text"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value)}
                      placeholder="e.g. burna-boy-stadium-tour"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-400 mb-1">SEO Title Tag</label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder={`${title || 'Story Title'} | ALLVIBEZ11`}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Meta Description</label>
                  <textarea
                    rows={2}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Short meta description shown on Google search snippet (120-160 chars)"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Google SERP Snippet Preview */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80">
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-1">
                    Google Search Preview:
                  </p>
                  <div className="text-xs space-y-0.5">
                    <p className="text-[11px] text-emerald-400 font-mono">
                      https://allvibez11.com/article/{customSlug || 'article-url-slug'}
                    </p>
                    <p className="text-sm font-bold text-blue-400 truncate hover:underline cursor-pointer">
                      {seoTitle || title || 'Story Title on ALLVIBEZ11'}
                    </p>
                    <p className="text-xs text-slate-300 line-clamp-2">
                      {metaDescription || excerpt || 'Read full breaking coverage and entertainment analysis on ALLVIBEZ11.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={closeEditor}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold uppercase tracking-wider shadow-lg transition disabled:opacity-50"
                >
                  {saving ? 'Publishing Story...' : editingArticle ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ARTICLE LIVE PREVIEW MODAL */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl max-h-[90vh] overflow-y-auto my-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                Live Article Preview
              </span>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950">
                {category}
              </span>
              <h1 className="text-3xl font-black text-white">{title || 'Untitled Article'}</h1>
              {subtitle && <p className="text-lg text-slate-300 font-medium">{subtitle}</p>}

              {featuredImage && (
                <div className="rounded-2xl overflow-hidden border border-slate-800">
                  <img src={featuredImage} alt="Preview" className="w-full max-h-80 object-cover" />
                </div>
              )}

              <div
                dangerouslySetInnerHTML={{ __html: content }}
                className="prose prose-invert max-w-none text-slate-200 leading-relaxed text-sm pt-4 border-t border-slate-800"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
