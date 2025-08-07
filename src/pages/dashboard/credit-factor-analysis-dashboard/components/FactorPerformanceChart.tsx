// pages/credit-factor-analysis-dashboard/components/FactorPerformanceChart.tsx
// Next.js + TypeScript – presentation & behaviour unchanged
'use client';
import { cn } from '@/utils/cn';
import Icon from '@/components/AppIcon';
import { FactorKey } from '@/types/factors';
import React, { useState, useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Icon from '@/components/AppIcon';

type FactorKey =
  | 'payment_history'
  | 'utilization'
  | 'credit_age'
  | 'new_credit'
  | 'credit_mix';

type PeriodData = Record<
  | 'period'
  | `${FactorKey}`
  | `${FactorKey}_impact`,
  string | number
>;

interface FactorPerformanceChartProps {
  /** not used for now – kept for API-compat */
  selectedFactors?: FactorKey[];
  timePeriod: 'monthly' | 'quarterly';
  benchmarkType: 'personal' | 'peer';
}

const FactorPerformanceChart: React.FC<FactorPerformanceChartProps> = ({
  timePeriod,
  benchmarkType,
}) => {
  const [activeFactors, setActiveFactors] = useState<FactorKey[]>([
    'payment_history',
    'utilization',
    'credit_age',
  ]);

  /* synthetic chart data */
  const chartData: PeriodData[] = useMemo(
    () =>
      (timePeriod === 'monthly'
        ? [
            /* …same monthly rows… */
            {
              period: 'Jan 2024',
              payment_history: 85,
              utilization: 72,
              credit_age: 78,
              new_credit: 65,
              credit_mix: 70,
              payment_impact: 35,
              utilization_impact: -15,
              age_impact: 12,
              new_impact: -8,
              mix_impact: 5,
            },
            /* … other months … */
            {
              period: 'Jun 2024',
              payment_history: 92,
              utilization: 55,
              credit_age: 83,
              new_credit: 76,
              credit_mix: 78,
              payment_impact: 48,
              utilization_impact: 2,
              age_impact: 22,
              new_impact: 6,
              mix_impact: 15,
            },
          ]
        : [
            /* quarterly rows */
            {
              period: 'Q1 2024',
              payment_history: 87,
              utilization: 68,
              credit_age: 79,
              new_credit: 67,
              credit_mix: 72,
              payment_impact: 38,
              utilization_impact: -11,
              age_impact: 14,
              new_impact: -5,
              mix_impact: 7,
            },
            {
              period: 'Q2 2024',
              payment_history: 90,
              utilization: 58,
              credit_age: 82,
              new_credit: 74,
              credit_mix: 77,
              payment_impact: 44,
              utilization_impact: -2,
              age_impact: 19,
              new_impact: 4,
              mix_impact: 13,
            },
          ]) as PeriodData[],
    [timePeriod],
  );

  /* cfg */
  const factorConfig: Record<
    FactorKey,
    { color: string; name: string; impact: `${FactorKey}_impact` }
  > = {
    payment_history: {
      color: '#10B981',
      name: 'Payment History',
      impact: 'payment_impact',
    },
    utilization: {
      color: '#3B82F6',
      name: 'Credit Utilization',
      impact: 'utilization_impact',
    },
    credit_age: {
      color: '#8B5CF6',
      name: 'Credit Age',
      impact: 'age_impact',
    },
    new_credit: {
      color: '#F59E0B',
      name: 'New Credit',
      impact: 'new_impact',
    },
    credit_mix: {
      color: '#EF4444',
      name: 'Credit Mix',
      impact: 'mix_impact',
    },
  };

  /* handlers */
  const toggleFactor = (f: FactorKey) =>
    setActiveFactors(prev =>
      prev.includes(f) ? prev.filter(k => k !== f) : [...prev, f],
    );

  /* tooltip */
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: any[];
    label?: string;
  }) =>
    active && payload?.length ? (
      <div className="bg-card border border-border rounded-lg p-4">
        <p className="font-medium text-foreground mb-2">{label}</p>
        {payload.map((d, i) => (
          <div
            key={i}
            className="flex items-center justify-between text-sm space-x-4"
          >
            <span className="flex items-center space-x-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              <span className="text-muted-foreground">{d.name}:</span>
            </span>
            <span className="font-medium text-foreground">
              {d.name.includes('Impact')
                ? `${d.value > 0 ? '+' : ''}${d.value} pts`
                : `${d.value}%`}
            </span>
          </div>
        ))}
      </div>
    ) : null;

  /* -------- UI -------- */
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {/* heading */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Factor Performance Over Time
          </h3>
          <p className="text-sm text-muted-foreground">
            Track how each credit factor performs and impacts your score
          </p>
        </div>

        <div className="flex items-center gap-2 mt-4 lg:mt-0 text-sm">
          <span className="text-muted-foreground">Benchmark:</span>
          <Icon name="TrendingUp" size={16} className="text-primary" />
          <span className="font-medium text-foreground">
            {benchmarkType === 'personal' ? 'Personal Average' : 'Peer Group'}
          </span>
        </div>
      </div>

      {/* toggles */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(
          Object.keys(factorConfig) as FactorKey[]
        ).map(key => (
          <button
            key={key}
            onClick={() => toggleFactor(key)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
              activeFactors.includes(key)
                ? 'bg-primary text-primary-foreground shadow-elevation-1'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: factorConfig[key].color }}
            />
            {factorConfig[key].name}
          </button>
        ))}
      </div>

      {/* chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="period" stroke="#6B7280" fontSize={12} />
            <YAxis
              yAxisId="left"
              stroke="#6B7280"
              fontSize={12}
              label={{
                value: 'Factor Score (%)',
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#6B7280"
              fontSize={12}
              label={{
                value: 'Score Impact (pts)',
                angle: 90,
                position: 'insideRight',
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {/* lines / bars */}
            {activeFactors.map(f => (
              <React.Fragment key={f}>
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey={f}
                  stroke={factorConfig[f].color}
                  strokeWidth={2}
                  dot={{ fill: factorConfig[f].color, r: 4 }}
                  name={factorConfig[f].name}
                />
                <Bar
                  yAxisId="right"
                  dataKey={factorConfig[f].impact}
                  fill={factorConfig[f].color}
                  fillOpacity={0.3}
                  name={`${factorConfig[f].name} Impact`}
                />
              </React.Fragment>
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* legend */}
      <div className="mt-4 pt-4 border-t border-border text-sm text-muted-foreground flex flex-col sm:flex-row sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-primary rounded-full" />
            Factor Performance (%)
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-primary/30 rounded" />
            Score Impact (pts)
          </span>
        </div>
        <span className="mt-2 sm:mt-0">
          Last updated:{' '}
          {new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
};

export default FactorPerformanceChart;
