'use client';

import React from 'react';
import { Collection } from '@/types/dashboard';
import { MOCK_ITEM_TYPES } from '@/lib/mockData';
import { Star, FolderOpen, Calendar, ArrowRight } from 'lucide-react';
import { DynamicIcon } from './DynamicIcon';

interface CollectionGridProps {
  collections: Collection[];
  activeCollectionId?: string;
  onCollectionSelect: (id: string) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export default function CollectionGrid({
  collections,
  activeCollectionId,
  onCollectionSelect,
  onToggleFavorite,
}: CollectionGridProps) {

  if (collections.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Collections ({collections.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {collections.map((col) => {
          // Get the default item type configurations
          const itemTypeKey = col.defaultTypeId?.replace('type-', '') || 'note';
          const typeConfig = MOCK_ITEM_TYPES[itemTypeKey] || MOCK_ITEM_TYPES.note;
          const isSelected = activeCollectionId === col.id;
          
          // Compute color codes for background tints
          const themeColor = typeConfig.color;

          return (
            <div
              key={col.id}
              onClick={() => onCollectionSelect(col.id)}
              style={{
                borderColor: isSelected ? themeColor : 'rgba(39, 39, 42, 0.4)',
                backgroundColor: `${themeColor}08`, // Tinted background
              }}
              className={`group relative p-5 rounded-2xl border cursor-pointer hover:scale-[1.01] hover:border-zinc-700/80 transition-all duration-300 flex flex-col justify-between overflow-hidden`}
            >
              {/* Dynamic Glow Effect */}
              <div 
                className="absolute -top-12 -right-12 w-24 h-24 rounded-full opacity-10 blur-xl group-hover:scale-150 transition-transform duration-500"
                style={{ backgroundColor: themeColor }}
              />

              <div className="space-y-3 relative">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div 
                    className="p-2.5 rounded-xl flex items-center justify-center transition-all group-hover:scale-105"
                    style={{ 
                      color: themeColor, 
                      backgroundColor: `${themeColor}15` 
                    }}
                  >
                    <FolderOpen className="h-5 w-5" />
                  </div>

                  <button
                    onClick={(e) => onToggleFavorite(col.id, e)}
                    className="text-zinc-600 hover:text-yellow-500 p-1.5 hover:bg-zinc-800/40 rounded-lg transition-colors"
                  >
                    <Star 
                      className={`h-4.5 w-4.5 transition-all ${
                        col.isFavorite ? 'text-yellow-500 fill-yellow-500/20' : 'text-zinc-600'
                      }`}
                    />
                  </button>
                </div>

                {/* Info */}
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors truncate">
                    {col.name}
                  </h3>
                  {col.description && (
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                      {col.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-5 pt-4 border-t border-zinc-800/20 flex items-center justify-between text-[11px] text-zinc-500 relative">
                <span className="font-semibold text-zinc-400 group-hover:text-zinc-300 transition-colors">
                  {col.itemCount} {col.itemCount === 1 ? 'item' : 'items'}
                </span>
                
                {/* Visual indicator of types inside this collection */}
                <div className="flex items-center gap-1.5">
                  {/* Distinct item types in collection */}
                  {Array.from(new Set(col.items.map(item => item.itemType.id))).map(typeId => {
                    const matchedType = Object.values(MOCK_ITEM_TYPES).find(t => t.id === typeId);
                    if (!matchedType) return null;
                    return (
                      <div 
                        key={typeId} 
                        className="p-1 rounded-sm"
                        style={{ color: matchedType.color }}
                        title={matchedType.name}
                      >
                        <DynamicIcon name={matchedType.icon} className="h-3 w-3" />
                      </div>
                    );
                  })}
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-600 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
