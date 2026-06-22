'use client';

import React from 'react';
import { Item } from '@/types/dashboard';
import { DynamicIcon } from './DynamicIcon';
import { Star, Pin, Copy, Check, ExternalLink, FileText, ImageIcon } from 'lucide-react';

interface ItemGridProps {
  items: Item[];
  onItemSelect: (item: Item) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onTogglePin: (id: string, e: React.MouseEvent) => void;
}

export default function ItemGrid({
  items,
  onItemSelect,
  onToggleFavorite,
  onTogglePin,
}: ItemGridProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (item: Item, e: React.MouseEvent) => {
    e.stopPropagation();
    const copyText = item.contentType === 'URL' ? item.url : item.content;
    if (copyText) {
      navigator.clipboard.writeText(copyText);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border border-zinc-800/40 rounded-2xl bg-zinc-900/10 px-4">
        <div className="p-4 bg-zinc-900/60 rounded-full text-zinc-500 mb-4 border border-zinc-800/40">
          <DynamicIcon name="FileQuestion" className="h-8 w-8" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-200">No items found</h3>
        <p className="text-xs text-zinc-500 max-w-[280px] mt-1.5 leading-relaxed">
          Create a new item or modify your search filters to find what you are looking for.
        </p>
      </div>
    );
  }

  // Helper to format bytes to human readable sizes
  const formatBytes = (bytes?: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
        Items ({items.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((item) => {
          const typeColor = item.itemType.color;
          const isCopied = copiedId === item.id;
          
          return (
            <div
              key={item.id}
              onClick={() => onItemSelect(item)}
              style={{ borderLeftColor: typeColor }}
              className="group bg-zinc-900/40 border border-zinc-800/80 border-l-[3.5px] rounded-r-xl rounded-l-md p-4 cursor-pointer hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all duration-300 flex flex-col justify-between h-[210px]"
            >
              {/* Header Info */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span 
                      className="p-1.5 rounded-md flex items-center justify-center shrink-0"
                      style={{ color: typeColor, backgroundColor: `${typeColor}15` }}
                    >
                      <DynamicIcon name={item.itemType.icon} className="h-3.5 w-3.5" />
                    </span>
                    <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-0.5 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                    {/* Pin button */}
                    <button
                      onClick={(e) => onTogglePin(item.id, e)}
                      className={`p-1.5 rounded-md hover:bg-zinc-800 transition-colors ${
                        item.isPinned ? 'text-blue-500' : 'text-zinc-500'
                      }`}
                    >
                      <Pin className={`h-3.5 w-3.5 ${item.isPinned ? 'fill-blue-500/20' : ''}`} />
                    </button>
                    {/* Favorite button */}
                    <button
                      onClick={(e) => onToggleFavorite(item.id, e)}
                      className={`p-1.5 rounded-md hover:bg-zinc-800 transition-colors ${
                        item.isFavorite ? 'text-yellow-500' : 'text-zinc-500'
                      }`}
                    >
                      <Star className={`h-3.5 w-3.5 ${item.isFavorite ? 'fill-yellow-500/20' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Description */}
                {item.description && (
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {/* Content Preview */}
                <div className="mt-2 text-xs font-mono rounded-lg overflow-hidden border border-zinc-800/40 bg-zinc-950/40 p-2.5 max-h-[70px] overflow-y-hidden text-zinc-300">
                  {item.contentType === 'TEXT' && item.content && (
                    <pre className="truncate">{item.content}</pre>
                  )}
                  {item.contentType === 'URL' && item.url && (
                    <div className="flex items-center gap-1.5 text-emerald-400 truncate">
                      <ExternalLink className="h-3 w-3 shrink-0" />
                      <span className="underline truncate">{item.url}</span>
                    </div>
                  )}
                  {item.contentType === 'FILE' && (
                    <div className="flex items-center justify-between text-zinc-400">
                      <div className="flex items-center gap-2 truncate">
                        {item.itemType.name === 'image' ? (
                          <ImageIcon className="h-3.5 w-3.5 text-pink-400 shrink-0" />
                        ) : (
                          <FileText className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                        )}
                        <span className="truncate">{item.fileName}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 shrink-0">
                        {formatBytes(item.fileSize)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer tags and date */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800/20 text-[10px] text-zinc-500">
                <div className="flex items-center gap-1 overflow-hidden max-w-[70%]">
                  {item.tags.slice(0, 2).map((tag) => (
                    <span 
                      key={tag.id}
                      className="px-1.5 py-0.5 rounded-sm bg-zinc-800 text-zinc-400 font-mono tracking-wide"
                    >
                      #{tag.name}
                    </span>
                  ))}
                  {item.tags.length > 2 && (
                    <span className="px-1.5 py-0.5 rounded-sm bg-zinc-800/60 text-zinc-500 font-mono">
                      +{item.tags.length - 2}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Action Copy/Link button */}
                  {(item.contentType === 'TEXT' || item.contentType === 'URL') && (
                    <button
                      onClick={(e) => handleCopy(item, e)}
                      className={`p-1.5 rounded-md hover:bg-zinc-800 hover:text-zinc-200 transition-colors shrink-0 ${
                        isCopied ? 'text-green-500' : 'text-zinc-500'
                      }`}
                      title={isCopied ? 'Copied!' : 'Copy to clipboard'}
                    >
                      {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  )}
                  <span className="text-zinc-600 font-mono shrink-0 select-none">
                    {new Date(item.createdAt).toLocaleDateString(undefined, { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
