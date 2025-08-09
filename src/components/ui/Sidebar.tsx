// src/components/ui/Sidebar.tsx
'use client';

import React, { useEffect } from 'react';
import Icon from '@/components/AppIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

type NavItem = { label: string; path: string; icon: string; description: string };

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  const items: NavItem[] = [
    { label: 'Overview',  path: '/dashboard/credit-score-overview-dashboard',       icon: 'BarChart3',  description: 'Credit score monitoring and trends' },
    { label: 'Analysis',  path: '/dashboard/credit-factor-analysis-dashboard',      icon: 'PieChart',   description: 'Factor breakdown and insights' },
    { label: 'Simulator', path: '/dashboard/what-if-scenario-simulator-dashboard',  icon: 'Calculator', description: 'What-if scenario modeling' },
    { label: 'Alerts',    path: '/dashboard/alert-management-dashboard',            icon: 'Bell',       description: 'Notification management' },
    { label: 'Settings',  path: '/dashboard/settings-dashboard',                    icon: 'Settings',   description: 'Application preferences' },
    { label: 'Profile',   path: '/dashboard/profile-management-dashboard',          icon: 'User',       description: 'User profile management' },
    { label: 'Help',      path: '/dashboard/help-dashboard',                        icon: 'HelpCircle', description: 'Support and documentation' },
  ];

  const isActive = (p: string) => router.pathname === p;
  const go = (p: string) => { router.push(p); onClose(); };

  // Khóa scroll khi mở
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        // LAYER chứa mọi thứ của sidebar – lớp độc lập, không đẩy layout
        <motion.div
          key="sidebar-layer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] pointer-events-none"
          aria-hidden={!isOpen}
        >
          {/* Scrim: luôn hiển thị để bắt click ra ngoài */}
          <div
            className="absolute inset-0 bg-black/40 pointer-events-auto"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'tween', duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            className="absolute left-0 top-0 h-full w-[280px] bg-white border-r border-[#E5E7EB] shadow-elevation-2 flex flex-col pointer-events-auto"
          >
            {/* Brand */}
            <div className="flex items-center justify-between h-20 px-5 border-b border-[#E5E7EB]">
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold text-[#111827]">Credit Scoring System</h1>
                <span className="text-sm text-[#6B7280] font-medium">Analytics</span>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg text-[#6B7280] hover:bg-[#F8F9FA]" aria-label="Close sidebar">
                <Icon name="X" size={20} />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 py-6 overflow-auto">
              <div className="space-y-2">
                {items.map(item => (
                  <button
                    key={item.path}
                    onClick={() => go(item.path)}
                    title={item.description}
                    className={
                      `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ` +
                      (isActive(item.path)
                        ? 'bg-[#00FF88] text-[#0F0F0F] shadow-elevation-2'
                        : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F8F9FA]')
                    }
                  >
                    <Icon name={item.icon} size={20} className={isActive(item.path) ? 'drop-shadow-lg' : ''} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </nav>

            <div className="p-4 border-t border-[#E5E7EB] text-center text-xs text-[#6B7280]">
              <div className="mb-2">Last updated</div>
              <div className="text-[#00B56A] font-mono">2&nbsp;min&nbsp;ago</div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
