"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

function ResendForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to resend verification link.");
      } else {
        setSuccess("A new verification link has been sent to your email.");
        // Redirect to sign in page after 3 seconds
        setTimeout(() => {
          router.push(`/sign-in?verify=sent&email=${encodeURIComponent(email.toLowerCase().trim())}`);
        }, 3000);
      }
    } catch (err) {
      console.error("Resend error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-zinc-100">Resend Verification</h2>
        <p className="text-xs text-zinc-400">Request a new email verification link</p>
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
              <span>Sending verification link...</span>
            </>
          ) : (
            <span>Send Verification Link</span>
          )}
        </button>
      </form>

      <div className="flex justify-between items-center text-xs border-t border-zinc-800/80 pt-4">
        <Link
          href="/sign-in"
          className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 font-medium"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ResendVerificationPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
        <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
        <p className="text-xs text-zinc-500">Loading form...</p>
      </div>
    }>
      <ResendForm />
    </Suspense>
  );
}
