import React, { useState } from 'react';
import { Mail, Shield, CheckCircle, Send, AlertTriangle, FileText, Globe } from 'lucide-react';
import { PublicSettingsPayload } from '../types';

interface StaticPageProps {
  page: 'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer';
  publicSettings?: PublicSettingsPayload | null;
}

export const StaticPages: React.FC<StaticPageProps> = ({ page, publicSettings }) => {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  const adminEmail = publicSettings?.website?.contactEmail || 'allvibez11@gmail.com';

  if (page === 'about') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
            About ALLVIBEZ11
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            The Digital Heartbeat of African &amp; Global Entertainment
          </h1>
          <p className="text-base text-slate-300 leading-relaxed">
            ALLVIBEZ11 is a premier multimedia news and culture publication dedicated to spotlighting the world's most dynamic creators, musicians, actors, and cinema trends.
          </p>
        </header>

        <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 text-sm leading-relaxed">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h2 className="text-xl font-bold text-white">Our Editorial Mission</h2>
            <p>
              From the bustling film sets of Lagos and Nollywood blockbuster cinema to Hollywood red carpets, London concert halls, and streaming dominance, entertainment today is deeply interconnected. ALLVIBEZ11 bridges global audiences with authentic, fast-paced journalism, celebrity profiles, investigative insights, and cultural commentary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <Globe className="w-6 h-6 text-amber-400 mb-2" />
              <h3 className="font-bold text-white text-base mb-1">Pan-African &amp; Global</h3>
              <p className="text-xs text-slate-400">
                Prioritizing the monumental wave of Afrobeats, Amapiano, Nollywood, and cross-continental cultural powerhouses.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <Shield className="w-6 h-6 text-rose-400 mb-2" />
              <h3 className="font-bold text-white text-base mb-1">Authentic Journalism</h3>
              <p className="text-xs text-slate-400">
                Verified scoops, direct artist quotes, and ethical entertainment reporting free of unverified clickbait.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <CheckCircle className="w-6 h-6 text-emerald-400 mb-2" />
              <h3 className="font-bold text-white text-base mb-1">Fast &amp; Mobile-First</h3>
              <p className="text-xs text-slate-400">
                Engineered for lightning-fast reading speeds, instant mobile responsiveness, and zero clutter.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white">Editorial Team &amp; Inquiries</h2>
          <p>
            Our dedicated team of cultural critics, music analysts, and film reviewers operate across Lagos, London, and North America. For news tips, interviews, and press releases, contact our newsroom at{' '}
            <strong className="text-amber-400">{adminEmail}</strong>.
          </p>
        </div>
      </div>
    );
  }

  if (page === 'contact') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <header className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
            Contact &amp; Tip Line
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Get in Touch with ALLVIBEZ11
          </h1>
          <p className="text-sm text-slate-300">
            Have a breaking story, celebrity scoop, music premiere, or advertising proposal? Send us a message below.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">Direct Communication</h3>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Editorial &amp; Business Email</p>
                    <a href={`mailto:${adminEmail}`} className="text-amber-400 hover:underline">
                      {adminEmail}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Website Ownership</p>
                    <p className="text-slate-400">ALLVIBEZ11 Media Network</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/30 to-slate-900 border border-amber-500/30 text-xs space-y-2">
              <p className="font-bold text-amber-300">Advertising &amp; Smart Link Partnerships</p>
              <p className="text-slate-300">
                Interested in high-impact banner placements, sponsored artist features, or smart links on ALLVIBEZ11? Reach out directly via our email.
              </p>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="p-6 lg:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              {contactSubmitted ? (
                <div className="text-center py-12 space-y-3">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white">Message Dispatched!</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Thank you for reaching out to ALLVIBEZ11. Our editorial team reviews incoming messages promptly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Samuel Okafor"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. samuel@example.com"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Exclusive Music Premiere / Tip"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your scoop or inquiry here..."
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold tracking-wide shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (page === 'privacy') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-slate-300 text-sm leading-relaxed">
        <h1 className="text-3xl font-black text-white">Privacy Policy</h1>
        <p className="text-xs text-slate-400">Last updated: October 2026</p>

        <p>
          At <strong>ALLVIBEZ11</strong>, accessible from our official website domains, one of our main priorities is the privacy of our visitors. This Privacy Policy document outlines the types of information collected and recorded by ALLVIBEZ11 and how we use it.
        </p>

        <h2 className="text-lg font-bold text-white pt-4">1. Information We Collect</h2>
        <p>
          Visitors may browse all public articles without registration. If visitor registration is enabled, we collect user email addresses and encrypted passwords. If you contact us directly, we may receive additional information such as your name and message contents.
        </p>

        <h2 className="text-lg font-bold text-white pt-4">2. Cookies and Web Beacons</h2>
        <p>
          Like any modern website, ALLVIBEZ11 uses cookies to store information including visitors preferences, page view frequencies, and the pages on the website that the visitor accessed or visited.
        </p>

        <h2 className="text-lg font-bold text-white pt-4">3. Advertising Partners (Monetag &amp; Third-Party Ad Networks)</h2>
        <p>
          Some advertisers on our site may use cookies and web beacons. Our advertising partners include <strong>Monetag</strong> and certified ad networks. Third-party ad servers or networks use technologies like cookies, JavaScript, or Web Beacons in their respective advertisements and links that appear on ALLVIBEZ11, which are sent directly to users browsers.
        </p>

        <h2 className="text-lg font-bold text-white pt-4">4. Log Files &amp; Search Engine Verification</h2>
        <p>
          ALLVIBEZ11 follows a standard procedure of using log files and search engine verification tokens (including Google Search Console) to verify website ownership and analyze search indexation patterns.
        </p>

        <h2 className="text-lg font-bold text-white pt-4">5. Contact Us</h2>
        <p>
          If you have additional questions or require more information about our Privacy Policy, contact us at{' '}
          <strong className="text-amber-400">{adminEmail}</strong>.
        </p>
      </div>
    );
  }

  if (page === 'terms') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-slate-300 text-sm leading-relaxed">
        <h1 className="text-3xl font-black text-white">Terms &amp; Conditions</h1>
        <p className="text-xs text-slate-400">Effective Date: October 2026</p>

        <p>
          Welcome to <strong>ALLVIBEZ11</strong>. By accessing this website, you agree to comply with and be bound by the following terms and conditions of use.
        </p>

        <h2 className="text-lg font-bold text-white pt-4">1. Intellectual Property &amp; Content Use</h2>
        <p>
          Unless otherwise stated, ALLVIBEZ11 and/or its content creators own the intellectual property rights for all editorial commentary, original reviews, layout designs, and branding published on ALLVIBEZ11.
        </p>

        <h2 className="text-lg font-bold text-white pt-4">2. User Conduct</h2>
        <p>
          Visitors are prohibited from attempting to breach administrative dashboards, injecting malicious scripts, or disrupting the availability of the platform.
        </p>

        <h2 className="text-lg font-bold text-white pt-4">3. External Links &amp; Smart Links</h2>
        <p>
          ALLVIBEZ11 may include links to third-party websites or sponsor smart links. We do not endorse or assume responsibility for external website content or third-party transactions.
        </p>
      </div>
    );
  }

  // Disclaimer
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-slate-300 text-sm leading-relaxed">
      <h1 className="text-3xl font-black text-white">Editorial &amp; Entertainment Disclaimer</h1>
      <p className="text-xs text-slate-400">Last Reviewed: October 2026</p>

      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-200">
          The information contained on ALLVIBEZ11 is for general news, cultural analysis, and entertainment purposes only.
        </p>
      </div>

      <h2 className="text-lg font-bold text-white pt-4">Fair Use &amp; Media Credits</h2>
      <p>
        Images and promotional media featured on ALLVIBEZ11 are utilized under Fair Use guidelines for reporting, commentary, review, and public awareness. All copyright remains the property of the respective recording artists, film production studios, and record labels.
      </p>

      <h2 className="text-lg font-bold text-white pt-4">Advertising Disclosure</h2>
      <p>
        ALLVIBEZ11 displays advertisements and pop-ups served through partner networks (including Monetag). While we curate ad slots, we do not directly endorse third-party sponsored products.
      </p>

      <h2 className="text-lg font-bold text-white pt-4">Takedown Requests</h2>
      <p>
        If you are a copyright owner or legal representative and believe any material on ALLVIBEZ11 infringes your intellectual property, contact us immediately at{' '}
        <strong className="text-amber-400">{adminEmail}</strong> with substantiating details for rapid resolution.
      </p>
    </div>
  );
};
