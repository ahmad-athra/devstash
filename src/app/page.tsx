'use client';

import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import CollectionGrid from '@/components/dashboard/CollectionGrid';
import ItemGrid from '@/components/dashboard/ItemGrid';
import ItemDrawer from '@/components/dashboard/ItemDrawer';
import CollectionModal from '@/components/dashboard/CollectionModal';
import { MOCK_ITEMS, MOCK_COLLECTIONS } from '@/lib/mockData';
import { Item, Collection } from '@/types/dashboard';
import { 
  Sparkles, 
  Folder, 
  Layers, 
  HelpCircle, 
  Zap, 
  X, 
  Check, 
  Info,
  ChevronRight,
  TrendingUp,
  FolderLock
} from 'lucide-react';

export default function DashboardPage() {
  // Sidebar state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Pro/Free mock state
  const [proMode, setProMode] = useState(true);

  // App dataset states
  const [items, setItems] = useState<Item[]>(MOCK_ITEMS);
  const [collections, setCollections] = useState<Collection[]>(MOCK_COLLECTIONS);

  // Filters state
  const [activeFilter, setActiveFilter] = useState<{ 
    type: 'all' | 'favorites' | 'type' | 'collection'; 
    value?: string; 
  }>({ type: 'all' });
  const [searchQuery, setSearchQuery] = useState('');

  // Drawer / Modals state
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);

  // Stats / Quota calculation helper
  const totalItemCount = items.length;

  // Real-time filtering logic
  const filteredData = useMemo(() => {
    // 1. Filter by Sidebar selection
    let itemsFiltered = [...items];
    let collectionsFiltered = [...collections];

    if (activeFilter.type === 'favorites') {
      itemsFiltered = itemsFiltered.filter(i => i.isFavorite);
      collectionsFiltered = collectionsFiltered.filter(c => c.isFavorite);
    } else if (activeFilter.type === 'type') {
      itemsFiltered = itemsFiltered.filter(i => i.itemType.name === activeFilter.value);
      // Collections list isn't filtered here, we just display the filtered items directly
      collectionsFiltered = [];
    } else if (activeFilter.type === 'collection') {
      const targetCol = collections.find(c => c.id === activeFilter.value);
      if (targetCol) {
        const itemIds = targetCol.items.map(item => item.id);
        itemsFiltered = itemsFiltered.filter(i => itemIds.includes(i.id));
      }
      collectionsFiltered = collectionsFiltered.filter(c => c.id === activeFilter.value);
    }

    // 2. Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      itemsFiltered = itemsFiltered.filter(item => 
        item.title.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.content && item.content.toLowerCase().includes(q)) ||
        item.tags.some(tag => tag.name.toLowerCase().includes(q)) ||
        item.itemType.name.toLowerCase().includes(q)
      );

      collectionsFiltered = collectionsFiltered.filter(col =>
        col.name.toLowerCase().includes(q) ||
        (col.description && col.description.toLowerCase().includes(q))
      );
    }

    return {
      items: itemsFiltered,
      collections: collectionsFiltered,
    };
  }, [items, collections, activeFilter, searchQuery]);

  // Favorite Toggles
  const handleToggleItemFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const handleToggleItemPin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isPinned: !item.isPinned } : item
    ));
  };

  const handleToggleCollectionFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollections(prev => prev.map(col => 
      col.id === id ? { ...col, isFavorite: !col.isFavorite } : col
    ));
  };

  // Item Drawer Actions
  const handleOpenNewItemDrawer = () => {
    setSelectedItem(null);
    setIsDrawerOpen(true);
  };

  const handleOpenItemDetailDrawer = (item: Item) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const handleSaveItem = (savedItem: Item) => {
    setItems(prev => {
      const exists = prev.some(item => item.id === savedItem.id);
      if (exists) {
        return prev.map(item => item.id === savedItem.id ? savedItem : item);
      } else {
        return [savedItem, ...prev];
      }
    });

    // Also update collection associations
    if (savedItem.collections && savedItem.collections.length > 0) {
      setCollections(prev => prev.map(col => {
        const belongs = savedItem.collections.some(c => c.id === col.id);
        const hasItem = col.items.some(i => i.id === savedItem.id);

        if (belongs && !hasItem) {
          return {
            ...col,
            itemCount: col.itemCount + 1,
            items: [savedItem, ...col.items]
          };
        } else if (!belongs && hasItem) {
          return {
            ...col,
            itemCount: Math.max(0, col.itemCount - 1),
            items: col.items.filter(i => i.id !== savedItem.id)
          };
        } else if (belongs && hasItem) {
          return {
            ...col,
            items: col.items.map(i => i.id === savedItem.id ? savedItem : i)
          };
        }
        return col;
      }));
    }
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    // Remove from collections
    setCollections(prev => prev.map(col => ({
      ...col,
      items: col.items.filter(i => i.id !== id),
      itemCount: col.items.filter(i => i.id !== id).length
    })));
  };

  // Collection Modal Actions
  const handleOpenNewCollectionModal = () => {
    setSelectedCollection(null);
    setIsCollectionModalOpen(true);
  };

  const handleSaveCollection = (savedCol: Collection) => {
    setCollections(prev => {
      const exists = prev.some(c => c.id === savedCol.id);
      if (exists) {
        return prev.map(c => c.id === savedCol.id ? savedCol : c);
      } else {
        return [...prev, savedCol];
      }
    });
  };

  const handleSelectCollectionCard = (id: string) => {
    setActiveFilter({ type: 'collection', value: id });
  };

  // Sort items so pinned are first
  const sortedItems = useMemo(() => {
    return [...filteredData.items].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredData.items]);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-200">
      
      {/* Collapsible Sidebar */}
      <Sidebar 
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        proMode={proMode}
        setProMode={setProMode}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Navigation Header */}
        <Header 
          activeFilter={activeFilter}
          onNewItemClick={handleOpenNewItemDrawer}
          onNewCollectionClick={handleOpenNewCollectionModal}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setMobileOpen={setMobileOpen}
          proMode={proMode}
          itemCount={totalItemCount}
        />

        {/* Dynamic content canvas */}
        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-w-[1600px] w-full mx-auto">
          
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
                  <span>Welcome Back, Developer!</span>
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight">Your DevStash hub is active.</h1>
                <p className="text-xs text-zinc-400 max-w-xl">
                  Quickly retrieve and save code snippets, prompt variables, Docker configurations, and bookmark URLs.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 relative">
                <div className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-center min-w-[70px]">
                  <span className="block text-lg font-bold text-white leading-none">{totalItemCount}</span>
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
          {filteredData.collections.length > 0 && (
            <CollectionGrid 
              collections={filteredData.collections}
              activeCollectionId={activeFilter.type === 'collection' ? activeFilter.value : undefined}
              onCollectionSelect={handleSelectCollectionCard}
              onToggleFavorite={handleToggleCollectionFavorite}
            />
          )}

          {/* 2. Items list / Grid */}
          <ItemGrid 
            items={sortedItems}
            onItemSelect={handleOpenItemDetailDrawer}
            onToggleFavorite={handleToggleItemFavorite}
            onTogglePin={handleToggleItemPin}
          />
        </main>
      </div>

      {/* Side Slide-out Drawer */}
      <ItemDrawer 
        isOpen={isDrawerOpen}
        item={selectedItem}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveItem}
        onDelete={handleDeleteItem}
        proMode={proMode}
      />

      {/* Collection Creation Modal */}
      <CollectionModal 
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        onSave={handleSaveCollection}
        collection={selectedCollection}
      />

    </div>
  );
}
