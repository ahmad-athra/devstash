import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { User, Mail, Calendar, LayoutDashboard, Layers, FileText } from 'lucide-react';
import PremiumBanner from '@/components/profile/PremiumBanner';
import ProfileClient from '@/components/profile/ProfileClient';
import SignOutButton from '@/components/profile/SignOutButton';

export const metadata = {
  title: 'Profile | DevStash',
  description: 'Manage your DevStash account settings and view usage statistics.',
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      image: true,
      createdAt: true,
      password: true,
      isPro: true,
    }
  });

  if (!user || !user.email) {
    redirect('/sign-in');
  }

  // Fetch Stats
  const totalItems = await prisma.item.count({ where: { userId } });
  const totalCollections = await prisma.collection.count({ where: { userId } });
  
  // Fetch Limits
  const tier = user.isPro ? "PRO" : "FREE";
  const systemLimit = await prisma.systemTierLimit.findUnique({
    where: { tier }
  });
  const maxItems = systemLimit?.maxItems || -1;
  const maxCollections = systemLimit?.maxCollections || -1;
  
  // Breakdown by type
  const itemsByType = await prisma.item.groupBy({
    by: ['itemTypeId'],
    _count: {
      _all: true
    },
    where: { userId }
  });

  const itemTypes = await prisma.itemType.findMany();
  
  const typeBreakdown = itemsByType.map(group => {
    const type = itemTypes.find(t => t.id === group.itemTypeId);
    return {
      name: type?.name || 'Unknown',
      count: group._count._all,
      color: type?.color || '#a1a1aa'
    };
  }).sort((a, b) => b.count - a.count);

  const hasPasswordLogin = !!user.password;
  
  // Fallback initials
  const getInitials = () => {
    if (user.name) return user.name.substring(0, 2).toUpperCase();
    if (user.email) return user.email.substring(0, 2).toUpperCase();
    return 'U';
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(user.createdAt));

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 w-full pt-4 md:pt-8 px-4 md:px-0">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Profile Settings</h1>
        <p className="text-sm text-zinc-400 mt-1">Manage your account preferences and view usage.</p>
      </div>

      {/* User Info Card */}
      <section className="bg-[#0e0e11] border border-zinc-800/80 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-1 min-w-0">
            <div className="shrink-0 relative group">
              {user.image ? (
                <img 
                  src={user.image} 
                  alt={user.name || 'User avatar'} 
                  className="w-24 h-24 rounded-2xl object-cover border border-zinc-800 shadow-xl"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                  {getInitials()}
                </div>
              )}
              <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />
            </div>
            
            <div className="space-y-3 flex-1 min-w-0">
              <div>
                <h2 className="text-2xl font-bold text-zinc-100 truncate">{user.name || 'Anonymous Developer'}</h2>
                <div className="flex items-center gap-2 text-sm text-zinc-400 mt-1">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-900/50 inline-flex px-3 py-1.5 rounded-lg border border-zinc-800/50">
                <Calendar className="w-4 h-4" />
                <span>Joined on {formattedDate}</span>
              </div>
            </div>
          </div>
          
          <div className="shrink-0 self-start md:self-center mt-4 md:mt-0">
            <SignOutButton />
          </div>
        </div>
      </section>

      {/* Premium Banner */}
      <PremiumBanner isPro={user.isPro} />

      {/* Usage Stats */}
      <section className="bg-[#0e0e11] border border-zinc-800/80 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-zinc-900 rounded-xl text-zinc-400">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-100 tracking-tight">Usage Statistics</h2>
            <p className="text-sm text-zinc-400">Overview of your stashed knowledge.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-zinc-950 border border-zinc-800/50 rounded-xl p-5 flex flex-col relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3 mb-2">
              <Layers className="w-5 h-5 text-blue-500" />
              <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Collections</span>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold text-zinc-100">{totalCollections}</span>
              <span className="text-sm text-zinc-500 font-medium">/ {maxCollections === -1 ? '∞' : maxCollections}</span>
            </div>
            {maxCollections !== -1 && (
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(100, Math.round((totalCollections / maxCollections) * 100))}%` }}
                />
              </div>
            )}
          </div>

          <div className="bg-zinc-950 border border-zinc-800/50 rounded-xl p-5 flex flex-col relative overflow-hidden group">
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-emerald-500" />
              <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Items</span>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold text-zinc-100">{totalItems}</span>
              <span className="text-sm text-zinc-500 font-medium">/ {maxItems === -1 ? '∞' : maxItems}</span>
            </div>
            {maxItems !== -1 && (
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(100, Math.round((totalItems / maxItems) * 100))}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {typeBreakdown.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-4">Item Breakdown</h3>
            <div className="space-y-3">
              {typeBreakdown.map((tb, idx) => {
                const percentage = totalItems > 0 ? Math.round((tb.count / totalItems) * 100) : 0;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-zinc-300 capitalize">{tb.name}s</span>
                      <span className="text-zinc-500">{tb.count} ({percentage}%)</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%`, backgroundColor: tb.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Account Settings Client Component */}
      <ProfileClient hasPasswordLogin={hasPasswordLogin} userEmail={user.email} />
    </div>
  );
}
