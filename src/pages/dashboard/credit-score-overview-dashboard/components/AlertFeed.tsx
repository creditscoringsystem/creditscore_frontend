// components/alert/AlertFeed.tsx
// Next.js + TypeScript – design đẹp + đầy đủ hành vi

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/AppIcon';

/* ---------- kiểu dữ liệu nguyên bản ---------- */
export type Severity = 'high' | 'medium' | 'low' | 'info';
export type AlertType =
  | 'score_change'
  | 'new_account'
  | 'payment_due'
  | 'utilization'
  | 'inquiry'
  | string;

export interface AlertItem {
  id: string | number;
  title: string;
  message: string;
  severity: Severity;
  type: AlertType;
  timestamp: string | Date;
  read?: boolean;
  actionable?: boolean;
  details?: string;
  recommendation?: string;
}

interface AlertFeedProps {
  alerts: AlertItem[];
}

/* ---------- palette ép cứng ---------- */
const C = {
  card: '#FFFFFF',
  border: '#E5E7EB',
  fg: '#0F172A',
  muted: '#6B7280',
  neon: '#12F7A0',
  shadow: '0 8px 24px rgba(15,23,42,0.06)',
  track: '#F5F7FA',
};

const sevPillCls = (s: Severity) => {
  switch (s) {
    case 'high':
      return 'text-[#EF4444] bg-[rgba(239,68,68,0.12)]';
    case 'medium':
      return 'text-[#F59E0B] bg-[rgba(245,158,11,0.14)]';
    case 'low':
      return 'text-[#10B981] bg-[rgba(16,185,129,0.12)]';
    case 'info':
    default:
      return 'text-[#12F7A0] bg-[rgba(18,247,160,0.14)]';
  }
};

const iconRing = (s: Severity) => {
  switch (s) {
    case 'high':
      return 'ring-1 ring-[rgba(239,68,68,0.25)]';
    case 'medium':
      return 'ring-1 ring-[rgba(245,158,11,0.25)]';
    case 'low':
      return 'ring-1 ring-[rgba(16,185,129,0.25)]';
    case 'info':
    default:
      return 'ring-1 ring-[rgba(18,247,160,0.25)]';
  }
};

const typeIcon = (t: AlertType) => {
  switch (t) {
    case 'score_change':
      return 'TrendingUp';
    case 'new_account':
      return 'Plus';
    case 'payment_due':
      return 'Clock';
    case 'utilization':
      return 'CreditCard';
    case 'inquiry':
      return 'Search';
    default:
      return 'Bell';
  }
};

const timeAgo = (ts: string | Date) => {
  const now = new Date();
  const t = new Date(ts);
  const diffM = Math.max(0, Math.floor((now.getTime() - t.getTime()) / 60000));
  if (diffM < 60) return `${diffM}m ago`;
  if (diffM < 1440) return `${Math.floor(diffM / 60)}h ago`;
  return `${Math.floor(diffM / 1440)}d ago`;
};

