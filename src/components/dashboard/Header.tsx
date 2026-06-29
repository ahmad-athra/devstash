'use client';

import React from 'react';
import { 
  Plus, 
  Search, 
  Menu, 
  Sparkles, 
  Star, 
  Folder,
  Layers,
  HelpCircle,
  FolderPlus
} from 'lucide-react';
import { useDashboardContext } from '@/context/DashboardContext';

interface HeaderProps {
  activeFilter: { type: 'all' | 'favorites' | 'type' | 'collection' | 'pinned' | 'collections' | 'items' | 'favorite_collections' | 'favorite_items'; value?: string };
  onNewItemClick: () => void;
  onNewCollectionClick: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setMobileOpen: (open: boolean) => void;
  proMode: boolean;
  itemCount: number;
}

export default function Header({
  activeFilter,
  onNewItemClick,
  onNewCollectionClick,
  searchQuery,
  setSearchQuery,
  setMobileOpen,
  proMode,
  itemCount,
}: HeaderProps) {
  const { collections } = useDashboardContext();
  // Compute title and breadcrumbs
  const getFilterBreadcrumb = () => {
    switch (activeFilter.type) {
      case 'all':
        return { parent: 'Dashboard', child: 'All Stashes' };
      case 'favorites':
        return { parent: 'Dashboard', child: 'Favorites' };
      case 'favorite_items':
        return { parent: 'Dashboard', child: 'Favorite Items' };
      case 'pinned':
        return { parent: 'Dashboard', child: 'Pinned Items' };
      case 'collections':
        return { parent: 'Dashboard', child: 'All Collections' };
      case 'favorite_collections':
        return { parent: 'Dashboard', child: 'Favorite Collections' };
      case 'items':
        return { parent: 'Dashboard', child: 'All Items' };
      case 'type':
        return { parent: 'Item Types', child: activeFilter.value || '' };
      case 'collection':
        const col = collections.find(c => c.id === activeFilter.value);
        return { parent: 'Collections', child: col?.name || 'Collection' };
      default:
        return { parent: 'Dashboard', child: 'DevStash' };
    }
  };

  const breadcrumbs = getFilterBreadcrumb();
  const maxItems = proMode ? '∞' : '50';
  const percentage = proMode ? 0 : Math.min(100, (itemCount / 50) * 100);

  return (
    <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-30">
      {/* Mobile Toggle & Title */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-sm select-none">
          <span className="text-zinc-500 font-medium">{breadcrumbs.parent}</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-200 font-semibold capitalize">{breadcrumbs.child}</span>
        </div>
      </div>

      {/* Center Search bar */}
      <div className="hidden lg:flex items-center max-w-md w-full relative mx-4">
        <Search className="absolute left-3.5 h-4 w-4 text-zinc-500" />
        <input 
          type="text" 
          placeholder="Search stashes, tags, content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-zinc-700/80 text-zinc-200 placeholder-zinc-500 pl-10 pr-4 py-1.5 rounded-lg text-sm transition-all focus:outline-hidden"
        />
        <div className="absolute right-3 px-1.5 py-0.5 bg-zinc-800 rounded text-[10px] font-mono text-zinc-500 border border-zinc-700/40 select-none">
          ⌘K
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Search button for medium screens */}
        <div className="lg:hidden relative flex items-center w-40 sm:w-56">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-zinc-700/80 text-zinc-200 placeholder-zinc-500 pl-8 pr-2 py-1 rounded-md text-xs transition-all focus:outline-hidden"
          />
        </div>

        {/* Quota limit tracker */}
        {!proMode && (
          <div className="hidden sm:flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
              <span className="font-semibold text-zinc-200">{itemCount}</span>
              <span>/</span>
              <span>{maxItems} items used</span>
            </div>
            <div className="w-24 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Primary action buttons */}
        <div className="flex items-center gap-2">
          {/* New Collection button */}
          <button 
            onClick={onNewCollectionClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-lg text-xs font-medium transition-all shadow-sm"
          >
            <FolderPlus className="h-3.5 w-3.5 text-zinc-400" />
            <span className="hidden sm:inline">New Collection</span>
          </button>

          {/* New Item button */}
          <button 
            onClick={onNewItemClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>
    </header>
  );
}
