import React, { useState } from 'react';
import {
  Search,
  CheckCircle,
  FileCode,
  Tag,
  Save,
  AlertCircle,
  ExternalLink,
  HelpCircle,
  ArrowRight,
  Globe,
} from 'lucide-react';
import { GoogleVerificationSettings } from '../../../types';
import { api } from '../../../services/api';

interface GoogleVerificationTabProps {
  initialSettings: GoogleVerificationSettings;
  onRefresh: () => void;
}

export const GoogleVerificationTab: React.FC<GoogleVerificationTabProps> = ({
  initialSettings,
  onRefresh,
}) => {
  const [settings, setSettings] = useState<GoogleVerificationSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await api.updateGoogleSettings(settings);
      setSuccess(true);
      onRefresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save Google Search Console settings');
    } finally {
      setSaving(false);
    }
  };

  const currentOrigin = window.location.origin;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-black text-white uppercase tracking-tight">
          Google Search Console Verification
        </h2>
        <p className="text-xs text-slate-400">
          Verify your ALLVIBEZ11 domain ownership with Google to index articles, monitor search keywords, and view organic impressions.
        </p>
      </div>

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Google Search Console verification settings updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP-BY-STEP INSTRUCTIONS GUIDE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-400" />
          Step-by-Step Instructions: How to Verify Ownership in Google Search Console
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-[11px]">
              1
            </span>
            <p className="font-bold text-white">Open Search Console</p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Sign in to{' '}
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline inline-flex items-center gap-0.5"
              >
                Google Search Console <ExternalLink className="w-3 h-3" />
              </a>{' '}
              with your Google account and enter your website URL as a <strong>URL Prefix property</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-[11px]">
              2
            </span>
            <p className="font-bold text-white">Select Verification Method</p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Google will offer two primary web methods: <strong>HTML Meta Tag</strong> or <strong>HTML Verification File</strong>. Choose either method and paste your credentials below.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-[11px]">
              3
            </span>
            <p className="font-bold text-white">Click Verify on Google</p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              After saving your settings here, return to Google Search Console and click the <strong>Verify</strong> button. Verification will be confirmed immediately!
            </p>
          </div>
        </div>
      </div>

      {/* CONFIGURATION FORM */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-xs shadow-xl">
        <div>
          <label className="block font-bold text-slate-300 mb-2">Select Google Verification Method</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setSettings({ ...settings, verificationMethod: 'none' })}
              className={`p-3 rounded-xl border text-left font-semibold transition ${
                settings.verificationMethod === 'none'
                  ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <p className="font-bold">Not Configured Yet</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Configure when ready</p>
            </button>

            <button
              type="button"
              onClick={() => setSettings({ ...settings, verificationMethod: 'meta_tag' })}
              className={`p-3 rounded-xl border text-left font-semibold transition ${
                settings.verificationMethod === 'meta_tag'
                  ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <p className="font-bold flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-400" /> HTML Meta Tag Method
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">Recommended &amp; fastest</p>
            </button>

            <button
              type="button"
              onClick={() => setSettings({ ...settings, verificationMethod: 'html_file' })}
              className={`p-3 rounded-xl border text-left font-semibold transition ${
                settings.verificationMethod === 'html_file'
                  ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <p className="font-bold flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-blue-400" /> HTML Verification File
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">Direct file at root URL</p>
            </button>
          </div>
        </div>

        {/* METHOD 1: META TAG */}
        {settings.verificationMethod === 'meta_tag' && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <label className="block font-bold text-slate-300">
              Google Verification Meta Tag or Code
            </label>
            <input
              type="text"
              value={settings.verificationMetaTag}
              onChange={(e) => setSettings({ ...settings, verificationMetaTag: e.target.value })}
              placeholder='e.g. <meta name="google-site-verification" content="XYZ_YOUR_CODE_HERE" />'
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-blue-500"
            />
            <p className="text-[11px] text-slate-500 leading-normal">
              Paste either the entire <code>&lt;meta ...&gt;</code> element provided by Google or just the content token. The website will automatically insert it into the <code>&lt;head&gt;</code> of all public pages.
            </p>
          </div>
        )}

        {/* METHOD 2: HTML FILE AT ROOT */}
        {settings.verificationMethod === 'html_file' && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Google Verification Filename
                </label>
                <input
                  type="text"
                  value={settings.verificationFileName}
                  onChange={(e) => setSettings({ ...settings, verificationFileName: e.target.value })}
                  placeholder="e.g. google1234567890abcdef.html"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  File Contents (usually: google-site-verification: ...)
                </label>
                <input
                  type="text"
                  value={settings.verificationFileContent}
                  onChange={(e) => setSettings({ ...settings, verificationFileContent: e.target.value })}
                  placeholder="google-site-verification: google1234567890abcdef.html"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {settings.verificationFileName && (
              <div className="pt-2 flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-300 font-mono">
                  {currentOrigin}/{settings.verificationFileName}
                </span>
                <a
                  href={`/${settings.verificationFileName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Test URL in browser
                </a>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500 hover:from-blue-400 hover:to-amber-400 text-slate-950 font-bold uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Updating Search Console...' : 'Save Google Search Console Verification Settings'}</span>
        </button>
      </form>
    </div>
  );
};
