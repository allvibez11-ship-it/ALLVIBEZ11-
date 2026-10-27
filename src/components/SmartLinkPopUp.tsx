import React, { useState, useEffect } from 'react';
import { X, Sparkles, ExternalLink } from 'lucide-react';
import { PopUpSettings } from '../types';

interface SmartLinkPopUpProps {
  settings?: PopUpSettings;
  isHomepage?: boolean;
  isPreview?: boolean; // When rendered inside admin settings preview
}

const STORAGE_SESSION_KEY = 'allvibez11_smartlink_seen_session';
const STORAGE_24H_KEY = 'allvibez11_smartlink_seen_timestamp';

export const SmartLinkPopUp: React.FC<SmartLinkPopUpProps> = ({
  settings,
  isHomepage = true,
  isPreview = false,
}) => {
  const [isVisible, setIsVisible] = useState(isPreview);

  useEffect(() => {
    if (isPreview) {
      setIsVisible(true);
      return;
    }

    if (!settings || !settings.enabled || !settings.smartLinkUrl || !settings.smartLinkUrl.trim()) {
      setIsVisible(false);
      return;
    }

    // Check scope: homepage only vs all pages
    if (settings.scope === 'homepage_only' && !isHomepage) {
      setIsVisible(false);
      return;
    }

    // Check frequency rule
    if (settings.frequency === 'once_per_session') {
      const seen = sessionStorage.getItem(STORAGE_SESSION_KEY);
      if (seen) return;
    } else if (settings.frequency === 'every_24h') {
      const lastSeen = localStorage.getItem(STORAGE_24H_KEY);
      if (lastSeen) {
        const diff = Date.now() - parseInt(lastSeen, 10);
        if (diff < 24 * 60 * 60 * 1000) return; // Less than 24 hours
      }
    }

    // Parse delay
    let delayMs = 3000;
    if (settings.triggerTiming === 'immediate') delayMs = 300;
    else if (settings.triggerTiming === 'delay_3s') delayMs = 3000;
    else if (settings.triggerTiming === 'delay_5s') delayMs = 5000;
    else if (settings.triggerTiming === 'delay_10s') delayMs = 10000;

    const timer = setTimeout(() => {
      setIsVisible(true);
      // Mark as seen
      if (settings.frequency === 'once_per_session') {
        sessionStorage.setItem(STORAGE_SESSION_KEY, 'true');
      } else if (settings.frequency === 'every_24h') {
        localStorage.setItem(STORAGE_24H_KEY, Date.now().toString());
      }
    }, delayMs);

    return () => clearTimeout(timer);
  }, [settings, isHomepage, isPreview]);

  if (!isVisible) return null;

  const handleAction = () => {
    if (isPreview) return;
    if (settings?.smartLinkUrl) {
      window.open(settings.smartLinkUrl, '_blank', 'noopener,noreferrer');
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <div
      className={
        isPreview
          ? 'relative w-full max-w-md mx-auto my-4'
          : 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300'
      }
    >
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-6 shadow-2xl shadow-amber-500/10 text-white overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Dismiss Button */}
        {settings?.dismissible !== false && (
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Badge & Icon */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-slate-950 font-bold shadow-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs uppercase tracking-wider font-extrabold text-amber-400">
            Exclusive Recommendation
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-black tracking-tight text-white mb-2 pr-6">
          {settings?.title || '🔥 Exclusive Entertainment Alert!'}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          {settings?.description ||
            'Explore trending entertainment exclusives, verified artist releases, and insider media.'}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleAction}
            className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:from-amber-400 hover:via-rose-400 hover:to-pink-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition transform active:scale-95"
          >
            <span>{settings?.buttonLabel || 'Explore Now'}</span>
            <ExternalLink className="w-4 h-4" />
          </button>
          {settings?.dismissible !== false && (
            <button
              onClick={handleDismiss}
              className="py-3 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition"
            >
              Maybe later
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
