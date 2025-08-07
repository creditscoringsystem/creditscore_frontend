// pages/credit-factor-analysis-dashboard/index.tsx
// Converted to TypeScript – layout & logic untouched

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';

import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';

import DetailedFactorBreakdown from './components/DetailedFactorBreakdown';

/* ---------- local types ---------- */
type FactorKey =
  | 'payment_history'
  | 'utilization'
  | 'credit_age'
  | 'new_credit'
  | 'credit_mix';

type TimePeriod = 'monthly' | 'quarterly';
type Benchmark = 'personal' | 'demographic';

const CreditFactorAnalysisDashboard: React.FC = () => {
  /* state */
  const [selectedFactors, setSelectedFactors] = useState<FactorKey[]>([
    'payment_history',
    'utilization',
    'credit_age',
  ]);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('monthly');
  const [benchmarkType, setBenchmarkType] = useState<Benchmark>('personal');
  const [lastUpdated, setLastUpdated] = useState<string>('2 min ago');
  const [highlightedFactors, setHighlightedFactors] = useState<FactorKey[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('6M');
  const [selectedFactor, setSelectedFactor] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /* handlers */
  const handleFactorChange = useCallback((f: FactorKey[]) => {
    setSelectedFactors(f);
  }, []);

  const handleTimePeriodChange = useCallback((p: TimePeriod) => {
    setTimePeriod(p);
  }, []);

  const handleBenchmarkChange = useCallback((b: Benchmark) => {
    setBenchmarkType(b);
  }, []);

  const handleRefresh = useCallback(() => {
    setLastUpdated('Just now');
    setTimeout(() => setLastUpdated('1 min ago'), 60_000);
  }, []);

  const handleFactorHighlight = useCallback((f: FactorKey[]) => {
    setHighlightedFactors(f);
  }, []);

  const handleFactorSelect = useCallback((factor: unknown) => {
    console.log('Selected factor:', factor);
  }, []);

  /* memoised placeholders ----------------------------------- */
  const Placeholder = (title: string): ReactNode => (
    <div className="bg-card p-4 rounded-lg border">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      {/* replace with real content */}
    </div>
  );

  const memoizedGlobalControls = useMemo(
    () => Placeholder('Controls'),
    [selectedFactors, timePeriod, benchmarkType],
  );
  const memoizedPerformanceChart = useMemo(
    () => Placeholder('Performance Chart'),
    [selectedFactors, timePeriod],
  );
  const memoizedCorrelationHeatmap = useMemo(
    () => Placeholder('Correlation Heatmap'),
    [selectedFactors],
  );
  const memoizedRankingTable = useMemo(
    () => Placeholder('Ranking Table'),
    [selectedFactors, benchmarkType],
  );

  /* loading effect */
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1_000);
    return () => clearTimeout(t);
  }, []);

  /* --------------------------------------------------------- */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <div className="flex-1 ml-80">
          <Header />
          <main className="pt-20 px-6 py-8">{/* loading skeleton */}</main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 ml-80">
        <Header />

        <main className="pt-20 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* page header */}
            <header className="mb-8">
              <h1 className="text-3xl font-semibold text-foreground mb-2">
                Factor Analysis
              </h1>
              <p className="text-muted-foreground">
                Detailed breakdown of credit score factors
              </p>
            </header>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {/* global controls */}
              {memoizedGlobalControls}

              {/* main visualisations */}
              <section className="lg:col-span-3 xl:col-span-3 space-y-6">
                {memoizedPerformanceChart}
                {memoizedCorrelationHeatmap}
              </section>

              {/* right panel */}
              <aside className="lg:col-span-1 xl:col-span-1">
                {memoizedRankingTable}
              </aside>

              {/* detailed breakdown */}
              <DetailedFactorBreakdown />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreditFactorAnalysisDashboard;
