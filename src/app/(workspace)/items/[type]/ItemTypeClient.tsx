'use client';

import React from 'react';
import { useDashboardContext, pluralToSingularType } from '@/context/DashboardContext';
import ItemGrid from '@/components/dashboard/ItemGrid';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ItemTypeClientProps {
  typeParam: string;
}

export default function ItemTypeClient({ typeParam }: ItemTypeClientProps) {
  const {
    filteredItems,
    handleOpenItemDetailDrawer,
    handleToggleItemFavorite,
    handleToggleItemPin,
  } = useDashboardContext();

  const singularType = pluralToSingularType(typeParam);

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
              <span className="text-sm text-zinc-400">Viewing Stashes:</span>
              <span className="text-sm font-semibold text-white capitalize bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-lg">
                {singularType}s
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Item list / Grid */}
      <ItemGrid 
        items={filteredItems}
        onItemSelect={handleOpenItemDetailDrawer}
        onToggleFavorite={handleToggleItemFavorite}
        onTogglePin={handleToggleItemPin}
      />
    </div>
  );
}
