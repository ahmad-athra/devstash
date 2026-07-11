'use client';

import React from 'react';
import { Layers } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Visual background accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.08),rgba(255,255,255,0))]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8 z-10 animate-fade-in duration-300">
        <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/10">
          <Layers className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-extrabold text-2xl tracking-wider bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">DevStash</h1>
          <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Developer knowledge cockpit</p>
        </div>
      </div>

      {/* Main card */}
      <div className="w-full max-w-md bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl shadow-black/80 z-10 animate-in fade-in zoom-in-95 duration-300">
        {children}
      </div>
    </div>
  );
}
