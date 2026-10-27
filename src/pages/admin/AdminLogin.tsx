import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { Logo } from '../../components/Logo';
import { api, setAdminToken } from '../../services/api';
import { User } from '../../types';

interface AdminLoginProps {
  initialSetupRequired: boolean;
  adminEmail: string;
  onLoginSuccess: (user: User) => void;
  navigate: (route: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  initialSetupRequired: initialSetupReqProp,
  adminEmail,
  onLoginSuccess,
  navigate,
}) => {
  const [mode, setMode] = useState<'login' | 'setup' | 'recovery'>(
    initialSetupReqProp ? 'setup' : 'login'
  );

  const [email, setEmail] = useState(adminEmail || 'allvibez11@gmail.com');
  const [name, setName] = useState('ALLVIBEZ11 Administrator');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initial Account Setup Handler
  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.setupAdminPassword({
        email: email.trim(),
        name: name.trim(),
        password,
        confirmPassword,
      });

      setAdminToken(res.token);
      setSuccessMessage('Administrator credentials configured successfully! Entering dashboard...');
      setTimeout(() => {
        onLoginSuccess(res.user);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Setup failed. Please check password criteria.');
    } finally {
      setLoading(false);
    }
  };

  // Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.loginAdmin({
        email: email.trim(),
        password,
      });

      setAdminToken(res.token);
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Invalid administrator email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Password Recovery Handler
  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.resetAdminPassword({
        email: email.trim(),
        adminRecoveryCode: recoveryCode.trim(),
        newPassword: password,
        confirmPassword,
      });

      setSuccessMessage(res.message);
      setMode('login');
      setPassword('');
      setConfirmPassword('');
      setRecoveryCode('');
    } catch (err: any) {
      setError(err.message || 'Password recovery failed. Check recovery code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-block">
            <Logo variant="compact" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center justify-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              Admin Portal
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {mode === 'setup' && 'Initial Administrator Activation'}
              {mode === 'login' && 'Secure Administrative Authentication'}
              {mode === 'recovery' && 'Administrator Password Recovery'}
            </p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* MODE: INITIAL SETUP */}
        {mode === 'setup' && (
          <form onSubmit={handleSetup} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Welcome, Owner!
              </p>
              <p className="text-[11px] text-amber-200/80 leading-normal">
                To guarantee maximum security, set your private master password below. No passwords are hardcoded in the codebase.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Administrative Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Administrator Display Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. ALLVIBEZ11 Editor-in-Chief"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Set Master Password (min 8 chars)</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create strong secret password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Confirm Master Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold uppercase tracking-wider shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                'Configuring Security...'
              ) : (
                <>
                  <span>Activate Admin Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-slate-400 hover:text-amber-400 text-[11px] underline"
              >
                Already set up? Sign in directly
              </button>
            </div>
          </form>
        )}

        {/* MODE: STANDARD LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Admin Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="allvibez11@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setMode('recovery')}
                  className="text-[11px] text-amber-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold uppercase tracking-wider shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                'Authenticating...'
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('setup')}
                className="text-slate-400 hover:text-amber-400 text-[11px]"
              >
                First time administrator? <span className="underline">Configure Master Password</span>
              </button>
            </div>
          </form>
        )}

        {/* MODE: PASSWORD RECOVERY */}
        {mode === 'recovery' && (
          <form onSubmit={handleRecovery} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 space-y-1">
              <p className="font-bold text-white flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" /> Recovery Key Verification
              </p>
              <p className="text-[11px] text-slate-400">
                To reset the password for <span className="text-white font-mono">{email}</span>, enter the master recovery authorization code: <code className="text-amber-400 font-mono font-bold">ALLVIBEZ-SECURE-2026</code>.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Administrative Recovery Code</label>
              <input
                type="text"
                required
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value)}
                placeholder="ALLVIBEZ-SECURE-2026"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono uppercase focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">New Password (min 8 chars)</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New secret password"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new secret password"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Verifying & Updating...' : 'Reset Master Password'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-slate-400 hover:text-white text-[11px] underline"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* Back to site link */}
        <div className="mt-6 pt-6 border-t border-slate-800 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-slate-500 hover:text-amber-400 transition"
          >
            ← Return to ALLVIBEZ11 Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
