'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface TabContentContainerProps {
  children: ReactNode;
  tabId?: 'overview' | 'analysis' | 'simulator' | 'alerts' | 'settings';
  className?: string;
}

const tabConfigs = {
  overview: {
    title: 'Credit Score Overview',
    description: 'Monitor your credit score trends and key metrics',
    gridClass: 'grid-cols-1 lg:grid-cols-3 xl:grid-cols-4',
  },
  analysis: {
    title: 'Factor Analysis',
    description: 'Detailed breakdown of credit score factors',
    gridClass: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3',
  },
  simulator: {
    title: 'Scenario Simulator',
    description: 'Model what-if scenarios for credit improvement',
    gridClass: 'grid-cols-1 lg:grid-cols-2',
  },
  alerts: {
    title: 'Alert Management',
    description: 'Manage notifications and monitoring preferences',
    gridClass: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3',
  },
  settings: {
    title: 'Settings',
    description: 'Manage your application preferences and account settings',
    gridClass: 'grid-cols-1 lg:grid-cols-2',
  },
  // Nếu còn tab khác, thêm ở đây...
};

const pathToTabMap: Record<string, keyof typeof tabConfigs> = {
  '/dashboard/credit-score-overview-dashboard': 'overview',
  '/dashboard/credit-factor-analysis-dashboard': 'analysis',
  '/dashboard/what-if-scenario-simulator-dashboard': 'simulator',
  '/dashboard/alert-management-dashboard': 'alerts',
  '/dashboard/settings-dashboard': 'settings',
  // Thêm mapping các route khác ở đây nếu cần
};

const TabContentContainer: React.FC<TabContentContainerProps> = ({
  children,
  tabId,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const getCurrentTabId = (): keyof typeof tabConfigs => {
    return pathToTabMap[pathname] || tabId || 'overview';
  };

  const currentTabId = getCurrentTabId();
  const currentConfig = tabConfigs[currentTabId];

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 150);
    return () => clearTimeout(timer);
  }, [currentTabId]);

  // Nếu không tìm thấy config tab, hiển thị thông báo
  if (!currentConfig) {
    return (
      <main className="pt-20 md:pt-32 pb-20 md:pb-6 px-6">
        <div className="max-w-3xl mx-auto text-center mt-24 p-10 border-2 border-green-100 rounded-xl">
          <h2 className="text-3xl font-bold text-red-500 mb-6">Tab Not Found</h2>
          <p>
            Route <span className="font-semibold text-black">{pathname}</span> chưa được mapping trong <b>tabConfigs</b>.
          </p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="pt-20 md:pt-32 pb-20 md:pb-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded-lg w-1/3 mb-2" />
            <div className="h-4 bg-muted rounded w-1/2 mb-8" />
            <div className={`grid gap-6 ${currentConfig.gridClass}`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card rounded-lg border border-border p-6"
                >
                  <div className="h-4 bg-muted rounded w-3/4 mb-4" />
                  <div className="h-32 bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`pt-20 md:pt-32 pb-20 md:pb-6 px-6 transition-data ${className}`}
      role="tabpanel"
      id={`${currentTabId}-panel`}
      aria-labelledby={`${currentTabId}-tab`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            {currentConfig.title}
          </h1>
          <p className="text-muted-foreground">{currentConfig.description}</p>
        </div>

        <div className={`grid gap-6 ${currentConfig.gridClass}`}>
          {children}
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span>Data updated 2 minutes ago</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Next update in 28 minutes</span>
              <button className="text-primary hover:text-primary/80 transition-smooth">
                Refresh now
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TabContentContainer;
