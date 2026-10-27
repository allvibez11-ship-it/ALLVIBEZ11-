import React from 'react';
import {
  FileText,
  Eye,
  CheckCircle,
  Clock,
  Flame,
  Plus,
  Image,
  DollarSign,
  Search,
  ExternalLink,
  Users,
} from 'lucide-react';
import { Article, ActivityLog } from '../../../types';

interface OverviewTabProps {
  stats: {
    totalArticles: number;
    published: number;
    drafts: number;
    scheduled: number;
    totalViews: number;
    totalLikes: number;
    visitorCount: number;
    mediaCount: number;
    usersCount: number;
    recentActivity: ActivityLog[];
  } | null;
  articles: Article[];
  setActiveTab: (tab: string) => void;
  navigate: (route: string) => void;
  onNewArticle: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  stats,
  articles,
  setActiveTab,
  navigate,
  onNewArticle,
}) => {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-slate-900 border border-amber-500/20">
        <div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
            Control Center
          </span>
          <h2 className="text-2xl font-black text-white mt-2">
            ALLVIBEZ11 Editorial &amp; Monetization Hub
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Publish articles, monitor readership metrics, manage Monetag Smart Links, and control search engine verification.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNewArticle}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" /> New Article
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition"
          >
            <ExternalLink className="w-4 h-4" /> View Site
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Published Stories</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-white">{stats?.published ?? 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">{stats?.drafts ?? 0} drafts in progress</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Story Reads</span>
            <Eye className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-white">{(stats?.totalViews ?? 0).toLocaleString()}</p>
          <p className="text-[11px] text-emerald-400 mt-1">Active global readership</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Media Assets</span>
            <Image className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-3xl font-black text-white">{stats?.mediaCount ?? 0}</p>
          <button
            onClick={() => setActiveTab('media')}
            className="text-[11px] text-amber-400 hover:underline mt-1 block"
          >
            Open Media Library →
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Audience Sessions</span>
            <Users className="w-4 h-4 text-pink-400" />
          </div>
          <p className="text-3xl font-black text-white">{(stats?.visitorCount ?? 0).toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 mt-1">Estimated total hits</p>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTab('popup')}
          className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-left transition space-y-2 group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition">
            Monetag Smart Link Pop-Up
          </h4>
          <p className="text-xs text-slate-400">
            Configure URL, delay timing, display frequency, and preview the pop-up box.
          </p>
        </button>

        <button
          onClick={() => setActiveTab('monetag')}
          className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/40 text-left transition space-y-2 group"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
            <Flame className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-rose-400 transition">
            Monetag Ads &amp; Verification
          </h4>
          <p className="text-xs text-slate-400">
            Set up Monetag ownership verification and manage 6 targeted ad placements.
          </p>
        </button>

        <button
          onClick={() => setActiveTab('google')}
          className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 text-left transition space-y-2 group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
            <Search className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition">
            Google Search Console
          </h4>
          <p className="text-xs text-slate-400">
            Verify ownership using meta tag or HTML file at the website root.
          </p>
        </button>
      </div>

      {/* Two Column Section: Recent Articles & Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Articles Table (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Recent Articles
            </h3>
            <button
              onClick={() => setActiveTab('articles')}
              className="text-xs font-bold text-amber-400 hover:underline"
            >
              Manage All Articles →
            </button>
          </div>

          <div className="space-y-3">
            {articles.slice(0, 5).map((art) => (
              <div
                key={art.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3 min-w-0 pr-3">
                  <img
                    src={art.featuredImage}
                    alt={art.title}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-white truncate">{art.title}</h5>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                      <span className="text-amber-400 font-semibold">{art.categoryName}</span>
                      <span>•</span>
                      <span>{art.views} reads</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                    art.status === 'published'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : art.status === 'scheduled'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {art.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Activity Audit Log (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
            Administrative Activity Log
          </h3>

          <div className="space-y-3 max-h-80 overflow-y-auto no-scrollbar text-xs">
            {stats?.recentActivity?.length ? (
              stats.recentActivity.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400">{log.action}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-normal">{log.details}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No recent logged events.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
