'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form validations
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed.');
      } else {
        router.push('/sign-in?registered=true');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-zinc-100">Create Account</h2>
        <p className="text-xs text-zinc-400">Get started with your free DevStash account</p>
      </div>

      {/* Error Notification */}
      {error && (
        <div className="bg-red-950/20 border border-red-800/50 text-red-400 p-3 rounded-lg text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-xs font-semibold text-zinc-400">
            Full name
          </label>
          <div className="relative flex items-center">
            <User className="absolute left-3 h-4 w-4 text-zinc-500" />
            <input
              id="name"
              type="text"
              placeholder="Brad Traversy"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-zinc-700/80 text-zinc-200 placeholder-zinc-600 pl-10 pr-4 py-2 rounded-lg text-sm transition-all focus:outline-hidden"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-semibold text-zinc-400">
            Email address
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3 h-4 w-4 text-zinc-500" />
            <input
              id="email"
              type="email"
              placeholder="brad@devstash.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
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
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-zinc-700/80 text-zinc-200 placeholder-zinc-600 pl-10 pr-4 py-2 rounded-lg text-sm transition-all focus:outline-hidden"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="text-xs font-semibold text-zinc-400">
            Confirm password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3 h-4 w-4 text-zinc-500" />
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-zinc-700/80 text-zinc-200 placeholder-zinc-600 pl-10 pr-4 py-2 rounded-lg text-sm transition-all focus:outline-hidden"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:text-zinc-400 text-white rounded-lg py-2 text-sm font-semibold transition-all shadow-md shadow-blue-500/10 cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Registering account...</span>
            </>
          ) : (
            <span>Register</span>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-zinc-500">
        Already have an account?{' '}
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
