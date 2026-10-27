import React, { useState } from 'react';
import { Users, UserCheck, Trash2, Shield, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { User, WebsiteSettings } from '../../../types';
import { api } from '../../../services/api';

interface UserManagementTabProps {
  users: User[];
  websiteSettings: WebsiteSettings;
  onRefresh: () => void;
}

export const UserManagementTab: React.FC<UserManagementTabProps> = ({
  users,
  websiteSettings,
  onRefresh,
}) => {
  const [allowRegistration, setAllowRegistration] = useState(
    websiteSettings.allowVisitorRegistration
  );
  const [updatingToggle, setUpdatingToggle] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleToggle = async (val: boolean) => {
    setAllowRegistration(val);
    setUpdatingToggle(true);
    try {
      await api.updateWebsiteSettings({ allowVisitorRegistration: val });
      setSuccess(true);
      onRefresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setAllowRegistration(!val);
    } finally {
      setUpdatingToggle(false);
    }
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (!window.confirm(`Remove user "${email}"?`)) return;
    try {
      await api.deleteUser(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to remove user');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-black text-white uppercase tracking-tight">
          User &amp; Visitor Account Management
        </h2>
        <p className="text-xs text-slate-400">
          Control optional visitor registrations and manage administrator credentials.
        </p>
      </div>

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Visitor registration setting updated successfully!</span>
        </div>
      )}

      {/* Optional Visitor Registration Master Toggle */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              Optional Visitor Registration System
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
              When enabled, visitors can optionally sign up to bookmark favorite articles and participate. When disabled, visitors browse and read all stories completely openly without being prompted.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              disabled={updatingToggle}
              checked={allowRegistration}
              onChange={(e) => handleToggle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-12 h-7 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
          </label>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            Current Status:{' '}
            <strong className={allowRegistration ? 'text-emerald-400' : 'text-amber-400'}>
              {allowRegistration
                ? 'Enabled — Visitors can register optional profiles.'
                : 'Disabled — Public reading is open without registration.'}
            </strong>
          </span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-white">
            Registered Accounts ({users.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Created Date</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="font-bold text-white">{u.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        u.role === 'admin'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" /> Active
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleDeleteUser(u.id, u.email)}
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 transition"
                        title="Delete user"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
