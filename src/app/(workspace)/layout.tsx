import React, { Suspense } from 'react';
import { DashboardProvider } from '@/context/DashboardContext';
import WorkspaceShellClient from './WorkspaceShellClient';
import { getCollections } from '@/lib/db/collections';
import { getItems } from '@/lib/db/items';

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const [collections, items] = await Promise.all([
    getCollections(),
    getItems(),
  ]);

  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500 font-mono">Loading workspace...</div>}>
      <DashboardProvider initialCollections={collections} initialItems={items}>
        <WorkspaceShellClient>{children}</WorkspaceShellClient>
      </DashboardProvider>
    </Suspense>
  );
}


