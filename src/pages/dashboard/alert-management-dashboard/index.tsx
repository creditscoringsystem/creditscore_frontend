// app/(dashboards)/alert-management-dashboard/page.tsx
// Next.js 13+ (app router) + TypeScript
// — original UI, data & logic kept the same —

'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';
import AlertFilters, { AlertFiltersState } from './components/AlertFilters';
import AlertCard, { AlertItem } from './components/AlertCard';
import BulkActions from './components/BulkActions';
import NotificationPreferences from './components/NotificationPreferences';
import AlertAnalytics from './components/AlertAnalytics';
import Icon from '@/components/AppIcon';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

/* ---------- mock data (unchanged) ---------- */
const mockAlerts /* : AlertItem[] */ = [/* … trimmed for brevity … */];
const mockAnalyticsData = { /* … same as before … */ };
const mockPreferences = { /* … same as before … */ };
/* ------------------------------------------ */

const AlertManagementDashboard: React.FC = () => {
  /* state */
  const [alerts, setAlerts] = useState<AlertItem[]>(mockAlerts);
  const [filteredAlerts, setFilteredAlerts] = useState<AlertItem[]>(mockAlerts);
  const [selectedAlerts, setSelectedAlerts] = useState<(string | number)[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'timestamp' | 'severity' | 'title'>(
    'timestamp',
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);

  /* filters */
  const [filters, setFilters] = useState<AlertFiltersState>({
    type: 'all',
    severity: 'all',
    status: 'all',
    timeRange: '30d',
    startDate: '',
    endDate: '',
  });

  /* simulate fetch-delay */
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1_000);
    return () => clearTimeout(t);
  }, []);

  /* apply search + filters + sort */
  useEffect(() => {
    let list = [...alerts];

    /* filters */
    if (filters.type !== 'all')
      list = list.filter(a => a.type === filters.type);
    if (filters.severity !== 'all')
      list = list.filter(a => a.severity === filters.severity);
    if (filters.status !== 'all')
      list = list.filter(a => a.status === filters.status);

    /* time range */
    if (filters.timeRange !== 'custom') {
      const limits: Record<string, number> = {
        '24h': 86_400_000,
        '7d': 604_800_000,
        '30d': 2_592_000_000,
        '90d': 7_776_000_000,
      };
      const ms = limits[filters.timeRange];
      list = list.filter(a => Date.now() - +new Date(a.timestamp) <= ms);
    }

    /* search */
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        a =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.affectedAccount.toLowerCase().includes(q),
      );
    }

    /* sort */
    list.sort((a: any, b: any) => {
      let A: any = a[sortBy];
      let B: any = b[sortBy];
      if (sortBy === 'timestamp') {
        A = new Date(A).getTime();
        B = new Date(B).getTime();
      }
      return sortOrder === 'asc' ? (A > B ? 1 : -1) : A < B ? 1 : -1;
    });

    setFilteredAlerts(list);
  }, [alerts, filters, searchQuery, sortBy, sortOrder]);

  /* single-alert actions */
  const patchAlerts = (
    ids: (string | number)[],
    status: 'new' | 'acknowledged' | 'investigating' | 'resolved'
  ) =>
    setAlerts(prev =>
      prev.map(a => (ids.includes(a.id) ? { ...a, status } : a)),
    );

  /* bulk */
  const handleBulkAction = (
    action: 'acknowledge' | 'investigate' | 'resolve' | 'delete' | 'export',
    ids: (string | number)[],
  ) => {
    switch (action) {
      case 'acknowledge':
        patchAlerts(ids, 'acknowledged');
        break;
      case 'investigate':
        patchAlerts(ids, 'investigating');
        break;
      case 'resolve':
        patchAlerts(ids, 'resolved');
        break;
      case 'delete':
        setAlerts(prev => prev.filter(a => !ids.includes(a.id)));
        break;
      case 'export':
        console.log('Export', ids);
    }
    setSelectedAlerts([]);
  };

  /* select helpers */
  const handleAlertSelect = (id: string | number, checked: boolean) =>
    setSelectedAlerts(s =>
      checked ? [...s, id] : s.filter(v => v !== id),
    );

  /* save prefs — mock */
  const handleSavePreferences = (p: any) =>
    console.log('Save prefs', p);

  /* ui — loading */
  if (isLoading)
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <div className="flex-1 ml-80">
          <Header />
          <main className="pt-20 px-6 py-8 flex flex-col items-center">
            <Icon name="Loader2" size={32} className="animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading alert data...</p>
          </main>
        </div>
      </div>
    );

  /* ui — dashboard */
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 ml-80">
        <Header />

        <main className="pt-20 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* header */}
            <header className="mb-8">
              <h1 className="text-3xl font-semibold text-foreground mb-2">
                Alert Management
              </h1>
              <p className="text-muted-foreground">
                Manage notifications and monitoring preferences
              </p>
            </header>

            <section className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {/* search & sort */}
              <div className="col-span-full mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <Input
                    type="search"
                    placeholder="Search alerts…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="flex-1 max-w-md"
                  />

                  <div className="flex items-center gap-3">
                    <select
                      value={`${sortBy}-${sortOrder}`}
                      onChange={e => {
                        const [f, o] = e.target.value.split('-');
                        setSortBy(f as any);
                        setSortOrder(o as any);
                      }}
                      className="px-3 py-2 border border-border rounded-lg bg-input text-foreground"
                    >
                      <option value="timestamp-desc">Newest First</option>
                      <option value="timestamp-asc">Oldest First</option>
                      <option value="severity-desc">Severity: High → Low</option>
                      <option value="severity-asc">Severity: Low → High</option>
                      <option value="title-asc">Title: A → Z</option>
                      <option value="title-desc">Title: Z → A</option>
                    </select>

                    <Button
                      variant="outline"
                      size="sm"
                      iconName="RefreshCw"
                      onClick={() => window.location.reload()}
                    >
                      Refresh
                    </Button>
                  </div>
                </div>
              </div>

              {/* filters */}
              <div className="col-span-full mb-6">
                <AlertFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClearFilters={() =>
                    setFilters({
                      type: 'all',
                      severity: 'all',
                      status: 'all',
                      timeRange: '30d',
                      startDate: '',
                      endDate: '',
                    })
                  }
                />
              </div>

              {/* bulk bar */}
              {selectedAlerts.length > 0 && (
                <div className="col-span-full mb-6">
                  <BulkActions
                    selectedAlerts={selectedAlerts}
                    totalAlerts={filteredAlerts.length}
                    onBulkAction={handleBulkAction}
                    onSelectAll={() =>
                      setSelectedAlerts(filteredAlerts.map(a => a.id))
                    }
                    onClearSelection={() => setSelectedAlerts([])}
                  />
                </div>
              )}

              {/* main grid */}
              <div className="col-span-full grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* feed */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">
                      Alert Feed ({filteredAlerts.length})
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span>Live updates enabled</span>
                    </div>
                  </div>

                  {filteredAlerts.length === 0 ? (
                    <div className="bg-card border border-border rounded-lg p-8 text-center">
                      <Icon
                        name="Bell"
                        size={48}
                        className="text-muted-foreground mx-auto mb-4"
                      />
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        No alerts found
                      </h3>
                      <p className="text-muted-foreground">
                        {searchQuery.trim() ||
                        filters.type !== 'all' ||
                        filters.severity !== 'all' ||
                        filters.status !== 'all'
                          ? 'Try adjusting your filters or search query.'
                          : 'All caught up! No new alerts at this time.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredAlerts.map(alert => (
                        <div key={alert.id} className="relative">
                          <input
                            type="checkbox"
                            className="absolute left-4 top-4 z-10 w-4 h-4"
                            checked={selectedAlerts.includes(alert.id)}
                            onChange={e =>
                              handleAlertSelect(alert.id, e.target.checked)
                            }
                          />
                          <div className="pl-10">
                            <AlertCard
                              alert={alert}
                              onAcknowledge={id =>
                                patchAlerts([id], 'acknowledged')
                              }
                              onInvestigate={id =>
                                patchAlerts([id], 'investigating')
                              }
                              onResolve={id => patchAlerts([id], 'resolved')}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* right column */}
                <div className="space-y-6">
                  <AlertAnalytics analyticsData={mockAnalyticsData} />
                </div>
              </div>

              {/* preferences */}
              <div className="col-span-full mt-8">
                <NotificationPreferences
                  preferences={mockPreferences as any}
                  onSave={handleSavePreferences}
                />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AlertManagementDashboard;
