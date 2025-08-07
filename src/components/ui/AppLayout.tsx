// src/components/ui/AppLayout.tsx
'use client';
import React, { ReactNode } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => (
   <div className="min-h-screen bg-white">
    <Sidebar />
    <div className="flex-1 ml-80 transition-all duration-300 ease-in-out flex flex-col">
      <Header />
      <main className="pt-20 p-6 flex-1 overflow-auto">
        {children}
      </main>
    </div>
  </div>
);

export default AppLayout;
