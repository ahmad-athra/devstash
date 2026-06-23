'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';
import { Item, Collection } from '@/types/dashboard';
import { MOCK_ITEMS, MOCK_COLLECTIONS } from '@/lib/mockData';
import { usePathname, useRouter, useParams, useSearchParams } from 'next/navigation';

export const pluralToSingularType = (plural: string): string => {
  const mapping: Record<string, string> = {
    snippets: 'snippet',
    prompts: 'prompt',
    commands: 'command',
    notes: 'note',
    links: 'link',
    files: 'file',
    images: 'image',
    snippet: 'snippet',
    prompt: 'prompt',
    command: 'command',
    note: 'note',
    link: 'link',
    file: 'file',
    image: 'image',
  };
  return mapping[plural.toLowerCase()] || plural.toLowerCase();
};

export const singularToPluralType = (singular: string): string => {
  const mapping: Record<string, string> = {
    snippet: 'snippets',
    prompt: 'prompts',
    command: 'commands',
    note: 'notes',
    link: 'links',
    file: 'files',
    image: 'images',
  };
  return mapping[singular.toLowerCase()] || `${singular}s`;
};

interface ActiveFilter {
  type: 'all' | 'favorites' | 'type' | 'collection';
  value?: string;
}

interface DashboardContextType {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  collections: Collection[];
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>;
  
  activeFilter: ActiveFilter;
  setActiveFilter: (filter: ActiveFilter) => void;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  selectedItem: Item | null;
  setSelectedItem: (item: Item | null) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  
  selectedCollection: Collection | null;
  setSelectedCollection: (col: Collection | null) => void;
  isCollectionModalOpen: boolean;
  setIsCollectionModalOpen: (open: boolean) => void;
  
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  
  proMode: boolean;
  setProMode: (pro: boolean) => void;
  
  // Handlers
  handleToggleItemFavorite: (id: string, e: React.MouseEvent) => void;
  handleToggleItemPin: (id: string, e: React.MouseEvent) => void;
  handleToggleCollectionFavorite: (id: string, e: React.MouseEvent) => void;
  handleOpenNewItemDrawer: () => void;
  handleOpenItemDetailDrawer: (item: Item) => void;
  handleSaveItem: (savedItem: Item) => void;
  handleDeleteItem: (id: string) => void;
  handleOpenNewCollectionModal: () => void;
  handleSaveCollection: (savedCol: Collection) => void;
  handleSelectCollectionCard: (id: string) => void;
  
  filteredItems: Item[];
  filteredCollections: Collection[];
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  // App dataset states
  const [items, setItems] = useState<Item[]>(MOCK_ITEMS);
  const [collections, setCollections] = useState<Collection[]>(MOCK_COLLECTIONS);

  // Filters state - derived directly from URL parameters to avoid cascading renders
  const activeFilter = useMemo<ActiveFilter>(() => {
    if (pathname.startsWith('/items/')) {
      const typeParam = params?.type as string;
      if (typeParam) {
        return { type: 'type', value: pluralToSingularType(typeParam) };
      }
    }
    
    const filterParam = searchParams.get('filter');
    if (filterParam === 'favorites') {
      return { type: 'favorites' };
    }
    
    const collectionParam = searchParams.get('collection');
    if (collectionParam) {
      return { type: 'collection', value: collectionParam };
    }

    return { type: 'all' };
  }, [pathname, params, searchParams]);

  const [searchQuery, setSearchQuery] = useState('');

  // Sidebar controls
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [proMode, setProMode] = useState(true);

  // Drawer / Modals state
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);

  const setActiveFilter = (filter: ActiveFilter) => {
    setMobileOpen(false); // Close mobile drawer when selection changes

    if (filter.type === 'type') {
      const plural = singularToPluralType(filter.value || '');
      router.push(`/items/${plural}`);
    } else if (filter.type === 'favorites') {
      router.push('/dashboard?filter=favorites');
    } else if (filter.type === 'collection') {
      router.push(`/dashboard?collection=${filter.value}`);
    } else {
      router.push('/dashboard');
    }
  };

  // Favorite / Pin Toggles
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

  // Memoized Filtered & Sorted Lists
  const filteredItems = useMemo(() => {
    let itemsFiltered = [...items];

    if (activeFilter.type === 'favorites') {
      itemsFiltered = itemsFiltered.filter(i => i.isFavorite);
    } else if (activeFilter.type === 'type') {
      itemsFiltered = itemsFiltered.filter(i => i.itemType.name === activeFilter.value);
    } else if (activeFilter.type === 'collection') {
      const targetCol = collections.find(c => c.id === activeFilter.value);
      if (targetCol) {
        const itemIds = targetCol.items.map(item => item.id);
        itemsFiltered = itemsFiltered.filter(i => itemIds.includes(i.id));
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      itemsFiltered = itemsFiltered.filter(item => 
        item.title.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.content && item.content.toLowerCase().includes(q)) ||
        item.tags.some(tag => tag.name.toLowerCase().includes(q)) ||
        item.itemType.name.toLowerCase().includes(q)
      );
    }

    // Sort items so pinned are first
    return itemsFiltered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [items, collections, activeFilter, searchQuery]);

  const filteredCollections = useMemo(() => {
    let cols = [...collections];

    if (activeFilter.type === 'favorites') {
      cols = cols.filter(c => c.isFavorite);
    } else if (activeFilter.type === 'collection') {
      cols = cols.filter(c => c.id === activeFilter.value);
    } else if (activeFilter.type === 'type') {
      return [];
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      cols = cols.filter(col =>
        col.name.toLowerCase().includes(q) ||
        (col.description && col.description.toLowerCase().includes(q))
      );
    }

    return cols;
  }, [collections, activeFilter, searchQuery]);

  return (
    <DashboardContext.Provider
      value={{
        items,
        setItems,
        collections,
        setCollections,
        activeFilter,
        setActiveFilter,
        searchQuery,
        setSearchQuery,
        selectedItem,
        setSelectedItem,
        isDrawerOpen,
        setIsDrawerOpen,
        selectedCollection,
        setSelectedCollection,
        isCollectionModalOpen,
        setIsCollectionModalOpen,
        isCollapsed,
        setIsCollapsed,
        mobileOpen,
        setMobileOpen,
        proMode,
        setProMode,
        handleToggleItemFavorite,
        handleToggleItemPin,
        handleToggleCollectionFavorite,
        handleOpenNewItemDrawer,
        handleOpenItemDetailDrawer,
        handleSaveItem,
        handleDeleteItem,
        handleOpenNewCollectionModal,
        handleSaveCollection,
        handleSelectCollectionCard,
        filteredItems,
        filteredCollections,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
};
