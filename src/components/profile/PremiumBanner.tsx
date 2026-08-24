'use client';

import React from 'react';
import { Crown, Check } from 'lucide-react';

interface PremiumBannerProps {
  isPro?: boolean;
}

export default function PremiumBanner({ isPro = false }: PremiumBannerProps) {
  if (isPro) {
    return (
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl text-amber-500">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-500 tracking-tight">Pro Plan Active</h3>
            <p className="text-sm text-zinc-400">You are enjoying all premium features.</p>
          </div>
        </div>
        <button 
          type="button" 
          className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
        >
          Manage Billing
        </button>
      </div>
    );
  }

  const benefits = [
    "Unlimited items & collections",
    "File & Image uploads",
    "AI features (tagging, explain, optimize)",
    "Export data (JSON/ZIP)",
    "Custom types",
    "Priority support"
  ];

  return (
    <div className="relative overflow-hidden bg-[#0e0e11] border border-amber-500/20 rounded-2xl p-6 md:p-8">
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl text-zinc-950 shadow-lg shadow-amber-500/20">
              <Crown className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-zinc-100 tracking-tight">Upgrade to Premium</h3>
          </div>
          
          <p className="text-sm text-zinc-400 max-w-md">
            Unlock the full potential of DevStash and supercharge your developer workflow.
          </p>
          
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {benefits.map((benefit, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full md:w-auto shrink-0 flex flex-col items-center gap-3">
          <button 
            type="button" 
            className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 rounded-xl text-sm font-bold shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Upgrade Now
          </button>
          <span className="text-xs text-zinc-500 font-medium">Cancel anytime</span>
        </div>
      </div>
    </div>
  );
}
