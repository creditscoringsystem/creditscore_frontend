// components/overview/DashboardHeader.tsx
'use client';

import React, { useState } from 'react';
import Icon from '@/components/AppIcon';

export interface DashboardHeaderProps {
  onExport: (format: string) => Promise<void>;
  onRefresh: () => Promise<void>;
  lastUpdated: string | Date;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onExport,
  onRefresh,
  lastUpdated,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  return (
    <section
      className="
        rounded-xl border border-[#E5E7EB] bg-white
        shadow-[0_1px_2px_rgba(0,0,0,0.06),0_6px_18px_rgba(0,0,0,0.04)]
        p-6 md:p-7
      "
    >
      {/* Top row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Title + updated */}
        <div className="min-w-0">
          <h2 className="text-2xl md:text-[26px] font-semibold text-[#0F172A] tracking-[-0.015em]">
            Credit Score Overview
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
            <span className="text-sm text-[#6B7280]">
              Last updated: {formatLastUpdated(lastUpdated)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Refresh */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="
              flex items-center gap-2 px-4 h-10 rounded-lg
              text-sm font-medium text-[#374151]
              border border-[#E5E7EB] bg-white
              hover:bg-[#F3F4F6] transition
              disabled:opacity-60
            "
          >
            <Icon
              name="RefreshCw"
              size={16}
              className={isRefreshing ? 'animate-spin' : ''}
            />
            <span>{isRefreshing ? 'Refreshing…' : 'Refresh'}</span>
          </button>

          {/* Export dropdown (hover-to-open như bản gốc) */}
          <div className="relative group">
            <button
              disabled={isExporting}
              className="
                flex items-center gap-2 px-4 h-10 rounded-full
                text-sm font-semibold
                bg-[#00FF88] text-[#0F0F0F]
                shadow-[0_6px_16px_rgba(0,255,136,0.25)]
                hover:opacity-90 transition
                disabled:opacity-60
              "
            >
              <Icon name="Download" size={16} />
              <span>{isExporting ? 'Exporting…' : 'Export'}</span>
              <Icon name="ChevronDown" size={14} />
            </button>

            <div
              className="
                absolute right-0 top-full mt-2 w-48
                bg-white border border-[#E5E7EB] rounded-lg
                shadow-[0_10px_24px_rgba(0,0,0,0.10)]
                opacity-0 invisible
                group-hover:opacity-100 group-hover:visible
                transition-all duration-200 z-10
              "
            >
              <div className="py-2">
                {['pdf', 'csv', 'excel'].map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => handleExport(fmt)}
                    className="
                      w-full flex items-center gap-3 px-4 py-2
                      text-sm text-[#111827] hover:bg-[#F8FAFC]
                    "
                  >
                    <Icon
                      name={
                        fmt === 'pdf' ? 'FileText' : fmt === 'csv' ? 'Table' : 'Sheet'
                      }
                      size={16}
                      className="text-[#6B7280]"
                    />
                    <span>
                      Export as {fmt === 'pdf' ? 'PDF' : fmt.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Settings */}
          <button
            className="
              flex items-center gap-2 px-4 h-10 rounded-lg
              text-sm font-medium text-[#374151]
              border border-[#E5E7EB] bg-white
              hover:bg-[#F3F4F6] transition
            "
          >
            <Icon name="Settings" size={16} />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-5 border-t border-[#E5E7EB]" />

      {/* Quick stats */}
      <div className="pt-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              value: '+12',
              label: 'Points This Month',
              valueClass: 'text-[#00FF88]',
            },
            { value: '23%', label: 'Credit Utilization' },
            { value: '8', label: 'Active Accounts' },
            { value: '0', label: 'Missed Payments' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className={`
                  text-xl md:text-2xl font-semibold
                  ${stat.valueClass ?? 'text-[#0F172A]'}
                `}
              >
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-[#6B7280]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DashboardHeader;
