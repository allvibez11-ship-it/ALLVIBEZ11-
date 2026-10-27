import React, { useState } from 'react';
import {
  Shield,
  KeyRound,
  Lock,
  CheckCircle,
  AlertCircle,
  Save,
  LogOut,
  Clock,
  Key,
} from 'lucide-react';
import { ActivityLog } from '../../../types';
import { api } from '../../../services/api';

interface SecuritySettingsTabProps {
  logs: ActivityLog[];
  onLogout: () => void;
  adminEmail: string;
}

export const SecuritySettingsTab: React.FC<SecuritySettingsTabProps> = ({
  logs,
  onLogout,
  adminEmail,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await api.changeAdminPassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setSuccess(res.message || 'Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-black text-white uppercase tracking-tight">
          Security &amp; Administrative Credentials
        </h2>
        <p className="text-xs text-slate-400">
          Manage your master password, review active security protocols, and inspect recent system events.
        </p>
      </div>

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Password Change Form (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <form
            onSubmit={handlePasswordChange}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 text-xs shadow-xl"
          >
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <Lock className="w-4 h-4 text-amber-400" /> Change Master Password
            </h3>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">New Password (min 8 chars)</label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new strong password"
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
                placeholder="Repeat new password"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Updating Password...' : 'Save New Master Password'}</span>
            </button>
          </form>

          {/* Account Recovery Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-xs space-y-3">
            <h4 className="font-bold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-rose-400" /> Account Recovery Information
            </h4>
            <p className="text-slate-400 leading-relaxed">
              If you ever misplace your password, you can reset it via the login screen using the master authorization key below:
            </p>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-amber-400 font-bold select-all">
              ALLVIBEZ-SECURE-2026
            </div>
            <p className="text-[11px] text-slate-500">
              Only accessible to the verified administrative mailbox: <strong>{adminEmail}</strong>.
            </p>
          </div>
        </div>

        {/* Audit Log and Active Session (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" /> Active Security Session
              </h3>
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout Session
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Authenticated Administrator:</span>
                <span className="font-mono text-white font-bold">{adminEmail}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Cryptographic Hashing:</span>
                <span className="text-emerald-400 font-bold">Node.js Scrypt (64-byte key + salt)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Session Token Signing:</span>
                <span className="text-emerald-400 font-bold">HMAC-SHA256 (Server Auth)</span>
              </div>
            </div>
          </div>

          {/* Activity Log stream */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> System Activity Audit Log
            </h3>
            <div className="space-y-2.5 max-h-72 overflow-y-auto no-scrollbar text-xs">
              {logs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-400">{log.action}</span>
                    <span className="text-slate-500 font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
