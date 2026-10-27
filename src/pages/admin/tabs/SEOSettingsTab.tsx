import React, { useState } from 'react';
import { Search, Save, CheckCircle, AlertCircle, ExternalLink, Globe, FileCode } from 'lucide-react';
import { SEOSettings } from '../../../types';
import { api } from '../../../services/api';

interface SEOSettingsTabProps {
  initialSettings: SEOSettings;
  onRefresh: () => void;
}

export const SEOSettingsTab: React.FC<SEOSettingsTabProps> = ({
  initialSettings,
  onRefresh,
}) => {
  const [settings, setSettings] = useState<SEOSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await api.updateSEOSettings(settings);
      setSuccess(true);
      onRefresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update SEO settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-black text-white uppercase tracking-tight">
          Search Engine Optimization (SEO)
        </h2>
        <p className="text-xs text-slate-400">
          Configure default metadata, open graph cards, XML sitemaps, and indexing directives.
        </p>
      </div>

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>SEO configuration updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Sitemaps & Robots Quick Access */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <FileCode className="w-4 h-4 text-amber-400" /> XML Sitemap
            </h4>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-lg flex items-center gap-1 transition"
            >
              <span>View Live /sitemap.xml</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-xs text-slate-400">
            Automatically lists all published articles, category pages, and static URLs.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" /> Robots.txt Directives
            </h4>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-bold rounded-lg flex items-center gap-1 transition"
            >
              <span>View Live /robots.txt</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-xs text-slate-400">
            Instructs search engines to crawl public stories while protecting admin routes.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-xs shadow-xl">
        <div>
          <label className="block font-bold text-slate-300 mb-1">
            Default Site Meta Title
          </label>
          <input
            type="text"
            required
            value={settings.defaultMetaTitle}
            onChange={(e) => setSettings({ ...settings, defaultMetaTitle: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-300 mb-1">
            Default Site Meta Description
          </label>
          <textarea
            rows={3}
            required
            value={settings.defaultMetaDescription}
            onChange={(e) => setSettings({ ...settings, defaultMetaDescription: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 leading-relaxed"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-300 mb-1">
            Default Keywords (comma-separated)
          </label>
          <input
            type="text"
            value={settings.keywords}
            onChange={(e) => setSettings({ ...settings, keywords: e.target.value })}
            placeholder="ALLVIBEZ11, Nollywood, Afrobeats, Celebrity News, Hollywood..."
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Canonical Domain</label>
            <input
              type="url"
              value={settings.canonicalDomain}
              onChange={(e) => setSettings({ ...settings, canonicalDomain: e.target.value })}
              placeholder="https://allvibez11.com"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Twitter / X Handle</label>
            <input
              type="text"
              value={settings.twitterHandle}
              onChange={(e) => setSettings({ ...settings, twitterHandle: e.target.value })}
              placeholder="@AllVibez11"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Updating SEO...' : 'Save SEO Configuration'}</span>
        </button>
      </form>
    </div>
  );
};
