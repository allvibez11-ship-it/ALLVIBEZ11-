import React, { useState } from 'react';
import {
  Sparkles,
  Link2,
  Clock,
  Repeat,
  Layers,
  Save,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { PopUpSettings } from '../../../types';
import { api } from '../../../services/api';
import { SmartLinkPopUp } from '../../../components/SmartLinkPopUp';

interface PopUpSettingsTabProps {
  initialSettings: PopUpSettings;
  onRefresh: () => void;
}

export const PopUpSettingsTab: React.FC<PopUpSettingsTabProps> = ({
  initialSettings,
  onRefresh,
}) => {
  const [settings, setSettings] = useState<PopUpSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await api.updatePopUpSettings(settings);
      setSuccess(true);
      onRefresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save pop-up settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-black text-white uppercase tracking-tight">
          Pop-up &amp; Smart Link Settings
        </h2>
        <p className="text-xs text-slate-400">
          Configure and preview your Monetag Smart Link promotion pop-up without touching code.
        </p>
      </div>

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Pop-up and Smart Link settings saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Form (7 cols) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-xs shadow-xl">
            {/* Master Switch */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <h4 className="font-bold text-white text-sm">Enable Smart Link Pop-Up</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Turn the promotional modal on or off across your website.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
              </label>
            </div>

            {/* Smart Link URL */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Monetag Smart Link URL
              </label>
              <div className="relative">
                <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  type="url"
                  value={settings.smartLinkUrl}
                  onChange={(e) => setSettings({ ...settings, smartLinkUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Paste the full Smart Link provided by your Monetag publisher dashboard.
              </p>
            </div>

            {/* Title & Description */}
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Pop-up Headline</label>
                <input
                  type="text"
                  value={settings.title}
                  onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                  placeholder="🔥 Exclusive Entertainment Alert!"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Pop-up Description</label>
                <textarea
                  rows={3}
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  placeholder="Engaging summary for the offer..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Button Call-To-Action Label</label>
                <input
                  type="text"
                  value={settings.buttonLabel}
                  onChange={(e) => setSettings({ ...settings, buttonLabel: e.target.value })}
                  placeholder="e.g. Explore Trending Now"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>
            </div>

            {/* Trigger Timing & Frequency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Appearance Delay
                </label>
                <select
                  value={settings.triggerTiming}
                  onChange={(e) => setSettings({ ...settings, triggerTiming: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="immediate">Immediate (0.3s)</option>
                  <option value="delay_3s">3 Seconds Delay</option>
                  <option value="delay_5s">5 Seconds Delay</option>
                  <option value="delay_10s">10 Seconds Delay</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Repeat className="w-3.5 h-3.5 text-rose-400" />
                  Display Frequency
                </label>
                <select
                  value={settings.frequency}
                  onChange={(e) => setSettings({ ...settings, frequency: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="once_per_session">Once per browser session</option>
                  <option value="every_24h">Once every 24 hours</option>
                  <option value="every_page">Every page visit</option>
                </select>
              </div>
            </div>

            {/* Scope & Dismissible */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-pink-400" />
                  Display Scope
                </label>
                <select
                  value={settings.scope}
                  onChange={(e) => setSettings({ ...settings, scope: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="all_pages">All Public Pages</option>
                  <option value="homepage_only">Homepage Only</option>
                </select>
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.dismissible}
                    onChange={(e) => setSettings({ ...settings, dismissible: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span className="font-bold text-slate-200">Allow visitor to dismiss modal (X)</span>
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving Settings...' : 'Save Smart Link Pop-Up Settings'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Box (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Eye className="w-4 h-4" /> Live Pop-Up Preview
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Mobile &amp; Desktop</span>
            </div>

            <p className="text-xs text-slate-400">
              This interactive box displays how your Smart Link pop-up will appear to your visitors:
            </p>

            {/* Render Component in Preview Mode */}
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80">
              <SmartLinkPopUp settings={settings} isPreview={true} />
            </div>

            {settings.smartLinkUrl && (
              <div className="pt-2 text-center">
                <a
                  href={settings.smartLinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:underline font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Test Smart Link destination in new tab
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