/* ---------- component ---------- */
const AlertFeed: React.FC<AlertFeedProps> = ({ alerts }) => {
  // copy local để thao tác UI (mark read, dismiss, reveal)
  const [items, setItems] = useState<AlertItem[]>(alerts);
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(
    Math.min(3, alerts.length),
  );

  // nếu props đổi -> đồng bộ lại state + reset visibleCount về 3
  useEffect(() => {
    setItems(alerts);
    setVisibleCount(Math.min(3, alerts.length));
    setExpandedId(null);
  }, [alerts]);

  const unreadCount = useMemo(
    () => items.filter(a => !a.read).length,
    [items],
  );

  const displayed = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount],
  );

  /* ---------- actions ---------- */
  const mark = (id: string | number, action: 'mark_read' | 'dismiss' | 'resolve') => {
    if (action === 'mark_read') {
      setItems(prev => prev.map(a => (a.id === id ? { ...a, read: true } : a)));
    } else if (action === 'dismiss') {
      setItems(prev => {
        const next = prev.filter(a => a.id !== id);
        // giữ visibleCount hợp lệ
        return next;
      });
      setVisibleCount(v => v > 0 ? Math.min(v, items.length - 1) : 0);
      if (expandedId === id) setExpandedId(null);
    } else {
      // resolve: tuỳ nghiệp vụ; demo log
      console.log(`Alert ${id}: resolve`);
    }
  };

  const toggleExpanded = (id: string | number) =>
    setExpandedId(expandedId === id ? null : id);

  const toggleViewMore = () => {
    if (visibleCount < items.length) {
      setVisibleCount(items.length);
    } else {
      setVisibleCount(Math.min(3, items.length));
      setExpandedId(null);
    }
  };

  return (
    <section
      className="rounded-2xl border overflow-hidden"
      style={{ background: C.card, borderColor: C.border, boxShadow: C.shadow }}
    >
      {/* Header */}
      <header
        className="px-6 py-5 border-b flex items-center justify-between"
        style={{ borderColor: C.border }}
      >
        <div>
          <h3 className="text-[18px] font-semibold" style={{ color: C.fg }}>
            Recent Alerts
          </h3>
          <p className="text-sm" style={{ color: C.muted }}>
            Latest notifications and updates
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: C.muted }}>
            {unreadCount} unread
          </span>

          {/* Settings -> link thẳng */}
          <Link
            href="/dashboard/alert-management-dashboard"
            className="p-2 rounded-lg hover:opacity-80"
            style={{ background: C.track, color: C.fg }}
            aria-label="Alert settings"
          >
            <Icon name="Settings" size={16} />
          </Link>
        </div>
      </header>

      {/* List */}
      <div className="max-h-96 overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Bell" size={28} className="mx-auto mb-3" style={{ color: C.muted }} />
            <p className="text-sm" style={{ color: C.muted }}>
              No recent alerts
            </p>
          </div>
        ) : (
          <ul className="divide-y" style={{ borderColor: C.border }}>
            {displayed.map(a => {
              const isOpen = expandedId === a.id;
              return (
                <li
                  key={a.id}
                  className={`group px-5 py-4 transition-colors ${
                    !a.read ? 'bg-[rgba(18,247,160,0.05)]' : 'bg-white'
                  } hover:bg-[rgba(15,23,42,0.015)]`}
                >
                  <div className="flex items-start gap-4">
                    {/* icon */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconRing(
                        a.severity,
                      )} bg-white`}
                    >
                      <Icon
                        name={typeIcon(a.type)}
                        size={18}
                        className={
                          a.severity === 'high'
                            ? 'text-[#EF4444]'
                            : a.severity === 'medium'
                            ? 'text-[#F59E0B]'
                            : a.severity === 'low'
                            ? 'text-[#10B981]'
                            : 'text-[#12F7A0]'
                        }
                      />
                    </div>

                    {/* content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-[15px] font-semibold truncate" style={{ color: C.fg }}>
                          {a.title}
                        </h4>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2 py-1 rounded-full text-[11px] font-medium ${sevPillCls(
                              a.severity,
                            )}`}
                          >
                            {a.severity}
                          </span>
                          <span className="text-xs" style={{ color: C.muted }}>
                            {timeAgo(a.timestamp)}
                          </span>
                        </div>
                      </div>

                      <p className="mt-1 text-sm line-clamp-2" style={{ color: C.muted }}>
                        {a.message}
                      </p>

                      {/* details */}
                      {isOpen && (a.details || a.recommendation) && (
                        <div
                          className="mt-3 rounded-lg p-3"
                          style={{ background: C.track, border: `1px solid ${C.border}` }}
                        >
                          {a.details && (
                            <p className="text-sm" style={{ color: C.fg }}>
                              {a.details}
                            </p>
                          )}
                          {a.recommendation && (
                            <div className="mt-2 pl-3 border-l-2" style={{ borderColor: C.neon }}>
                              <p className="text-sm">
                                <span className="font-medium" style={{ color: C.fg }}>
                                  Recommendation:
                                </span>{' '}
                                {a.recommendation}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* actions row */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {a.actionable && (
                            <button
                              onClick={() => mark(a.id, 'resolve')}
                              className="text-xs font-medium hover:opacity-80"
                              style={{ color: C.neon }}
                            >
                              Take Action
                            </button>
                          )}

                          <button
                            onClick={() => toggleExpanded(a.id)}
                            className="text-xs hover:opacity-80"
                            style={{ color: C.muted }}
                            aria-expanded={isOpen}
                          >
                            {isOpen ? 'Show Less' : 'Show More'}
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          {!a.read && (
                            <button
                              onClick={() => mark(a.id, 'mark_read')}
                              className="text-xs hover:opacity-80"
                              style={{ color: C.muted }}
                            >
                              Mark as Read
                            </button>
                          )}
                          <button
                            onClick={() => mark(a.id, 'dismiss')}
                            className="p-1 rounded-md hover:bg-[rgba(15,23,42,0.04)]"
                            aria-label="Dismiss"
                          >
                            <Icon name="X" size={14} className="align-middle" style={{ color: C.muted }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer – View more / less */}
      {items.length > 3 && (
        <footer
          className="px-4 py-4 border-t text-center"
          style={{ borderColor: C.border, background: '#FAFAFB' }}
        >
          <button
            className="text-sm font-semibold hover:opacity-90"
            style={{ color: C.neon }}
            onClick={toggleViewMore}
          >
            {visibleCount < items.length ? 'View More Alerts' : 'Show Less'}
          </button>
        </footer>
      )}
    </section>
  );
};

export default AlertFeed;
