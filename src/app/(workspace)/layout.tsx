'use client';

import React from 'react';
import { DashboardProvider, useDashboardContext } from '@/context/DashboardContext';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import ItemDrawer from '@/components/dashboard/ItemDrawer';
import CollectionModal from '@/components/dashboard/CollectionModal';

function WorkspaceLayoutContent({ children }: { children: React.ReactNode }) {
  const {
    activeFilter,
    handleOpenNewItemDrawer,
    handleOpenNewCollectionModal,
    searchQuery,
    setSearchQuery,
    setMobileOpen,
    proMode,
    setProMode,
    items,
    isCollapsed,
    setIsCollapsed,
    mobileOpen,
    setActiveFilter,
    selectedItem,
    isDrawerOpen,
    setIsDrawerOpen,
    handleSaveItem,
    handleDeleteItem,
    isCollectionModalOpen,
    setIsCollectionModalOpen,
    handleSaveCollection,
    selectedCollection,
  } = useDashboardContext();

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
          itemCount={items.length}
        />

        {/* Dynamic content canvas */}
        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-w-[1600px] w-full mx-auto">
          {children}
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

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <React.Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500 font-mono">Loading workspace...</div>}>
        <WorkspaceLayoutContent>{children}</WorkspaceLayoutContent>
      </React.Suspense>
    </DashboardProvider>
  );
}
