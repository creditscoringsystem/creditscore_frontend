// components/overview/DashboardHeader.tsx
// TypeScript + Next.js – không đổi UI, chỉ thêm type & alias import.

import React, { useState } from 'react';
import Icon from '@/components/AppIcon';

/* ---------- props ---------- */
export interface DashboardHeaderProps {
  /** Hàm export – truyền format ('pdf' | 'csv' | 'excel' …) */
  onExport: (format: string) => Promise<void>;
  /** Hàm refresh dữ liệu */
  onRefresh: () => Promise<void>;
  /** ISO time-stamp lần cập nhật cuối */
  lastUpdated: string | Date;
}

/* ---------- component ---------- */
const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onExport,
  onRefresh,
  lastUpdated,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  /* actions -------------------------------------------------- */
  const handleExport = async (format: string) => {
    setIsExporting(true);
    try {
      await onExport(format);
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatLastUpdated = (ts: string | Date) =>
    new Date(ts).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  /* render --------------------------------------------------- */
  return (
    <section className="bg-card rounded-lg border border-border p-6 shadow-elevation-1 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* title + status */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Credit Score Overview
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">
                Last updated: {formatLastUpdated(lastUpdated)}
              </span>
            </div>
          </div>
        </div>

        {/* actions */}
        <div className="flex items-center gap-3">
          {/* refresh */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition disabled:opacity-50"
          >
            <Icon
              name="RefreshCw"
              size={16}
              className={isRefreshing ? 'animate-spin' : ''}
            />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          {/* export dropdown */}
          <div className="relative group">
            <button
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
            >
              <Icon name="Download" size={16} />
              <span>{isExporting ? 'Exporting...' : 'Export'}</span>
              <Icon name="ChevronDown" size={14} />
            </button>

            {/* menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-elevation-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="py-2">
                {['pdf', 'csv', 'excel'].map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => handleExport(fmt)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition"
                  >
                    <Icon
                      name={
                        fmt === 'pdf'
                          ? 'FileText'
                          : fmt === 'csv'
                          ? 'Table'
                          : 'Sheet'
                      }
                      size={16}
                    />
                    <span>
                      Export as {fmt === 'pdf' ? 'PDF' : fmt.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* settings */}
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition">
            <Icon name="Settings" size={16} />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>

      {/* quick stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '+12', label: 'Points This Month', color: 'text-success' },
            { value: '23%', label: 'Credit Utilization' },
            { value: '8', label: 'Active Accounts' },
            { value: '0', label: 'Missed Payments' },
          ].map(stat => (
            <div className="text-center" key={stat.label}>
              <div
                className={`text-lg font-semibold ${
                  stat.color ?? 'text-foreground'
                }`}
              >
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DashboardHeader;
