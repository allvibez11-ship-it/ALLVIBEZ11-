import React, { useState } from 'react';
import { Globe, Mail, Save, CheckCircle, AlertCircle, Share2, Layers } from 'lucide-react';
import { WebsiteSettings } from '../../../types';
import { api } from '../../../services/api';

interface WebsiteSettingsTabProps {
  initialSettings: WebsiteSettings;
  onRefresh: () => void;
}

export const WebsiteSettingsTab: React.FC<WebsiteSettingsTabProps> = ({
  initialSettings,
  onRefresh,
}) => {
  const [settings, setSettings] = useState<WebsiteSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await api.updateWebsiteSettings(settings);
      setSuccess(true);
      onRefresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save website settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-black text-white uppercase tracking-tight">
          Website Settings
        </h2>
        <p className="text-xs text-slate-400">
          Manage general website branding, administrative email, social channels, and public metadata.
        </p>
      </div>

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Website settings saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-xs shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Website Name</label>
            <input
              type="text"
              required
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Tagline</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Editorial Contact Email</label>
            <input
              type="email"
              required
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Administrator Email</label>
            <input
              type="email"
              disabled
              value={settings.adminEmail}
              className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-400 font-mono"
            />
          </div>
        </div>

        {/* Footer About Text */}
        <div>
          <label className="block font-bold text-slate-300 mb-1">Footer About Description</label>
          <textarea
            rows={3}
            value={settings.footerAbout}
            onChange={(e) => setSettings({ ...settings, footerAbout: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 leading-relaxed"
          />
        </div>

        {/* Social Channels */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <Share2 className="w-4 h-4 text-amber-400" /> Official Social Media Links
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-400 mb-1">X / Twitter URL</label>
              <input
                type="url"
                value={settings.socialLinks?.twitter || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, twitter: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-400 mb-1">Instagram URL</label>
              <input
                type="url"
                value={settings.socialLinks?.instagram || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, instagram: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-400 mb-1">YouTube Channel URL</label>
              <input
                type="url"
                value={settings.socialLinks?.youtube || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, youtube: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-400 mb-1">Facebook Page URL</label>
              <input
                type="url"
                value={settings.socialLinks?.facebook || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, facebook: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Updating Website Settings...' : 'Save General Website Settings'}</span>
        </button>
      </form>
    </div>
  );
};
