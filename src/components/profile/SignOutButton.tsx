'use client';

import React from 'react';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/sign-in' });
  };

  return (
    <button
      onClick={handleSignOut}
      type="button"
      className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shrink-0"
    >
      <LogOut className="w-4 h-4" />
      Sign Out
    </button>
  );
}
