'use client';

import React from 'react';
import { useRouter } from 'next/router';
import Icon from '@/components/AppIcon';

type Tab = {
  id: 'overview' | 'analysis' | 'simulator' | 'alerts';
  label: string;
  path: string;
  icon: string;
  description: string;
};

interface TabNavigationProps {
  activeTab?: Tab['id'];
  onTabChange?: (tabId: Tab['id']) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const router = useRouter();

  const tabs: Tab[] = [
    {
      id: 'overview',
      label: 'Overview',
      path: '/dashboard/credit-score-overview-dashboard',
      icon: 'BarChart3',
      description: 'Credit score monitoring and trend visualization',
    },
    {
      id: 'analysis',
      label: 'Analysis',
      path: '/dashboard/credit-factor-analysis-dashboard',
      icon: 'PieChart',
      description: 'Deep factor breakdown and performance insights',
    },
    {
      id: 'simulator',
      label: 'Simulator',
      path: '/dashboard/what-if-scenario-simulator-dashboard',
      icon: 'Calculator',
      description: 'What-if scenario modeling and goal setting',
    },
    {
      id: 'alerts',
      label: 'Alerts',
      path: '/dashboard/alert-management-dashboard',
      icon: 'Bell',
      description: 'Centralized notification management',
    },
  ];

  const getCurrentTab = (): Tab['id'] => {
    const current = tabs.find(t => t.path === router.pathname);
    return current ? current.id : (activeTab ?? 'overview');
  };

  const currentActiveTab = getCurrentTab();

  const handleTabClick = (tab: Tab) => {
    onTabChange?.(tab.id);
    router.push(tab.path);
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block sticky top-20 z-40 bg-background border-b border-border">
        <div className="px-6">
          <nav className="flex space-x-1" role="tablist">
            {tabs.map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={currentActiveTab === tab.id}
                aria-controls={`${tab.id}-panel`}
                onClick={() => handleTabClick(tab)}
                className={`
                  flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-smooth
                  ${
                    currentActiveTab === tab.id
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }
                `}
                title={tab.description}
              >
                <Icon
                  name={tab.icon}
                  size={18}
                  className={
                    currentActiveTab === tab.id ? 'text-primary' : 'text-current'
                  }
                />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-elevation-3">
        <nav className="flex" role="tablist">
          {tabs.map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={currentActiveTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              onClick={() => handleTabClick(tab)}
              className={`
                flex-1 flex flex-col items-center justify-center py-3 px-2 transition-smooth
                ${
                  currentActiveTab === tab.id
                    ? 'text-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-foreground'
                }
              `}
              title={tab.description}
            >
              <Icon
                name={tab.icon}
                size={20}
                className={`mb-1 ${
                  currentActiveTab === tab.id ? 'text-primary' : 'text-current'
                }`}
              />
              <span className="text-xs font-medium">{tab.label}</span>
              {currentActiveTab === tab.id && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default TabNavigation;
