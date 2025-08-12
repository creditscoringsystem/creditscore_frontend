// src/pages/dashboard/settings-dashboard/index.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';
import Icon from '@/components/AppIcon';
import GeneralSettings from './components/GeneralSettings';
import NotificationSettings from './components/NotificationSettings';
import SecuritySettings from './components/SecuritySettings';
import DataExportSettings from './components/DataExportSettings';

// Tab identifiers cho trang Settings
type TabKey = 'general' | 'notifications' | 'security' | 'data-export';

interface Tab {
  id: TabKey;
  label: string;
  icon: string;
  description: string;
}

export default function SettingsDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>('general');
  const [isLoading, setIsLoading] = useState(true);

  const tabs: Tab[] = [
    { id: 'general',       label: 'General',        icon: 'Settings', description: 'App preferences and theme' },
    { id: 'notifications', label: 'Notifications',  icon: 'Bell',     description: 'Notification channels & rules' },
    { id: 'security',      label: 'Security',       icon: 'Shield',   description: 'Password, 2FA, sessions' },
    { id: 'data-export',   label: 'Data Export',    icon: 'Download', description: 'Export formats & schedules' },
  ];

  const tabContent: Record<TabKey, React.ReactNode> = {
    general: <GeneralSettings />,
    notifications: <NotificationSettings />,
    security: <SecuritySettings />,
    'data-export': <DataExportSettings />,
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        {/* Truyền props tối thiểu cho Sidebar để qua type-check */}
        <Sidebar isOpen={false} onClose={() => {}} />
        <div className="flex-1 ml-80">
          <Header />
          <main className="pt-20 px-6 py-8">
            <div className="h-48 bg-muted rounded-lg animate-pulse" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Truyền props tối thiểu cho Sidebar để qua type-check */}
      <Sidebar isOpen={false} onClose={() => {}} />
      <div className="flex-1 ml-80">
        <Header />
        <main className="pt-20 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-foreground mb-2">Settings</h1>
              <p className="text-muted-foreground">
                Manage your application preferences and account settings
              </p>
            </div>

            {/* Tabs Container */}
            <div className="bg-card rounded-lg border border-border shadow-elevation-2 neon-border-glow">
              {/* Local tabs nav (giữ style tương tự TabNavigation) */}
              <div className="sticky top-20 z-40 bg-background border-b border-border">
                <div className="px-6">
                  <nav className="flex space-x-1" role="tablist">
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`${tab.id}-panel`}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-smooth ${
                          activeTab === tab.id
                            ? 'border-primary text-primary bg-primary/5'
                            : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                        }`}
                        title={tab.description}
                      >
                        <Icon
                          name={tab.icon}
                          size={18}
                          className={activeTab === tab.id ? 'text-primary' : 'text-current'}
                        />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Tab content */}
              <section
                id={`${activeTab}-panel`}
                role="tabpanel"
                aria-labelledby={activeTab}
                className="p-6"
              >
                {tabContent[activeTab]}
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
