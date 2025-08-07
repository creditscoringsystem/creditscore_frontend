// pages/alert-management-dashboard/components/AlertFilters.tsx
// Next.js + TypeScript — layout preserved
'use client';
import React, { ChangeEvent, useState } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';

// Define the filter state type
export type AlertFiltersState = {
  type: string;
  severity: string;
  status: string;
  timeRange: string;
  startDate?: string;
  endDate?: string;
};

interface AlertFiltersProps {
  filters: AlertFiltersState;
  onFiltersChange: (next: AlertFiltersState) => void;
  onClearFilters: () => void;
}

const AlertFilters: React.FC<AlertFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const alertTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'score_change', label: 'Score Changes' },
    { value: 'new_account', label: 'New Accounts' },
    { value: 'utilization_spike', label: 'Utilization Spikes' },
    { value: 'payment_issue', label: 'Payment Issues' },
    { value: 'inquiry_alert', label: 'Credit Inquiries' },
    { value: 'account_closure', label: 'Account Closures' },
  ];

  const severityOptions = [
    { value: 'all', label: 'All Severities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'new', label: 'New' },
    { value: 'acknowledged', label: 'Acknowledged' },
    { value: 'investigating', label: 'Investigating' },
    { value: 'resolved', label: 'Resolved' },
  ];

  const timeRangeOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: 'custom', label: 'Custom Range' },
  ];

  const handleFilterChange = (key: keyof AlertFiltersState, value: any) =>
    onFiltersChange({ ...filters, [key]: value });

  const activeFilterCount = [
    filters.type !== 'all',
    filters.severity !== 'all',
    filters.status !== 'all',
    filters.timeRange !== '30d',
  ].filter(Boolean).length;

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      {/* header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
            onClick={() => setIsExpanded(p => !p)}
            className="md:hidden text-muted-foreground hover:text-foreground"
          />
        </div>
      </div>

      {/* content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} md:block`}>
        <div className="p-4 space-y-4">
          {/* quick buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.severity === 'critical' ? 'destructive' : 'outline'}
              size="sm"
              iconName="AlertTriangle"
              onClick={() =>
                handleFilterChange('severity', filters.severity === 'critical' ? 'all' : 'critical')
              }
            >
              Critical
            </Button>

            <Button
              variant={filters.status === 'new' ? 'secondary' : 'outline'}
              size="sm"
              iconName="Bell"
              onClick={() =>
                handleFilterChange('status', filters.status === 'new' ? 'all' : 'new')
              }
            >
              New
            </Button>

            <Button
              variant={filters.type === 'score_change' ? 'secondary' : 'outline'}
              size="sm"
              iconName="TrendingDown"
              onClick={() =>
                handleFilterChange('type', filters.type === 'score_change' ? 'all' : 'score_change')
              }
            >
              Score Changes
            </Button>
          </div>

          {/* selects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Alert Type"
              options={alertTypeOptions}
              value={filters.type}
              onChange={v => handleFilterChange('type', v)}
              className="w-full"
            />

            <Select
              label="Severity"
              options={severityOptions}
              value={filters.severity}
              onChange={v => handleFilterChange('severity', v)}
              className="w-full"
            />

            <Select
              label="Status"
              options={statusOptions}
              value={filters.status}
              onChange={v => handleFilterChange('status', v)}
              className="w-full"
            />

            <Select
              label="Time Range"
              options={timeRangeOptions}
              value={filters.timeRange}
              onChange={v => handleFilterChange('timeRange', v)}
              className="w-full"
            />
          </div>

          {/* custom dates */}
          {filters.timeRange === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border">
              {(['startDate', 'endDate'] as const).map(field => (
                <div key={field}>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {field === 'startDate' ? 'Start Date' : 'End Date'}
                  </label>
                  <input
                    type="date"
                    value={(filters as any)[field] ?? ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleFilterChange(field, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertFilters;
