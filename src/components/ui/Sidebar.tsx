'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Icon from '@/components/AppIcon';
import { motion, AnimatePresence } from 'framer-motion';

type NavItem = {
  label: string;
  path: string;
  icon: string;
  description: string;
};

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  const navigationItems: NavItem[] = [
    { label: 'Overview',  path: '/dashboard/credit-score-overview-dashboard',      icon: 'BarChart3', description: 'Credit score monitoring and trends' },
    { label: 'Analysis',  path: '/dashboard/credit-factor-analysis-dashboard',    icon: 'PieChart',    description: 'Factor breakdown and insights' },
    { label: 'Simulator', path: '/dashboard/what-if-scenario-simulator-dashboard', icon: 'Calculator',  description: 'What-if scenario modeling' },
    { label: 'Alerts',    path: '/dashboard/alert-management-dashboard',          icon: 'Bell',        description: 'Notification management' },
    { label: 'Settings',  path: '/dashboard/settings-dashboard',                  icon: 'Settings',    description: 'Application preferences' },
    { label: 'Profile',   path: '/dashboard/profile-management-dashboard',        icon: 'User',        description: 'User profile management' },
    { label: 'Help',      path: '/dashboard/help-dashboard',                      icon: 'HelpCircle',  description: 'Support and documentation' }
  ];

  const isActivePath = (path: string) => router.pathname === path;
  const handleNavigation = (path: string) => void router.push(path);

  return (
    <motion.aside
      initial={{ width: 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 bottom-0 z-40 bg-card border-r border-border shadow-elevation-2 flex flex-col"
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-border">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center neon-glow">
                <Icon name="TrendingUp" size={24} color="#0F0F0F" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold text-foreground">CreditScore</h1>
                <span className="text-sm text-muted-foreground font-medium">Analytics</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-smooth"
        >
          <Icon name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-auto">
        <div className="space-y-2">
          {navigationItems.map(item => (
            <motion.button
              key={item.path}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNavigation(item.path)}
              className={
                `w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-smooth ` +
                (isActivePath(item.path)
                  ? 'bg-primary text-primary-foreground neon-glow shadow-elevation-2'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted')
              }
              title={isCollapsed ? item.label : item.description}
            >
              <Icon
                name={item.icon}
                size={20}
                className={isActivePath(item.path) ? 'drop-shadow-lg' : ''}
              />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-xs text-muted-foreground"
            >
              <div className="mb-2">Last updated</div>
              <div className="text-primary font-mono">2&nbsp;min&nbsp;ago</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
