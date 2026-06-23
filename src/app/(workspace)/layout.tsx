import React, { Suspense } from 'react';
import { DashboardProvider } from '@/context/DashboardContext';
import WorkspaceShellClient from './WorkspaceShellClient';

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500 font-mono">Loading workspace...</div>}>
      <DashboardProvider>
        <WorkspaceShellClient>{children}</WorkspaceShellClient>
      </DashboardProvider>
    </Suspense>
  );
}

