// components/alert/AlertFeed.tsx
// Next.js + TypeScript – GIỮ NGUYÊN layout & class Tailwind

import React, { useState } from 'react';
import Icon from '@/components/AppIcon';

/* ---------- kiểu dữ liệu ---------- */
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

/* ---------- props ---------- */
interface AlertFeedProps {
  alerts: AlertItem[];
}

/* ---------- component ---------- */
const AlertFeed: React.FC<AlertFeedProps> = ({ alerts }) => {
  const [expandedAlert, setExpandedAlert] = useState<string | number | null>(
    null,
  );

  /* helper -------------------------------------------------- */
  const getSeverityColor = (sev: Severity | undefined) => {
    switch (sev) {
      case 'high':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'medium':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'low':
        return 'text-accent bg-accent/10 border-accent/20';
      case 'info':
        return 'text-primary bg-primary/10 border-primary/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getTypeIcon = (type: AlertType) => {
    switch (type) {
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

  const formatTimeAgo = (ts: string | Date) => {
    const now = new Date();
    const t = new Date(ts);
    const diffM = Math.floor((now.getTime() - t.getTime()) / 60000);

    if (diffM < 60) return `${diffM}m ago`;
    if (diffM < 1440) return `${Math.floor(diffM / 60)}h ago`;
    return `${Math.floor(diffM / 1440)}d ago`;
  };

  /* actions ------------------------------------------------- */
  const handleAlertAction = (id: string | number, action: string) => {
    // TODO – call API hoặc context
    console.log(`Alert ${id}: ${action}`);
  };

  const toggleExpanded = (id: string | number) =>
    setExpandedAlert(expandedAlert === id ? null : id);

  /* render -------------------------------------------------- */
  return (
    <section className="bg-card rounded-lg border border-border shadow-elevation-1">
      {/* header */}
      <header className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Recent Alerts
            </h3>
            <p className="text-sm text-muted-foreground">
              Latest notifications and updates
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {alerts.filter(a => !a.read).length} unread
            </span>
            <button className="text-primary hover:text-primary/80 transition">
              <Icon name="Settings" size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* list */}
      <div className="max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="p-6 text-center">
            <Icon
              name="Bell"
              size={32}
              className="text-muted-foreground mx-auto mb-3"
            />
            <p className="text-muted-foreground">No recent alerts</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={`p-4 hover:bg-muted/50 transition ${
                  !alert.read ? 'bg-primary/5' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* icon */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center border ${getSeverityColor(
                      alert.severity,
                    )}`}
                  >
                    <Icon name={getTypeIcon(alert.type)} size={16} />
                  </div>

                  {/* content */}
                  <div className="flex-1 min-w-0">
                    {/* title row */}
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {alert.title}
                      </h4>
                      <div className="flex items-center gap-2 ml-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(
                            alert.severity,
                          )}`}
                        >
                          {alert.severity}
                        </span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTimeAgo(alert.timestamp)}
                        </span>
                      </div>
                    </div>

                    {/* message preview */}
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {alert.message}
                    </p>

                    {/* expanded details */}
                    {expandedAlert === alert.id && alert.details && (
                      <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm text-foreground">
                          {alert.details}
                        </p>
                        {alert.recommendation && (
                          <div className="mt-2 p-2 bg-accent/10 rounded border-l-2 border-accent">
                            <p className="text-sm">
                              <strong>Recommendation:</strong>{' '}
                              {alert.recommendation}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* actions */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        {alert.actionable && (
                          <>
                            <button
                              onClick={() =>
                                handleAlertAction(alert.id, 'resolve')
                              }
                              className="text-xs text-primary hover:text-primary/80 transition"
                            >
                              Take Action
                            </button>
                            <span className="text-xs text-muted-foreground">
                              •
                            </span>
                          </>
                        )}

                        <button
                          onClick={() => toggleExpanded(alert.id)}
                          className="text-xs text-muted-foreground hover:text-foreground transition"
                        >
                          {expandedAlert === alert.id
                            ? 'Show Less'
                            : 'Show More'}
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        {!alert.read && (
                          <button
                            onClick={() =>
                              handleAlertAction(alert.id, 'mark_read')
                            }
                            className="text-xs text-muted-foreground hover:text-foreground transition"
                          >
                            Mark as Read
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleAlertAction(alert.id, 'dismiss')
                          }
                          className="text-muted-foreground hover:text-foreground transition"
                        >
                          <Icon name="X" size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* footer */}
      <footer className="p-4 border-t border-border">
        <button className="w-full text-sm font-medium text-primary hover:text-primary/80 transition">
          View All Alerts
        </button>
      </footer>
    </section>
  );
};

export default AlertFeed;
