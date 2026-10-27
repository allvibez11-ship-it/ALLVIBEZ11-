import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'monogram';
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = 'h-10', variant = 'full', light = false }) => {
  if (variant === 'monogram') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className} aspect-square`}>
        <svg viewBox="0 0 64 64" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="avGradMono" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="bgGradMono" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>
          <rect width="64" height="64" rx="16" fill="url(#bgGradMono)" stroke="#334155" strokeWidth="2" />
          <rect x="10" y="26" width="3.5" height="12" rx="1.75" fill="#F59E0B" opacity="0.9" />
          <rect x="16" y="20" width="3.5" height="24" rx="1.75" fill="#EF4444" />
          <rect x="22" y="14" width="3.5" height="36" rx="1.75" fill="url(#avGradMono)" />
          <path d="M 29 18 L 37 46 L 43 46 L 51 18 L 45 18 L 40 37 L 35 18 Z" fill="#FFFFFF" />
          <rect x="52" y="20" width="3.5" height="24" rx="1.75" fill="url(#avGradMono)" />
          <rect x="57" y="20" width="3.5" height="24" rx="1.75" fill="url(#avGradMono)" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Dynamic Emblem */}
      <div className="relative w-10 h-10 shrink-0">
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="avGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="bgGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>
          <rect width="64" height="64" rx="16" fill="url(#bgGradMain)" stroke="#334155" strokeWidth="2" />
          <rect x="10" y="26" width="3.5" height="12" rx="1.75" fill="#F59E0B" />
          <rect x="16" y="18" width="3.5" height="28" rx="1.75" fill="#EF4444" />
          <rect x="22" y="12" width="3.5" height="40" rx="1.75" fill="url(#avGradMain)" />
          <path d="M 29 18 L 37 46 L 43 46 L 51 18 L 45 18 L 40 37 L 35 18 Z" fill="#FFFFFF" />
          <rect x="52" y="20" width="3.5" height="24" rx="1.75" fill="url(#avGradMain)" />
          <rect x="57" y="20" width="3.5" height="24" rx="1.75" fill="url(#avGradMain)" />
        </svg>
      </div>

      {/* Typographic Identity */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center tracking-tight font-black text-2xl lg:text-3xl">
          <span className={light ? 'text-slate-900' : 'text-white'}>ALL</span>
          <span className="bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 bg-clip-text text-transparent px-0.5">
            VIBEZ
          </span>
          <span className="text-amber-400 font-extrabold ml-0.5 drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]">
            11
          </span>
        </div>
        {variant === 'full' && (
          <span className="text-[8.5px] uppercase tracking-[0.25em] font-bold text-slate-400 mt-1">
            Global &amp; African Entertainment
          </span>
        )}
      </div>
    </div>
  );
};
