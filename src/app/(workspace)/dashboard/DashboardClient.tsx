'use client';

import React, { useMemo } from 'react';
import { useDashboardContext } from '@/context/DashboardContext';
import CollectionGrid from '@/components/dashboard/CollectionGrid';
import ItemGrid from '@/components/dashboard/ItemGrid';
import { 
  TrendingUp, 
  X, 
  Layers, 
  Folder, 
  Star, 
  Heart, 
  Pin, 
  Calendar,
  ArrowRight
} from 'lucide-react';
import { MOCK_USER, MOCK_ITEM_TYPES } from '@/lib/mockData';
import { DynamicIcon } from '@/components/dashboard/DynamicIcon';

interface DashboardItemCardProps {
  item: any;
  type: 'pinned' | 'favorite';
  onSelect: () => void;
  onToggleAction: (e: React.MouseEvent) => void;
}

const DashboardItemCard: React.FC<DashboardItemCardProps> = ({ 
  item, 
  type, 
  onSelect, 
  onToggleAction 
}) => {
  const typeColor = item.itemType.color;

  return (
    <>
      {/* Laptop/Desktop Layout: Grid Card */}
      <div 
        onClick={onSelect}
        style={{ borderLeftColor: typeColor }}
        className="hidden lg:flex group bg-zinc-900/40 border border-zinc-800/80 border-l-[3.5px] rounded-r-xl rounded-l-md p-4 cursor-pointer hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all duration-300 flex-col justify-between min-h-[140px]"
      >
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="p-1 rounded bg-zinc-800 text-[10px] uppercase font-mono tracking-wider font-semibold shrink-0" style={{ color: typeColor }}>
                {item.itemType.name}
              </span>
              <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">
                {item.title}
              </h3>
            </div>
            <span className="text-zinc-500 opacity-40 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={onToggleAction}
                className={`p-0.5 hover:bg-zinc-800 rounded transition-colors cursor-pointer ${type === 'pinned' ? 'text-blue-400' : 'text-amber-400'}`}
              >
                {type === 'pinned' ? (
                  <Pin className="h-3 w-3 fill-blue-500/20" />
                ) : (
                  <Star className="h-3 w-3 fill-amber-500/20" />
                )}
              </button>
            </span>
          </div>
          {item.description && (
            <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-800/10 text-[9px] text-zinc-500 font-mono">
          <span>#{item.tags[0]?.name || 'stash'}</span>
          <span>
            {new Date(item.createdAt).toLocaleDateString(undefined, { 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Mobile/Tablet Layout: Compact list-style card */}
      <div 
        onClick={onSelect}
        className="flex lg:hidden group bg-zinc-900/25 border border-zinc-800/60 rounded-xl p-3.5 items-center justify-between gap-4 cursor-pointer hover:border-zinc-700/60 hover:bg-zinc-900/40 transition-all duration-300"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span 
            className="p-1.5 rounded-lg shrink-0 flex items-center justify-center border border-zinc-800 bg-zinc-900/60"
            style={{ color: typeColor }}
          >
            <DynamicIcon name={item.itemType.icon} className="h-4 w-4" />
          </span>
          <div className="min-w-0 space-y-0.5">
            <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">
              {item.title}
            </h3>
            {item.description && (
              <p className="text-[10px] text-zinc-500 truncate max-w-[200px] sm:max-w-[400px]">
                {item.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[10px] text-zinc-500 font-mono">
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-zinc-800/40 border border-zinc-800/20 capitalize text-[9px] mr-1">
            {item.itemType.name}
          </span>
          <button 
            onClick={onToggleAction}
            className={`p-1 hover:bg-zinc-800/80 rounded transition-colors cursor-pointer shrink-0 ${type === 'pinned' ? 'text-blue-400' : 'text-amber-400'}`}
          >
            {type === 'pinned' ? (
              <Pin className="h-3.5 w-3.5 fill-blue-500/20" />
            ) : (
              <Star className="h-3.5 w-3.5 fill-amber-500/20" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default function DashboardClient() {
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

  // Derived dashboard widgets datasets (Max 4 items per section in cockpit)
  const recentCollections = useMemo(() => {
    return [...collections]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 4);
  }, [collections]);

  const pinnedItems = useMemo(() => {
    return items.filter(i => i.isPinned).slice(0, 4);
  }, [items]);

  const favoriteItems = useMemo(() => {
    return items.filter(i => i.isFavorite).slice(0, 4);
  }, [items]);

  const recentItems = useMemo(() => {
    return [...items]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);
  }, [items]);

  const favoriteItemsCount = useMemo(() => {
    return items.filter(i => i.isFavorite).length;
  }, [items]);

  const favoriteCollectionsCount = useMemo(() => {
    return collections.filter(c => c.isFavorite).length;
  }, [collections]);

  return (
    <div className="space-y-8">
      {/* Dashboard Widgets View - rendered on Home when no search filter is active */}
      {activeFilter.type === 'all' && !searchQuery ? (
        <div className="space-y-8 animate-fade-in">
          {/* Welcome / Dashboard Insights Banner */}
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

          {/* 4 Clickable Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Items */}
            <button 
              onClick={() => setActiveFilter({ type: 'items' })}
              className="text-left cursor-pointer group bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700/80 hover:bg-zinc-900/45 transition-all duration-300 relative overflow-hidden focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400 tracking-wide">Items</span>
                <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <Layers className="h-4.5 w-4.5" />
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-white tracking-tight">{items.length}</span>
                <span className="text-[10px] text-zinc-500">stashed</span>
              </div>
            </button>

            {/* Collections */}
            <button 
              onClick={() => setActiveFilter({ type: 'collections' })}
              className="text-left cursor-pointer group bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700/80 hover:bg-zinc-900/45 transition-all duration-300 relative overflow-hidden focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400 tracking-wide">Collections</span>
                <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Folder className="h-4.5 w-4.5" />
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-white tracking-tight">{collections.length}</span>
                <span className="text-[10px] text-zinc-500">folders</span>
              </div>
            </button>

            {/* Favorite Items */}
            <button 
              onClick={() => setActiveFilter({ type: 'favorites' })}
              className="text-left cursor-pointer group bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700/80 hover:bg-zinc-900/45 transition-all duration-300 relative overflow-hidden focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400 tracking-wide">Favorite Items</span>
                <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Star className="h-4.5 w-4.5 fill-amber-500/10" />
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-white tracking-tight">{favoriteItemsCount}</span>
                <span className="text-[10px] text-zinc-500">starred</span>
              </div>
            </button>

            {/* Favorite Collections */}
            <button 
              onClick={() => setActiveFilter({ type: 'favorite_collections' })}
              className="text-left cursor-pointer group bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700/80 hover:bg-zinc-900/45 transition-all duration-300 relative overflow-hidden focus:outline-hidden focus:ring-1 focus:ring-pink-500"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl group-hover:bg-pink-500/10 transition-colors" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400 tracking-wide">Favorite Collections</span>
                <span className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                  <Heart className="h-4.5 w-4.5 fill-pink-500/10" />
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-white tracking-tight">{favoriteCollectionsCount}</span>
                <span className="text-[10px] text-zinc-500">liked</span>
              </div>
            </button>
          </div>

          {/* Grid Layout Rows */}
          <div className="space-y-8 pt-2">
            
            {/* ROW 1: Pinned Items (left) alongside Favorite Items (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Pinned Items Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pin className="h-4 w-4 text-blue-400 fill-blue-500/10 shrink-0" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                      Pinned Items
                    </h2>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-mono font-medium">
                      {items.filter(i => i.isPinned).length}
                    </span>
                  </div>
                  {items.filter(i => i.isPinned).length > 4 && (
                    <button 
                      onClick={() => setActiveFilter({ type: 'pinned' })}
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 group cursor-pointer"
                    >
                      <span>View all</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  )}
                </div>

                {pinnedItems.length === 0 ? (
                  <div className="p-6 border border-zinc-800/60 rounded-xl bg-zinc-900/10 text-center">
                    <p className="text-xs text-zinc-500">No items pinned to top. Hover over items to pin them.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                    {pinnedItems.map((item) => (
                      <DashboardItemCard
                        key={item.id}
                        item={item}
                        type="pinned"
                        onSelect={() => handleOpenItemDetailDrawer(item)}
                        onToggleAction={(e) => handleToggleItemPin(item.id, e)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Favorite Items Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-500/10 shrink-0" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                      Favorite Items
                    </h2>
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono font-medium">
                      {items.filter(i => i.isFavorite).length}
                    </span>
                  </div>
                  {items.filter(i => i.isFavorite).length > 4 && (
                    <button 
                      onClick={() => setActiveFilter({ type: 'favorites' })}
                      className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 group cursor-pointer"
                    >
                      <span>View all</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  )}
                </div>

                {favoriteItems.length === 0 ? (
                  <div className="p-6 border border-zinc-800/60 rounded-xl bg-zinc-900/10 text-center">
                    <p className="text-xs text-zinc-500">No favorite items. Star items to add them here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                    {favoriteItems.map((item) => (
                      <DashboardItemCard
                        key={item.id}
                        item={item}
                        type="favorite"
                        onSelect={() => handleOpenItemDetailDrawer(item)}
                        onToggleAction={(e) => handleToggleItemFavorite(item.id, e)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ROW 2: Recent Items (left) alongside Recent Collections (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Recent Items Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-400 shrink-0" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                      Recent Items
                    </h2>
                    <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded font-mono font-medium">
                      {items.length}
                    </span>
                  </div>
                  {items.length > 4 && (
                    <button 
                      onClick={() => setActiveFilter({ type: 'items' })}
                      className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 group cursor-pointer"
                    >
                      <span>View all</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {recentItems.map((item) => {
                    const typeColor = item.itemType.color;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleOpenItemDetailDrawer(item)}
                        className="group bg-zinc-900/25 border border-zinc-800/60 rounded-xl p-3.5 flex items-center justify-between gap-4 cursor-pointer hover:border-zinc-700/60 hover:bg-zinc-900/40 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span 
                            className="p-1.5 rounded-lg shrink-0 flex items-center justify-center border border-zinc-800 bg-zinc-900/60"
                            style={{ color: typeColor }}
                          >
                            <DynamicIcon name={item.itemType.icon} className="h-4 w-4" />
                          </span>
                          <div className="min-w-0 space-y-0.5">
                            <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">
                              {item.title}
                            </h3>
                            {item.description && (
                              <p className="text-[10px] text-zinc-500 truncate max-w-[350px] sm:max-w-[450px]">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 text-[10px] text-zinc-500 font-mono">
                          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-zinc-800/40 border border-zinc-800/20 capitalize text-[9px]">
                            {item.itemType.name}
                          </span>
                          <span>
                            {new Date(item.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Collections Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4 text-emerald-400 shrink-0" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                      Recent Collections
                    </h2>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-medium">
                      {collections.length}
                    </span>
                  </div>
                  {collections.length > 4 && (
                    <button 
                      onClick={() => setActiveFilter({ type: 'collections' })}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 group cursor-pointer"
                    >
                      <span>View all</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {recentCollections.map((col) => {
                    const typeColor = MOCK_ITEM_TYPES[col.defaultTypeId?.replace('type-', '') || 'note']?.color || '#a1a1aa';
                    return (
                      <div
                        key={col.id}
                        onClick={() => handleSelectCollectionCard(col.id)}
                        className="group bg-zinc-900/35 border border-zinc-800/70 rounded-xl p-4 cursor-pointer hover:border-zinc-700/80 hover:bg-zinc-900/55 transition-all duration-300 relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-1.5 h-full" style={{ backgroundColor: typeColor }} />
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">
                            {col.name}
                          </h3>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-zinc-800 text-zinc-400 border border-zinc-700/20 rounded shrink-0">
                            {col.itemCount} items
                          </span>
                        </div>
                        {col.description && (
                          <p className="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed">
                            {col.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        </div>
      ) : (
        /* Regular list views (grids for search, active filters, or View All view) */
        <div className="space-y-8 animate-fade-in">
          {/* Active Filter Title */}
          {activeFilter.type !== 'all' && (
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/40">
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-400">Viewing:</span>
                <span className="text-sm font-semibold text-white capitalize bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-lg">
                  {activeFilter.type === 'collection' 
                    ? collections.find(c => c.id === activeFilter.value)?.name 
                    : activeFilter.type === 'favorite_collections'
                    ? 'Favorite Collections'
                    : activeFilter.type === 'collections'
                    ? 'All Collections'
                    : activeFilter.type === 'items'
                    ? 'All Items'
                    : activeFilter.type === 'pinned'
                    ? 'Pinned Items'
                    : activeFilter.value || activeFilter.type}
                </span>
                
                {/* Clear filters button */}
                <button 
                  onClick={() => {
                    setActiveFilter({ type: 'all' });
                  }}
                  className="text-xs text-zinc-500 hover:text-zinc-300 font-medium flex items-center gap-1 ml-2 px-2.5 py-1 rounded hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all cursor-pointer"
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
          {filteredItems.length > 0 && (
            <ItemGrid 
              items={filteredItems}
              onItemSelect={handleOpenItemDetailDrawer}
              onToggleFavorite={handleToggleItemFavorite}
              onTogglePin={handleToggleItemPin}
            />
          )}
        </div>
      )}
    </div>
  );
}
