'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';
import TabNavigation from '@/components/ui/TabNavigation';
import TabContentContainer from '@/components/ui/TabContentContainer';
import GeneralSettings from './components/GeneralSettings';
import NotificationSettings from './components/NotificationSettings';
import SecuritySettings from './components/SecuritySettings';
import DataExportSettings from './components/DataExportSettings';

// Tab identifiers
type TabKey = 'general' | 'notifications' | 'security' | 'data-export';

interface Tab {
  id: TabKey;
  label: string;
  icon: string;
}

export default function SettingsDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>('general');
  const [isLoading, setIsLoading] = useState(true);

  const tabs: Tab[] = [
    { id: 'general', label: 'General', icon: 'Settings' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'data-export', label: 'Data Export', icon: 'Download' },
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
        <Sidebar />
        <div className="flex-1 ml-80">
          <Header />
          <main className="pt-20 px-6 py-8">
            {/* Loading skeleton (optional) */}
            <div className="h-48 bg-muted rounded-lg animate-pulse" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
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
              <TabNavigation
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                className="border-b border-border"
              />
              <TabContentContainer tabId={activeTab}>
                {tabContent[activeTab]}
              </TabContentContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
