// components/overview/DashboardHeader.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Icon from '@/components/AppIcon';
import { getMyPreferences, updateMyPreferences, getMyProfile } from '@/services/profile.service';
import { applyLanguage, applyTheme } from '@/contexts/ThemeLanguageProvider';

export interface DashboardHeaderProps {
  onExport: (format: string) => Promise<void>;
  onRefresh: () => Promise<void>;
  lastUpdated: string | Date;
  userName?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onExport,
  onRefresh,
  lastUpdated,
  userName,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [prefs, setPrefs] = useState<{ theme?: 'light'|'dark'|'auto'; language?: 'vi'|'en'|'zh' }>({});
  const [isSavingPref, setIsSavingPref] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [displayName, setDisplayName] = useState<string | undefined>(userName);

  // Sync displayName with prop changes
  useEffect(() => {
    setDisplayName(userName);
  }, [userName]);

  // Load current preferences once
  useEffect(() => {
    (async () => {
      try {
        const p = await getMyPreferences();
        setPrefs(p || {});
      } catch {
        // ignore if not set yet
      }
    })();
  }, []);

  // Fetch user profile name if not provided by prop; and subscribe to profile updates
  useEffect(() => {
    let mounted = true;
    async function fetchName() {
      try {
        const prof = await getMyProfile();
        if (!mounted) return;
        const full = (prof.full_name || '').trim();
        const name = full || (prof.email || '').trim() || undefined;
        setDisplayName(name);
      } catch {
        // ignore
      }
    }

    if (!userName) fetchName();

    const onUpdated = () => fetchName();
    window.addEventListener('profile:updated', onUpdated as any);
    return () => {
      mounted = false;
      window.removeEventListener('profile:updated', onUpdated as any);
    };
  }, [userName]);

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

  const handleSetPref = async (key: 'theme'|'language', value: 'light'|'dark'|'auto'|'vi'|'en'|'zh') => {
    // Optimistic UI
    const next = { ...prefs, [key]: value } as any;
    setPrefs(next);
    // Apply immediately to UI
    if (key === 'theme') applyTheme(value as any);
    if (key === 'language') applyLanguage(value as any);
    setIsSavingPref(true);
    try {
      await updateMyPreferences({ [key]: value } as any);
    } catch {
      // rollback if needed (optional)
    } finally {
      setIsSavingPref(false);
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
          {displayName ? (
            <div className="text-sm text-[#374151] mt-1 truncate" title={displayName}>
              Welcome, {displayName}
            </div>
          ) : null}
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

          {/* Settings dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSettingsOpen((v) => !v)}
              className="
                flex items-center gap-2 px-4 h-10 rounded-lg
                text-sm font-medium text-[#374151]
                border border-[#E5E7EB] bg-white
                hover:bg-[#F3F4F6] transition
              "
              aria-expanded={isSettingsOpen}
              aria-haspopup="menu"
            >
              <Icon name="Settings" size={16} />
              <span className="hidden sm:inline">Settings</span>
              <Icon name="ChevronDown" size={14} />
            </button>

            <div
              className={`
                absolute right-0 top-full mt-2 w-64
                bg-white border border-[#E5E7EB] rounded-lg
                shadow-[0_10px_24px_rgba(0,0,0,0.10)]
                transition-all duration-150 z-10
                ${isSettingsOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
              `}
              role="menu"
            >
              <div className="p-3">
                <div className="text-xs font-semibold text-[#6B7280] px-1 mb-1">Theme</div>
                <div className="flex gap-2 mb-3">
                  {(['light','dark','auto'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => handleSetPref('theme', t)}
                      className={`px-3 h-8 rounded border text-sm ${
                        prefs.theme === t ? 'bg-[#F3F4F6] border-[#D1D5DB]' : 'bg-white border-[#E5E7EB]'
                      }`}
                      disabled={isSavingPref}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="text-xs font-semibold text-[#6B7280] px-1 mb-1">Language</div>
                <div className="flex gap-2">
                  {(['vi','en','zh'] as const).map((lng) => (
                    <button
                      key={lng}
                      onClick={() => handleSetPref('language', lng)}
                      className={`px-3 h-8 rounded border text-sm capitalize ${
                        prefs.language === lng ? 'bg-[#F3F4F6] border-[#D1D5DB]' : 'bg-white border-[#E5E7EB]'
                      }`}
                      disabled={isSavingPref}
                    >
                      {lng}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
