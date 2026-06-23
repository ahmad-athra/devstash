'use client';

import React from 'react';
import { useDashboardContext } from '@/context/DashboardContext';
import CollectionGrid from '@/components/dashboard/CollectionGrid';
import ItemGrid from '@/components/dashboard/ItemGrid';
import { TrendingUp, X } from 'lucide-react';
import { MOCK_USER } from '@/lib/mockData';

export default function DashboardPage() {
  const {
    activeFilter,
    setActiveFilter,
    searchQuery,
    items,
    collections,
    filteredItems,
    filteredCollections,
    handleToggleCollectionFavorite,
    handleSelectCollectionCard,
    handleOpenItemDetailDrawer,
    handleToggleItemFavorite,
    handleToggleItemPin,
  } = useDashboardContext();

  return (
    <div className="space-y-8">
      {/* Welcome / Dashboard Insights Banner */}
      {activeFilter.type === 'all' && !searchQuery && (
        <div className="relative p-6 rounded-2xl bg-gradient-to-r from-blue-900/10 via-indigo-950/5 to-purple-950/10 border border-indigo-950/30 overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div 
            className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-5 blur-3xl"
            style={{ backgroundColor: '#8b5cf6' }}
          />
          <div className="space-y-1 relative">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs">
              <TrendingUp className="h-4 w-4" />
              <span>Welcome Back, {MOCK_USER.name.split(' ')[0]}!</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Your DevStash hub is active.</h1>
            <p className="text-xs text-zinc-400 max-w-xl">
              Quickly retrieve and save code snippets, prompt variables, Docker configurations, and bookmark URLs.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 relative">
            <div className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-center min-w-[70px]">
              <span className="block text-lg font-bold text-white leading-none">{items.length}</span>
              <span className="text-[10px] text-zinc-500 font-medium mt-1 block">Saved items</span>
            </div>
            <div className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-center min-w-[70px]">
              <span className="block text-lg font-bold text-white leading-none">{collections.length}</span>
              <span className="text-[10px] text-zinc-500 font-medium mt-1 block">Collections</span>
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Title */}
      {activeFilter.type !== 'all' && (
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/40">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-400">Viewing:</span>
            <span className="text-sm font-semibold text-white capitalize bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-lg">
              {activeFilter.type === 'collection' 
                ? collections.find(c => c.id === activeFilter.value)?.name 
                : activeFilter.value || activeFilter.type}
            </span>
            
            {/* Clear filters button */}
            <button 
              onClick={() => setActiveFilter({ type: 'all' })}
              className="text-xs text-zinc-500 hover:text-zinc-300 font-medium flex items-center gap-1 ml-2 px-2.5 py-1 rounded hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all"
            >
              <X className="h-3 w-3" />
              <span>Clear Filter</span>
            </button>
          </div>
        </div>
      )}

      {/* 1. Collections Grid */}
      {filteredCollections.length > 0 && (
        <CollectionGrid 
          collections={filteredCollections}
          activeCollectionId={activeFilter.type === 'collection' ? activeFilter.value : undefined}
          onCollectionSelect={handleSelectCollectionCard}
          onToggleFavorite={handleToggleCollectionFavorite}
        />
      )}

      {/* 2. Items list / Grid */}
      <ItemGrid 
        items={filteredItems}
        onItemSelect={handleOpenItemDetailDrawer}
        onToggleFavorite={handleToggleItemFavorite}
        onTogglePin={handleToggleItemPin}
      />
    </div>
  );
}
