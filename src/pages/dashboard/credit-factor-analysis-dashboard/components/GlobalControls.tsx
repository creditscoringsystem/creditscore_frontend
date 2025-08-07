// pages/credit-factor-analysis-dashboard/components/GlobalControls.tsx
// Next.js + TypeScript – structure/markup intact

import React from 'react';
import Icon from '@/components/AppIcon';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

/* ---------- types ---------- */
type FactorKey =
  | 'payment_history'
  | 'utilization'
  | 'credit_age'
  | 'new_credit'
  | 'credit_mix';

type TimePeriod = 'monthly' | 'quarterly';
type Benchmark = 'personal' | 'demographic';

interface GlobalControlsProps {
  selectedFactors: FactorKey[];
  onFactorChange: (factors: FactorKey[]) => void;
  timePeriod: TimePeriod;
  onTimePeriodChange: (p: TimePeriod) => void;
  benchmarkType: Benchmark;
  onBenchmarkChange: (b: Benchmark) => void;
  onRefresh: () => void;
  lastUpdated?: string;
}

/* ---------- component ---------- */
const GlobalControls: React.FC<GlobalControlsProps> = ({
  selectedFactors,
  onFactorChange,
  timePeriod,
  onTimePeriodChange,
  benchmarkType,
  onBenchmarkChange,
  onRefresh,
  lastUpdated,
}) => {
  /* select options */
  const factorOptions = [
    { value: 'payment_history', label: 'Payment History' },
    { value: 'utilization', label: 'Credit Utilization' },
    { value: 'credit_age', label: 'Credit Age' },
    { value: 'new_credit', label: 'New Credit' },
    { value: 'credit_mix', label: 'Credit Mix' },
  ] as const;

  const timePeriodOptions: { value: TimePeriod; label: string }[] = [
    { value: 'monthly', label: 'Monthly View' },
    { value: 'quarterly', label: 'Quarterly View' },
  ];

  const benchmarkOptions: { value: Benchmark; label: string }[] = [
    { value: 'personal', label: 'Personal Average' },
    { value: 'demographic', label: 'Demographic Peer Group' },
  ];

  /* ---------- UI ---------- */
  return (
    <section className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          {/* factors */}
          <Select
            label="Factors to Analyze"
            options={factorOptions}
            value={selectedFactors}
            onChange={val => onFactorChange(val as FactorKey[])}
            multiple
            searchable
            placeholder="Select factors..."
            className="min-w-64"
          />

          {/* time toggle */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Time Period
            </label>
            <div className="flex bg-muted rounded-lg p-1">
              {timePeriodOptions.map(o => (
                <button
                  key={o.value}
                  onClick={() => onTimePeriodChange(o.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                    timePeriod === o.value
                      ? 'bg-primary text-primary-foreground shadow-elevation-1'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* benchmark */}
          <Select
            label="Benchmark Comparison"
            options={benchmarkOptions}
            value={benchmarkType}
            onChange={val => onBenchmarkChange(val as Benchmark)}
            className="min-w-48"
          />
        </div>

        {/* actions / status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Live Data
            </span>
            <span className="text-xs">
              Updated {lastUpdated ?? '2 min ago'}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            onClick={onRefresh}
          >
            Refresh
          </Button>

          <Button variant="outline" size="sm" iconName="Download">
            Export
          </Button>
        </div>
      </div>

      {/* quick stats */}
      <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
        <Stat value="742" label="Current Score" />
        <Stat value="+12" label="This Month" color="text-emerald-600" />
        <Stat value="5" label="Active Factors" color="text-primary" />
        <Stat value="23%" label="Avg Utilization" />
        <Stat value="6.2y" label="Avg Age" />
        <Stat value="4" label="Recent Inquiries" color="text-amber-600" />
      </div>

      {/* active filters chips */}
      {selectedFactors.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Filter" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              Active Filters:
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedFactors.map(f => {
              const lbl = factorOptions.find(o => o.value === f)?.label ?? f;
              return (
                <span
                  key={f}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {lbl}
                  <button
                    onClick={() =>
                      onFactorChange(selectedFactors.filter(x => x !== f))
                    }
                    className="hover:text-primary/80"
                  >
                    <Icon name="X" size={14} />
                  </button>
                </span>
              );
            })}
            {selectedFactors.length > 1 && (
              <button
                onClick={() => onFactorChange([])}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

/* small stat box */
const Stat: React.FC<{ value: string; label: string; color?: string }> = ({
  value,
  label,
  color = 'text-foreground',
}) => (
  <div>
    <div className={`text-lg font-semibold ${color}`}>{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

export default GlobalControls;
