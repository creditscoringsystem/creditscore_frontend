// components/overview/KeyMetricsCards.tsx
// TypeScript – bố cục & Tailwind giữ nguyên.

import React from 'react';
import Icon from '@/components/AppIcon';

/* ---------- types ---------- */
interface Metrics {
  monthlyChange: number;       // (+/-) points
  utilizationRate: number;     // %
  utilizationChange: number;   // +/- %
  daysSinceUpdate: number;     // số ngày (0 = today)
}

interface KeyMetricsCardsProps {
  metrics: Metrics;
}

/* ---------- component ---------- */
const KeyMetricsCards: React.FC<KeyMetricsCardsProps> = ({ metrics }) => {
  /* helpers -------------------------------------------------- */
  const getChangeColor = (val: number) =>
    val > 0
      ? 'text-success'
      : val < 0
      ? 'text-destructive'
      : 'text-muted-foreground';

  const getChangeIcon = (val: number) =>
    val > 0 ? 'TrendingUp' : val < 0 ? 'TrendingDown' : 'Minus';

  const formatUtilization = (rate: number) => `${rate}%`;

  const formatDays = (d: number) =>
    d === 0 ? 'Today' : d === 1 ? '1 day ago' : `${d} days ago`;

  /* render --------------------------------------------------- */
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1 ─ Monthly change */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-elevation-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={20} className="text-primary" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Monthly Change
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-foreground">
            {metrics.monthlyChange > 0 ? '+' : ''}
            {metrics.monthlyChange}
          </span>
          <div
            className={`flex items-center ${getChangeColor(
              metrics.monthlyChange,
            )}`}
          >
            <Icon name={getChangeIcon(metrics.monthlyChange)} size={16} />
            <span className="text-sm ml-1">points</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-2">vs. last month</p>
      </div>

      {/* 2 ─ Utilization */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-elevation-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="CreditCard" size={20} className="text-accent" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Credit Utilization
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-foreground">
            {formatUtilization(metrics.utilizationRate)}
          </span>
          <div
            className={`flex items-center ${getChangeColor(
              metrics.utilizationChange,
            )}`}
          >
            <Icon name={getChangeIcon(metrics.utilizationChange)} size={16} />
            <span className="text-sm ml-1">
              {Math.abs(metrics.utilizationChange)}%
            </span>
          </div>
        </div>

        {/* bar */}
        <div className="mt-3">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                metrics.utilizationRate <= 30
                  ? 'bg-success'
                  : metrics.utilizationRate <= 50
                  ? 'bg-warning'
                  : 'bg-destructive'
              }`}
              style={{ width: `${Math.min(metrics.utilizationRate, 100)}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Recommended:&nbsp;&lt; 30%
          </p>
        </div>
      </div>

      {/* 3 ─ Last update */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-elevation-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Icon name="RefreshCw" size={20} className="text-secondary" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Last Update
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-foreground">
            {metrics.daysSinceUpdate}
          </span>
          <span className="text-sm text-muted-foreground">
            {metrics.daysSinceUpdate === 1 ? 'day' : 'days'}
          </span>
        </div>

        <p className="text-sm text-muted-foreground mt-2">
          {formatDays(metrics.daysSinceUpdate)}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-xs text-success">Data is current</span>
        </div>
      </div>
    </div>
  );
};

export default KeyMetricsCards;
