'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Mail, Lock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Check if the user was redirected here after registering
    if (searchParams.get('registered') === 'true') {
      setSuccess('Account created successfully! Please sign in.');
    } else if (searchParams.get('verify') === 'sent') {
      const emailParam = searchParams.get('email');
      setSuccess(
        `Verification email sent${emailParam ? ` to ${emailParam}` : ''}! Please check your inbox to activate your account.`
      );
    } else if (searchParams.get('verified') === 'true') {
      setSuccess('Email verified successfully! You can now sign in.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Form validations
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });

      if (res?.error) {
        if (res.error === 'email_not_verified' || res.error.includes('email_not_verified') || res.error.includes('EmailNotVerified')) {
          setError('Please verify your email address. A verification link was sent to your email.');
        } else {
          setError('Invalid email or password.');
        }
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setError(null);
    setSuccess(null);
    setGithubLoading(true);

    try {
      await signIn('github', { callbackUrl: '/dashboard' });
    } catch (err) {
      console.error('Github auth error:', err);
      setError('GitHub authentication failed.');
      setGithubLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-zinc-100">Welcome Back</h2>
        <p className="text-xs text-zinc-400">Sign in to access your stashes</p>
      </div>

      {/* Success Notification */}
      {success && (
        <div className="bg-emerald-950/20 border border-emerald-800/50 text-emerald-400 p-3 rounded-lg text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* Error Notification */}
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
              disabled={loading || githubLoading}
              className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-zinc-700/80 text-zinc-200 placeholder-zinc-600 pl-10 pr-4 py-2 rounded-lg text-sm transition-all focus:outline-hidden"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-xs font-semibold text-zinc-400">
            Password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3 h-4 w-4 text-zinc-500" />
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || githubLoading}
              className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-zinc-700/80 text-zinc-200 placeholder-zinc-600 pl-10 pr-4 py-2 rounded-lg text-sm transition-all focus:outline-hidden"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || githubLoading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:text-zinc-400 text-white rounded-lg py-2 text-sm font-semibold transition-all shadow-md shadow-blue-500/10 cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign in</span>
          )}
        </button>
      </form>

      <div className="relative flex items-center justify-center my-4 select-none">
        <div className="absolute inset-x-0 h-px bg-zinc-800/80" />
        <span className="relative px-3 bg-zinc-900 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
          Or continue with
        </span>
      </div>

      <button
        onClick={handleGithubSignIn}
        disabled={loading || githubLoading}
        className="w-full bg-zinc-850 hover:bg-zinc-800 disabled:bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white rounded-lg py-2 text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2.5 animate-in fade-in duration-200"
      >
        {githubLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg className="h-4 w-4 fill-current text-zinc-200 group-hover:text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
        )}
        <span>GitHub OAuth</span>
      </button>

      <p className="text-center text-xs text-zinc-500">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-semibold text-blue-500 hover:text-blue-400 transition-colors"
        >
          Register here
        </Link>
      </p>
    </div>
  );
}
