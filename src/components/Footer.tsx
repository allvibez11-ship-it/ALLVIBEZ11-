import React from 'react';
import { Logo } from './Logo';
import { PublicSettingsPayload, Category } from '../types';
import {
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Radio,
  Mail,
  ShieldAlert,
  FileText,
  HelpCircle,
} from 'lucide-react';
import { MonetagAdSlot } from './MonetagAdSlot';

interface FooterProps {
  navigate: (route: string) => void;
  publicSettings?: PublicSettingsPayload | null;
  categories: Category[];
}

export const Footer: React.FC<FooterProps> = ({ navigate, publicSettings, categories }) => {
  const currentYear = new Date().getFullYear();
  const website = publicSettings?.website;

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 mt-16">
      {/* Footer Ad Placement (if enabled) */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <MonetagAdSlot
          placement={publicSettings?.monetag?.ads?.footer}
          slotName="Footer Ad"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <button onClick={() => navigate('/')} className="text-left focus:outline-none">
              <Logo />
            </button>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {website?.footerAbout ||
                'ALLVIBEZ11 is your premier digital hub for authentic celebrity interviews, Nollywood & Hollywood blockbusters, Afrobeat anthems, music rankings, red carpet coverage, and pop culture trends.'}
            </p>
            <div className="flex items-center space-x-3 pt-2">
              {website?.socialLinks?.twitter && (
                <a
                  href={website.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-amber-400 hover:border-amber-500/50 transition"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {website?.socialLinks?.instagram && (
                <a
                  href={website.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-rose-400 hover:border-rose-500/50 transition"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {website?.socialLinks?.facebook && (
                <a
                  href={website.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-blue-400 hover:border-blue-500/50 transition"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {website?.socialLinks?.youtube && (
                <a
                  href={website.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-red-400 hover:border-red-500/50 transition"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Categories Col */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Entertainment
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  onClick={() => navigate('/category/music')}
                  className="hover:text-amber-400 transition"
                >
                  Music &amp; Releases
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/category/musicians')}
                  className="hover:text-amber-400 transition"
                >
                  Musicians &amp; Artists
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/category/movies')}
                  className="hover:text-amber-400 transition"
                >
                  Movie Box Office
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/category/actors')}
                  className="hover:text-amber-400 transition"
                >
                  Actors &amp; Actresses
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/category/nollywood')}
                  className="hover:text-amber-400 transition"
                >
                  Nollywood Cinema
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/category/hollywood')}
                  className="hover:text-amber-400 transition"
                >
                  Hollywood Wire
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Sections Col */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider mb-4 border-l-2 border-rose-500 pl-2">
              Explore
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  onClick={() => navigate('/category/celebrity-news')}
                  className="hover:text-rose-400 transition"
                >
                  Celebrity News
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/trending')}
                  className="hover:text-rose-400 transition"
                >
                  Trending Stories
                </button>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-200 transition"
                >
                  XML Sitemap
                </a>
              </li>
              <li>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-200 transition"
                >
                  Robots.txt
                </a>
              </li>
              <li>
                <button
                  onClick={() => navigate('/admin')}
                  className="text-amber-400 hover:text-amber-300 font-bold transition flex items-center gap-1"
                >
                  <span>Admin Dashboard</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Info Col */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider mb-4 border-l-2 border-pink-500 pl-2">
              Information &amp; Trust
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-white transition">
                  About ALLVIBEZ11
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-white transition">
                  Contact &amp; Tip Line
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/privacy')} className="hover:text-white transition">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/terms')} className="hover:text-white transition">
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/disclaimer')} className="hover:text-white transition">
                  Editorial Disclaimer
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {currentYear} ALLVIBEZ11. All rights reserved. Global &amp; African Entertainment Magazine.</p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-500">
              Administrative Contact: <span className="text-slate-400">allvibez11@gmail.com</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
