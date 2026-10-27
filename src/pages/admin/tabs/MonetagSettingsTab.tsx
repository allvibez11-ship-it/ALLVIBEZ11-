import React, { useState } from 'react';
import {
  DollarSign,
  ShieldCheck,
  FileCode,
  Tag,
  Save,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Code,
  Info,
} from 'lucide-react';
import { MonetagSettings } from '../../../types';
import { api } from '../../../services/api';

interface MonetagSettingsTabProps {
  initialSettings: MonetagSettings;
  onRefresh: () => void;
}

export const MonetagSettingsTab: React.FC<MonetagSettingsTabProps> = ({
  initialSettings,
  onRefresh,
}) => {
  const [settings, setSettings] = useState<MonetagSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await api.updateMonetagSettings(settings);
      setSuccess(true);
      onRefresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save Monetag settings');
    } finally {
      setSaving(false);
    }
  };

  const adPlacements = [
    { key: 'header', label: '1. Header Advertisement Banner', desc: 'Appears directly below the main navigation bar on all pages.' },
    { key: 'homepage', label: '2. Homepage Billboard', desc: 'Prominent high-impact placement directly under the featured hero story.' },
    { key: 'sidebar', label: '3. Desktop Sidebar Advertisement', desc: 'Sticky placement in the right-hand sidebar on desktop viewports.' },
    { key: 'insideArticle', label: '4. Inside Article (Mid-Content)', desc: 'Seamlessly inserted between paragraphs inside article text.' },
    { key: 'afterArticle', label: '5. After Article Advertisement', desc: 'Rendered directly below the full article text before related stories.' },
    { key: 'footer', label: '6. Footer / Sticky Advertisement', desc: 'Appears above the site footer across all public pages.' },
  ] as const;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-black text-white uppercase tracking-tight">
          Monetag Ads &amp; Website Verification
        </h2>
        <p className="text-xs text-slate-400">
          Configure official Monetag domain ownership verification and manage 6 targeted ad placements without modifying source code.
        </p>
      </div>

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Monetag verification and advertisement settings updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 text-xs">
        {/* SECTION A: MONETAG WEBSITE VERIFICATION */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Part A: Monetag Website Ownership Verification
              </h3>
              <p className="text-[11px] text-slate-400">
                Choose the verification method required by Monetag to confirm your website domain.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-bold text-slate-300 mb-2">Verification Method</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, verificationMethod: 'none' })}
                  className={`p-3 rounded-xl border text-left font-semibold transition ${
                    settings.verificationMethod === 'none'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <p className="font-bold">Not Configured Yet</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Skip or complete later</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, verificationMethod: 'html_file' })}
                  className={`p-3 rounded-xl border text-left font-semibold transition ${
                    settings.verificationMethod === 'html_file'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <p className="font-bold flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-amber-400" /> HTML Verification File
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Served at root URL (/:file)</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, verificationMethod: 'meta_tag' })}
                  className={`p-3 rounded-xl border text-left font-semibold transition ${
                    settings.verificationMethod === 'meta_tag'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <p className="font-bold flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-400" /> Verification Meta Tag
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Injected into page header</p>
                </button>
              </div>
            </div>

            {/* Method 1: HTML File at Website Root */}
            {settings.verificationMethod === 'html_file' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-start gap-2 text-slate-300 text-[11px]">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p>
                    When Monetag provides an HTML verification file (e.g. <code>monetag_verification.html</code>), enter the exact filename and contents below. The backend route automatically serves it directly at your website root.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      Verification Filename (e.g. monetag_xxx.html)
                    </label>
                    <input
                      type="text"
                      value={settings.verificationFileName}
                      onChange={(e) => setSettings({ ...settings, verificationFileName: e.target.value })}
                      placeholder="e.g. monetag_verification.html"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      File Verification Content (optional/token)
                    </label>
                    <input
                      type="text"
                      value={settings.verificationFileContent}
                      onChange={(e) => setSettings({ ...settings, verificationFileContent: e.target.value })}
                      placeholder="e.g. monetag-site-verification: 12345678"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {settings.verificationFileName && (
                  <div className="text-[11px] text-emerald-400 pt-1 flex items-center gap-1.5 font-mono">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Serving file at: {window.location.origin}/{settings.verificationFileName}</span>
                  </div>
                )}
              </div>
            )}

            {/* Method 2: Meta Tag */}
            {settings.verificationMethod === 'meta_tag' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="block font-bold text-slate-300">
                  Monetag Verification Meta Tag or Code
                </label>
                <input
                  type="text"
                  value={settings.verificationMetaTag}
                  onChange={(e) => setSettings({ ...settings, verificationMetaTag: e.target.value })}
                  placeholder='e.g. <meta name="monetag" content="YOUR_VERIFICATION_STRING" />'
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                />
                <p className="text-[11px] text-slate-500">
                  Leave empty if you haven't received your code yet. Once pasted, it will be injected into all public pages.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* SECTION B: MONETAG AD PLACEMENTS (6 PLACEMENTS) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Part B: Monetag Advertisement Placements (6 Locations)
              </h3>
              <p className="text-[11px] text-slate-400">
                Enable or disable each ad position and paste your Monetag script. When disabled or empty, no empty boxes will appear.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {adPlacements.map(({ key, label, desc }) => {
              const placement = settings.ads[key as keyof typeof settings.ads];
              return (
                <div
                  key={key}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{label}</h4>
                      <p className="text-slate-400 text-[11px] mt-0.5">{desc}</p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={placement.enabled}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            ads: {
                              ...settings.ads,
                              [key]: { ...placement, enabled: e.target.checked },
                            },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
                    </label>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-slate-500" />
                      Ad Script / Tag Code (provided by Monetag)
                    </label>
                    <textarea
                      rows={3}
                      value={placement.code}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          ads: {
                            ...settings.ads,
                            [key]: { ...placement, code: e.target.value },
                          },
                        })
                      }
                      placeholder="<!-- Paste Monetag ad code here (e.g. <script src='...'></script>) -->"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold uppercase tracking-wider shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Updating Monetag Settings...' : 'Save Monetag Ads & Verification Settings'}</span>
        </button>
      </form>
    </div>
  );
};
