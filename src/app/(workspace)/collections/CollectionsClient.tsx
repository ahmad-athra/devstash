'use client';

import React from 'react';
import { useDashboardContext } from '@/context/DashboardContext';
import CollectionGrid from '@/components/dashboard/CollectionGrid';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CollectionsClient() {
  const {
    filteredCollections,
    handleSelectCollectionCard,
    handleToggleCollectionFavorite,
  } = useDashboardContext();

  return (
    <div className="space-y-6">
      {/* Header Back Link & Info */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/40">
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard" 
            className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-400">Viewing:</span>
              <span className="text-sm font-semibold text-white bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-lg">
                All Collections
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Collections list / Grid */}
      <CollectionGrid 
        collections={filteredCollections}
        onCollectionSelect={handleSelectCollectionCard}
        onToggleFavorite={handleToggleCollectionFavorite}
      />
    </div>
  );
}
