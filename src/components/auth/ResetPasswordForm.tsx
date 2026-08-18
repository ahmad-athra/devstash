'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError('Invalid or missing token.');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to reset password.');
      } else {
        // We can optionally set a success state, but navigating away is better.
        router.push('/sign-in?reset=success');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="space-y-6 text-center">
        <div className="bg-red-950/20 border border-red-800/50 text-red-400 p-4 rounded-lg text-sm flex flex-col items-center gap-3">
          <AlertCircle className="h-6 w-6" />
          <span>Invalid or missing reset token.</span>
        </div>
        <Link
          href="/forgot-password"
          className="inline-block px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Request new link
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-zinc-100">Create New Password</h2>
        <p className="text-xs text-zinc-400">Enter a new secure password for your account</p>
      </div>

      {success && (
        <div className="bg-emerald-950/20 border border-emerald-800/50 text-emerald-400 p-3 rounded-lg text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-950/20 border border-red-800/50 text-red-400 p-3 rounded-lg text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="newPassword" className="text-xs font-semibold text-zinc-400">
            New password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3 h-4 w-4 text-zinc-500" />
            <input
              id="newPassword"
              type="password"
              placeholder="Min 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading || !!success}
              className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-zinc-700/80 text-zinc-200 placeholder-zinc-600 pl-10 pr-4 py-2 rounded-lg text-sm transition-all focus:outline-hidden"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="text-xs font-semibold text-zinc-400">
            Confirm new password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3 h-4 w-4 text-zinc-500" />
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading || !!success}
              className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-zinc-700/80 text-zinc-200 placeholder-zinc-600 pl-10 pr-4 py-2 rounded-lg text-sm transition-all focus:outline-hidden"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !!success}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:text-zinc-400 text-white rounded-lg py-2 text-sm font-semibold transition-all shadow-md shadow-blue-500/10 cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Updating...</span>
            </>
          ) : (
            <span>Update password</span>
          )}
        </button>
      </form>

      {success && (
        <div className="text-center pt-2">
          <Link
            href="/sign-in"
            className="inline-block w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Go to sign in
          </Link>
        </div>
      )}
    </div>
  );
}
