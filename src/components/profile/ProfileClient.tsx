'use client';

import React, { useState } from 'react';
import { useDashboardContext } from '@/context/DashboardContext';
import { Lock, Trash2, Loader2, ShieldAlert } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ProfileClientProps {
  hasPasswordLogin: boolean;
  userEmail: string;
}

export default function ProfileClient({ hasPasswordLogin, userEmail }: ProfileClientProps) {
  const { showConfirm } = useDashboardContext();
  const router = useRouter();
  
  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    setIsChangingPassword(true);
    setPasswordMsg(null);

    try {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'Failed to change password');
      }

      setPasswordMsg({ type: 'success', text: 'Password successfully updated.' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      setPasswordMsg({ type: 'error', text: error.message });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    showConfirm({
      title: 'Delete Account',
      message: 'This will permanently delete your account, all collections, and all stashed items. This action is irreversible.',
      confirmText: 'Permanently Delete',
      isDestructive: true,
      verificationText: 'DELETE',
      onConfirm: async () => {
        try {
          const res = await fetch('/api/user/delete', { method: 'DELETE' });
          if (!res.ok) {
            throw new Error('Failed to delete account');
          }
          await signOut({ callbackUrl: '/sign-in' });
        } catch (error) {
          console.error('Error deleting account:', error);
          alert('Failed to delete account. Please try again later.');
        }
      }
    });
  };


  return (
    <div className="space-y-8">
      {hasPasswordLogin && (
        <section className="bg-[#0e0e11] border border-zinc-800/80 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-zinc-900 rounded-xl text-zinc-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 tracking-tight">Change Password</h2>
              <p className="text-sm text-zinc-400">Update your account password.</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            
            {passwordMsg && (
              <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${passwordMsg.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                {passwordMsg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isChangingPassword || !currentPassword || !newPassword}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/10 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Update Password
            </button>
          </form>
        </section>
      )}

      <section className="bg-red-950/20 border border-red-900/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-red-500/10 rounded-xl text-red-500">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-red-500 tracking-tight">Danger Zone</h2>
            <p className="text-sm text-red-400/80">Irreversible account actions.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-black/40 rounded-xl border border-red-900/20">
          <div>
            <h4 className="text-sm font-bold text-zinc-200">Delete Account</h4>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm">
              Permanently delete your account, items, collections, and remove access to DevStash.
            </p>
          </div>
          <button
            onClick={handleDeleteAccount}
            type="button"
            className="px-5 py-2.5 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 hover:border-transparent rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>
      </section>
    </div>
  );
}
