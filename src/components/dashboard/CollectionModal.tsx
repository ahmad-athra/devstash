'use client';

import React, { useState, useEffect } from 'react';
import { Collection } from '@/types/dashboard';
import { useDashboardContext } from '@/context/DashboardContext';
import { X, Save, FolderOpen, Star } from 'lucide-react';
import { DynamicIcon } from './DynamicIcon';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (collection: any, onSuccess?: () => void) => void;
  collection: Collection | null; // null if creating
}

export default function CollectionModal({
  isOpen,
  onClose,
  onSave,
  collection,
}: CollectionModalProps) {
  const { itemTypes } = useDashboardContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [defaultTypeId, setDefaultTypeId] = useState('type-snippet');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (collection) {
      setName(collection.name);
      setDescription(collection.description || '');
      setDefaultTypeId(collection.defaultTypeId || 'type-snippet');
      setIsFavorite(collection.isFavorite);
    } else {
      setName('');
      setDescription('');
      setDefaultTypeId('type-snippet');
      setIsFavorite(false);
    }
  }, [collection, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const data = {
      id: collection?.id || `col-${Date.now()}`,
      name,
      description,
      defaultTypeId,
      isFavorite,
      itemCount: collection?.itemCount || 0,
      items: collection?.items || [],
      createdAt: collection?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(data, () => {
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-[#0f0f12] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600/10 text-blue-500">
              <FolderOpen className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-200">
              {collection ? 'Edit Collection' : 'Create Collection'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 p-1.5 hover:bg-zinc-900 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Collection Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Next.js Configs, CSS Boilerplates"
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700/80 text-zinc-200 placeholder-zinc-600 px-3.5 py-2 rounded-xl text-sm focus:outline-hidden"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional brief description of what types of resources belong here..."
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700/80 text-zinc-200 placeholder-zinc-600 px-3.5 py-2 rounded-xl text-sm focus:outline-hidden resize-none"
            />
          </div>

          {/* Color theme base on dominant type */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Default Color Theme (Based on Dominant Type)</label>
            <div className="grid grid-cols-4 gap-2">
              {itemTypes.map((type) => {
                const isSelected = defaultTypeId === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setDefaultTypeId(type.id)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border text-[10px] transition-all capitalize ${
                      isSelected
                        ? 'bg-zinc-800 border-zinc-700 text-white font-semibold'
                        : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:bg-zinc-900/80'
                    }`}
                  >
                    <span style={{ color: type.color }}>
                      <DynamicIcon name={type.icon} className="h-3.5 w-3.5" />
                    </span>
                    <span className="truncate max-w-full">{type.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Favorite */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                isFavorite 
                  ? 'bg-yellow-950/20 border-yellow-800/60 text-yellow-500' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-900/80'
              }`}
            >
              <Star className={`h-4 w-4 ${isFavorite ? 'fill-yellow-500/25' : ''}`} />
              <span>{isFavorite ? 'Favorited Collection' : 'Favorite Collection'}</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-800/60 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl text-xs font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98]"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Collection</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
