'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Folder, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Sparkles, 
  Layers, 
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { MOCK_USER } from '@/lib/mockData';
import { DynamicIcon } from './DynamicIcon';
import { useDashboardContext, singularToPluralType } from '@/context/DashboardContext';
import { getCollectionThemeColor } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  activeFilter: { 
    type: 'all' | 'favorites' | 'type' | 'collection' | 'pinned' | 'collections' | 'items' | 'favorite_collections' | 'favorite_items'; 
    value?: string;
    from?: string;
  };
  setActiveFilter: (filter: { 
    type: 'all' | 'favorites' | 'type' | 'collection' | 'pinned' | 'collections' | 'items' | 'favorite_collections' | 'favorite_items'; 
    value?: string;
    from?: string;
  }) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  proMode: boolean;
  setProMode: (pro: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeFilter,
  setActiveFilter,
  isCollapsed,
  setIsCollapsed,
  proMode,
  setProMode,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const { collections, itemTypes, items } = useDashboardContext();

  // Calculate item counts
  const totalItemsCount = useMemo(() => items.length, [items]);

  const favoriteItemsCount = useMemo(() => {
    return items.filter(item => item.isFavorite).length;
  }, [items]);

  const itemTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    itemTypes.forEach(t => {
      counts[t.name.toLowerCase()] = 0;
    });
    items.forEach(item => {
      if (item.itemType && item.itemType.name) {
        const key = item.itemType.name.toLowerCase();
        counts[key] = (counts[key] || 0) + 1;
      }
    });
    return counts;
  }, [items, itemTypes]);
  
  const [favsCollapsed, setFavsCollapsed] = useState(false);
  const [recentsCollapsed, setRecentsCollapsed] = useState(false);

  const userInitials = MOCK_USER.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleFilterClick = (
    type: 'all' | 'favorites' | 'type' | 'collection' | 'pinned' | 'collections' | 'items' | 'favorite_collections',
    value?: string,
    from?: string
  ) => {
    setActiveFilter({ type, value, from });
    setMobileOpen(false); // Close drawer on mobile click
  };

  // Filter collections for sections
  const favoriteCollections = useMemo(() => {
    return collections.filter(col => col.isFavorite);
  }, [collections]);

  const recentCollections = useMemo(() => {
    // Exclude favorites to avoid duplicates and show the 4 most recently updated collections
    return [...collections]
      .filter(col => !col.isFavorite)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 4);
  }, [collections]);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0f0f12] text-zinc-300 border-r border-zinc-800/80 transition-all duration-300">
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800/60 h-16">
        <div className={`flex items-center gap-3 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
          <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2 rounded-lg text-white shadow-lg shadow-blue-500/10">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-wide bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">DevStash</h1>
            <span className="text-[10px] text-zinc-500 font-mono">v1.0.0-beta</span>
          </div>
        </div>
        {/* Collapse Button (Desktop) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex items-center justify-center p-1.5 rounded-lg hover:bg-zinc-800/60 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="h-4.5 w-4.5" /> : <ChevronLeft className="h-4.5 w-4.5" />}
        </button>
      </div>

      {/* Pro Tier Toggle Badge / Banner */}
      {!isCollapsed && (
        <div className="px-4 py-3 border-b border-zinc-800/30">
          <div 
            onClick={() => setProMode(!proMode)}
            className={`group flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
              proMode 
                ? 'bg-purple-950/20 border-purple-800/60 shadow-inner' 
                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className={`h-4 w-4 ${proMode ? 'text-purple-400 animate-pulse' : 'text-zinc-500 group-hover:text-zinc-400'}`} />
              <div className="text-left">
                <p className="text-xs font-semibold text-zinc-200">DevStash Pro</p>
                <p className="text-[10px] text-zinc-500">{proMode ? 'Enterprise Active' : 'Upgrade for $8/mo'}</p>
              </div>
            </div>
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold tracking-wider ${
              proMode ? 'bg-purple-500/20 text-purple-300' : 'bg-zinc-800 text-zinc-500'
            }`}>
              {proMode ? 'PRO' : 'FREE'}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {/* Main Filters */}
        <div className="space-y-1">
          <Link
            href="/dashboard"
            onClick={() => handleFilterClick('all')}
            className={`group w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFilter.type === 'all'
                ? 'bg-zinc-800/80 text-white font-semibold shadow-sm'
                : 'hover:bg-zinc-900/60 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-4.5 w-4.5 text-zinc-400" />
              {!isCollapsed && <span>Dashboard Home</span>}
            </div>
            {!isCollapsed && (
              <Badge variant="glass" aria-label={`Count: ${totalItemsCount} items`}>
                {totalItemsCount}
              </Badge>
            )}
          </Link>
          
          <Link
            href="/dashboard?filter=favorites"
            onClick={() => handleFilterClick('favorites')}
            className={`group w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFilter.type === 'favorites'
                ? 'bg-zinc-800/80 text-white font-semibold shadow-sm'
                : 'hover:bg-zinc-900/60 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Star className="h-4.5 w-4.5 text-yellow-500/80 fill-yellow-500/20" />
              {!isCollapsed && <span>Favorites</span>}
            </div>
            {!isCollapsed && (
              <Badge variant="glass" aria-label={`Count: ${favoriteItemsCount} favorite items`}>
                {favoriteItemsCount}
              </Badge>
            )}
          </Link>
        </div>

        {/* Item Types */}
        <div>
          {!isCollapsed && (
            <h3 className="px-3 text-[10px] font-bold text-zinc-500 tracking-widest uppercase mb-2">Item Types</h3>
          )}
          <div className="space-y-1">
            {itemTypes.map((type) => {
              const isSelected = activeFilter.type === 'type' && activeFilter.value === type.name;
              const count = itemTypeCounts[type.name.toLowerCase()] || 0;
              
              return (
                <Link
                  key={type.id}
                  href={`/items/${singularToPluralType(type.name)}`}
                  onClick={() => handleFilterClick('type', type.name)}
                  style={{ '--type-color': type.color } as React.CSSProperties}
                  className={`group w-full flex items-center justify-between pl-[9px] pr-3 py-1.5 rounded-lg text-sm font-medium transition-all border-l-[3px] ${
                    isSelected
                      ? 'bg-zinc-800/80 border-l-[var(--type-color)] text-white font-semibold'
                      : 'border-l-[color-mix(in_srgb,var(--type-color)_30%,transparent)] hover:border-l-[var(--type-color)] hover:bg-zinc-900/60 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <DynamicIcon 
                      name={type.icon} 
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isSelected 
                          ? 'text-[var(--type-color)]' 
                          : 'text-zinc-500 group-hover:text-[var(--type-color)]'
                      }`} 
                    />
                    {!isCollapsed && <span className="capitalize">{type.name}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    {!isCollapsed && type.proOnly && (
                      <span className="text-[10px] font-bold tracking-wider text-[var(--type-color)] select-none">
                        PRO
                      </span>
                    )}
                    {!isCollapsed && (
                      <Badge variant="glass" aria-label={`Count: ${count} ${type.name} items`}>
                        {count}
                      </Badge>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Favorite Collections */}
        <div>
          {!isCollapsed ? (
            <button 
              onClick={() => setFavsCollapsed(!favsCollapsed)}
              className="w-full flex items-center justify-between px-3 text-[10px] font-bold text-zinc-500 tracking-widest uppercase mb-2 select-none hover:text-zinc-300 transition-colors"
            >
              <span>Favorite Collections</span>
              {favsCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          ) : (
            <div className="px-3 border-b border-zinc-800/20 pb-1 mb-2" />
          )}
          
          {(!isCollapsed && favsCollapsed) ? null : (
            <div className="space-y-1">
              {favoriteCollections.length === 0 ? (
                !isCollapsed && (
                  <p className="px-3 py-1 text-xs text-zinc-600 italic">No favorites yet</p>
                )
              ) : (
                favoriteCollections.map((col) => {
                  const isSelected = activeFilter.type === 'collection' && activeFilter.value === col.id;
                  const typeColor = getCollectionThemeColor(col);
                  
                  return (
                    <Link
                      key={col.id}
                      href={`/dashboard?collection=${col.id}&from=favorite_collections`}
                      onClick={() => handleFilterClick('collection', col.id, 'favorite_collections')}
                      className={`group w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm font-medium transition-all text-left ${
                        isSelected
                          ? 'bg-zinc-800/80 text-white font-semibold'
                          : 'hover:bg-zinc-900/60 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Folder 
                          className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" 
                          style={{ color: typeColor }}
                        />
                        {!isCollapsed && (
                          <span className="truncate flex-1">{col.name}</span>
                        )}
                        {!isCollapsed && (
                          <Star className="h-3 w-3 shrink-0 text-yellow-500/80 fill-yellow-500/30" />
                        )}
                      </div>
                      {!isCollapsed && (
                        <Badge variant="glass" aria-label={`Count: ${col.itemCount} items`}>
                          {col.itemCount}
                        </Badge>
                      )}
                    </Link>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Recent Collections */}
        <div>
          {!isCollapsed ? (
            <button 
              onClick={() => setRecentsCollapsed(!recentsCollapsed)}
              className="w-full flex items-center justify-between px-3 text-[10px] font-bold text-zinc-500 tracking-widest uppercase mb-2 select-none hover:text-zinc-300 transition-colors"
            >
              <span>Recent Collections</span>
              {recentsCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          ) : (
            <div className="px-3 border-b border-zinc-800/20 pb-1 mb-2" />
          )}
          
          {(!isCollapsed && recentsCollapsed) ? null : (
            <div className="space-y-1">
              {recentCollections.length === 0 ? (
                !isCollapsed && (
                  <p className="px-3 py-1 text-xs text-zinc-600 italic">No recent folders</p>
                )
              ) : (
                recentCollections.map((col) => {
                  const isSelected = activeFilter.type === 'collection' && activeFilter.value === col.id;
                  const typeColor = getCollectionThemeColor(col);
                  
                  return (
                    <Link
                      key={col.id}
                      href={`/dashboard?collection=${col.id}&from=collections`}
                      onClick={() => handleFilterClick('collection', col.id, 'collections')}
                      className={`group w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm font-medium transition-all text-left ${
                        isSelected
                          ? 'bg-zinc-800/80 text-white font-semibold'
                          : 'hover:bg-zinc-900/60 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-4 h-4 flex items-center justify-center shrink-0">
                          <span 
                            className="h-2 w-2 rounded-full transition-transform group-hover:scale-110" 
                            style={{ backgroundColor: typeColor }}
                          />
                        </div>
                        {!isCollapsed && (
                          <span className="truncate flex-1">{col.name}</span>
                        )}
                      </div>
                      {!isCollapsed && (
                        <Badge variant="glass" aria-label={`Count: ${col.itemCount} items`}>
                          {col.itemCount}
                        </Badge>
                      )}
                    </Link>
                  );
                })
              )}

              {!isCollapsed && (
                <Link
                  href="/collections"
                  onClick={() => handleFilterClick('collections')}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 mt-2 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40 border border-dashed border-zinc-800/80 hover:border-zinc-700/60 transition-all text-center cursor-pointer"
                >
                  View all collections
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Profile Block */}
      <div className="p-4 border-t border-zinc-800/60 bg-zinc-950/40">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm border border-zinc-700">
              {userInitials}
            </div>
            <div className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0f0f12] ${proMode ? 'bg-purple-500' : 'bg-emerald-500'}`} />
          </div>
          
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-200 truncate">{MOCK_USER.name}</p>
              <p className="text-[10px] text-zinc-500 truncate">{MOCK_USER.email}</p>
            </div>
          )}
          
          {!isCollapsed && (
            <button className="text-zinc-500 hover:text-zinc-300 p-1 hover:bg-zinc-800 rounded-lg transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar container */}
      <aside 
        className={`hidden md:block shrink-0 h-screen transition-all duration-300 sticky top-0 ${
          isCollapsed ? 'w-[72px]' : 'w-[260px]'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar drawer */}
      <aside 
        className={`md:hidden fixed top-0 bottom-0 left-0 z-50 w-[260px] transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
