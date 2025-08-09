'use client';

import React, { useState, PropsWithChildren } from 'react';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';

type DashboardShellProps = PropsWithChildren<{
  /** thay đổi bề rộng container nếu cần */
  widthClassName?: string; // ví dụ: 'max-w-[1280px]' | 'max-w-6xl' ...
}>;

export default function DashboardShell({
  widthClassName = 'max-w-[1200px]',
  children,
}: DashboardShellProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      style={
        {
          // palette cục bộ, không đụng global.css
          '--color-background': '#FFFFFF',
          '--color-foreground': '#111827',
          '--color-border': '#E5E7EB',
          '--color-input': '#F3F4F6',
          '--color-card': '#FFFFFF',
          '--color-popover': '#FFFFFF',
          '--color-muted': '#F8F9FA',
          '--color-muted-foreground': '#6B7280',
          '--color-primary': '#00FF88',
          '--color-primary-foreground': '#0F0F0F',
          '--color-success': '#00FF88',
          '--color-warning': '#FFB020',
          '--color-destructive': '#FF3B57',
        } as React.CSSProperties
      }
      className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]"
    >
      {/* Header full width, nội dung bên trong được canh giữa nhờ container */}
      <Header onToggleSidebar={() => setSidebarOpen(true)} />

      <main className="pt-20">
        <div className={`mx-auto ${widthClassName} px-6`}>
          {children}
        </div>
      </main>

      {/* Sidebar overlay */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
