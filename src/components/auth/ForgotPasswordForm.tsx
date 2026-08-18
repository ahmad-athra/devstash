'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to request password reset.');
      } else {
        setSuccess(data.message || 'If an account with that email exists, we\'ve sent a password reset link.');
        setEmail('');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-zinc-100">Reset Password</h2>
        <p className="text-xs text-zinc-400">Enter your email to request a reset link</p>
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
          <label htmlFor="email" className="text-xs font-semibold text-zinc-400">
            Email address
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3 h-4 w-4 text-zinc-500" />
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              <span>Sending...</span>
            </>
          ) : (
            <span>Send reset link</span>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-zinc-500">
        Remember your password?{' '}
        <Link
          href="/sign-in"
          className="font-semibold text-blue-500 hover:text-blue-400 transition-colors"
        >
          Sign in here
        </Link>
      </p>
    </div>
  );
}
