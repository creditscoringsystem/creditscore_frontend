// pages/credit-factor-analysis-dashboard/components/FactorRankingTable.tsx
// Next.js + TypeScript – original UI/logic preserved

import React, { useState, useMemo } from 'react';
import Icon from '@/components/AppIcon';

/* ---------- types ---------- */
type Status = 'excellent' | 'very_good' | 'good' | 'fair' | 'poor';
type Priority = 'high' | 'medium' | 'low';
type Trend = 'up' | 'down' | 'flat';

interface FactorRow {
  id: string;
  name: string;
  currentScore: number;
  previousScore: number;
  impact: number;
  weight: number;
  trend: Trend;
  trendValue: number;
  status: Status;
  recommendation: string;
  targetValue: number;
  priority: Priority;
}

interface FactorRankingTableProps {
  timePeriod: 'monthly' | 'quarterly';
  onFactorSelect?: (factor: FactorRow) => void;
}

/* ---------- component ---------- */
const FactorRankingTable: React.FC<FactorRankingTableProps> = ({
  timePeriod,
  onFactorSelect,
}) => {
  const [sortBy, setSortBy] = useState<keyof FactorRow | 'trend'>('impact');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  /* mock rows */
  const factorData: FactorRow[] = useMemo(
    () => [
      {
        id: 'payment_history',
        name: 'Payment History',
        currentScore: 92,
        previousScore: 88,
        impact: 48,
        weight: 35,
        trend: 'up',
        trendValue: 4,
        status: 'excellent',
        recommendation: 'Maintain current payment schedule',
        targetValue: 95,
        priority: 'low',
      },
      {
        id: 'utilization',
        name: 'Credit Utilization',
        currentScore: 55,
        previousScore: 62,
        impact: 2,
        weight: 30,
        trend: 'up',
        trendValue: 7,
        status: 'good',
        recommendation: 'Keep utilization below 30%',
        targetValue: 45,
        priority: 'medium',
      },
      {
        id: 'credit_age',
        name: 'Credit Age',
        currentScore: 83,
        previousScore: 81,
        impact: 22,
        weight: 15,
        trend: 'up',
        trendValue: 2,
        status: 'very_good',
        recommendation: 'Keep old accounts open',
        targetValue: 90,
        priority: 'low',
      },
      {
        id: 'new_credit',
        name: 'New Credit',
        currentScore: 76,
        previousScore: 72,
        impact: 6,
        weight: 10,
        trend: 'up',
        trendValue: 4,
        status: 'good',
        recommendation: 'Limit new credit applications',
        targetValue: 85,
        priority: 'medium',
      },
      {
        id: 'credit_mix',
        name: 'Credit Mix',
        currentScore: 78,
        previousScore: 75,
        impact: 15,
        weight: 10,
        trend: 'up',
        trendValue: 3,
        status: 'good',
        recommendation: 'Consider diversifying credit types',
        targetValue: 85,
        priority: 'low',
      },
    ],
    [],
  );

  /* sorting */
  const sortedData = useMemo(() => {
    const rows = [...factorData];
    rows.sort((a, b) => {
      const aVal =
        sortBy === 'trend' ? a.trendValue : (a as any)[sortBy] as number;
      const bVal =
        sortBy === 'trend' ? b.trendValue : (b as any)[sortBy] as number;
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
    });
    return rows;
  }, [factorData, sortBy, sortOrder]);

  const handleSort = (field: keyof FactorRow | 'trend') => {
    if (sortBy === field) {
      setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  /* helpers */
  const getStatusClasses = (s: Status) =>
    ({
      excellent: 'text-emerald-600 bg-emerald-50',
      very_good: 'text-blue-600 bg-blue-50',
      good: 'text-green-600 bg-green-50',
      fair: 'text-yellow-600 bg-yellow-50',
      poor: 'text-red-600 bg-red-50',
    }[s]);

  const getPriorityClasses = (p: Priority) =>
    ({
      high: 'text-red-600 bg-red-50',
      medium: 'text-yellow-600 bg-yellow-50',
      low: 'text-green-600 bg-green-50',
    }[p]);

  const SortButton = ({
    field,
    label,
  }: {
    field: keyof FactorRow | 'trend';
    label: string;
  }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-foreground transition"
    >
      {label}
      {sortBy === field && (
        <Icon
          name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'}
          size={14}
          className="text-primary"
        />
      )}
    </button>
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Factor Rankings
          </h3>
          <p className="text-sm text-muted-foreground">
            Current performance and improvement priorities
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span>Updated {timePeriod}</span>
        </div>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 px-2 text-sm font-medium text-left text-muted-foreground">
                <SortButton field="name" label="Factor" />
              </th>
              <th className="py-3 px-2 text-sm font-medium text-center text-muted-foreground">
                <SortButton field="currentScore" label="Score" />
              </th>
              <th className="py-3 px-2 text-sm font-medium text-center text-muted-foreground">
                <SortButton field="trend" label="Trend" />
              </th>
              <th className="py-3 px-2 text-sm font-medium text-center text-muted-foreground">
                <SortButton field="impact" label="Impact" />
              </th>
              <th className="py-3 px-2 text-sm font-medium text-center text-muted-foreground">
                <SortButton field="status" label="Status" />
              </th>
              <th className="py-3 px-2 text-sm font-medium text-center text-muted-foreground">
                Priority
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedData.map((f, i) => (
              <tr
                key={f.id}
                className="border-b border-border hover:bg-muted/50 cursor-pointer"
                onClick={() => onFactorSelect?.(f)}
              >
                {/* factor */}
                <td className="py-4 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex justify-center items-center">
                      <span className="text-sm font-semibold text-primary">
                        {i + 1}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{f.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Weight: {f.weight}%
                      </div>
                    </div>
                  </div>
                </td>

                {/* score */}
                <td className="py-4 px-2 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-semibold text-foreground">
                      {f.currentScore}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Target: {f.targetValue}
                    </span>
                  </div>
                </td>

                {/* trend */}
                <td className="py-4 px-2 text-center">
                  <span
                    className={`flex items-center justify-center gap-1 text-sm font-medium ${
                      f.trend === 'up'
                        ? 'text-emerald-600'
                        : f.trend === 'down'
                        ? 'text-red-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {f.trend === 'up' ? (
                      <Icon name="TrendingUp" size={16} />
                    ) : f.trend === 'down' ? (
                      <Icon name="TrendingDown" size={16} />
                    ) : (
                      <Icon name="Minus" size={16} />
                    )}
                    {(f.trend === 'up' && '+') ||
                      (f.trend === 'down' && '-')}{' '}
                    {f.trendValue}
                  </span>
                </td>

                {/* impact */}
                <td className="py-4 px-2 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-foreground">
                      +{f.impact}
                    </span>
                    <span className="text-xs text-muted-foreground">points</span>
                  </div>
                </td>

                {/* status */}
                <td className="py-4 px-2 text-center">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(
                      f.status,
                    )}`}
                  >
                    {{
                      excellent: 'Excellent',
                      very_good: 'Very Good',
                      good: 'Good',
                      fair: 'Fair',
                      poor: 'Poor',
                    }[f.status]}
                  </span>
                </td>

                {/* priority */}
                <td className="py-4 px-2 text-center">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityClasses(
                      f.priority,
                    )}`}
                  >
                    {f.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* summary */}
      <footer className="mt-6 pt-4 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-emerald-600">
            {
              sortedData.filter(
                f => f.status === 'excellent' || f.status === 'very_good',
              ).length
            }
          </div>
          <div className="text-sm text-muted-foreground">Strong Factors</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-yellow-600">
            {
              sortedData.filter(f => f.priority === 'medium' || f.priority === 'high')
                .length
            }
          </div>
          <div className="text-sm text-muted-foreground">Need Attention</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-primary">
            {sortedData.reduce((s, f) => s + f.impact, 0)}
          </div>
          <div className="text-sm text-muted-foreground">Total Impact</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-foreground">
            {Math.round(
              sortedData.reduce((s, f) => s + f.currentScore, 0) /
                sortedData.length,
            )}
          </div>
          <div className="text-sm text-muted-foreground">Avg Score</div>
        </div>
      </footer>
    </div>
  );
};

export default FactorRankingTable;
