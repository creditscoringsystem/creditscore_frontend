/* app/(dashboard)/credit-score-overview/page.tsx */
'use client';

import React, { useEffect, useState } from 'react';

import Sidebar         from '@/components/ui/Sidebar';
import Header          from '@/components/ui/Header';
import DashboardHeader from './components/DashboardHeader';
import ScoreGauge      from './components/ScoreGauge';
import KeyMetricsCards from './components/KeyMetricsCards';
import ScoreTrendChart from './components/ScoreTrendChart';
import FactorBreakdown from './components/FactorBreakdown';
import AlertFeed       from './components/AlertFeed';

/* ──────────────── types ──────────────── */
type TimeRange = '3M' | '6M' | '1Y' | '2Y';

interface KeyMetrics {
  monthlyChange: number;
  utilizationRate: number;
  utilizationChange: number;
  daysSinceUpdate: number;
}

interface TrendPoint {
  month: string;
  score: number;
  change: number;
}

interface Factor {
  name: string;
  weight: number;
  score: number;
  impact: 'Positive' | 'Negative' | 'Neutral';
  status: string;
  description: string;
}

interface AlertItem {
  id: number;
  type: string;
  severity: 'high' | 'medium' | 'low' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionable: boolean;
  details?: string;
  recommendation?: string;
}

/* ─────────────── component ─────────────── */
export default function CreditScoreOverviewDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('1Y');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /* mock data – giữ nguyên */
  const currentScore  = 742;
  const previousScore = 730;
  const percentile    = 78;
  const riskLevel     = 'Good';

  const keyMetrics: KeyMetrics = {
    monthlyChange: 12,
    utilizationRate: 23,
    utilizationChange: -3,
    daysSinceUpdate: 2,
  };

  const scoreTrendData: TrendPoint[] = [
    { month: 'Jan 2023', score: 698, change:  0 },
    /* … cắt ngắn cho gọn, giữ nguyên khi implement … */
    { month: 'Aug 2024', score: 742, change: -3 },
  ];

  const creditFactors: Factor[] = [
    { name: 'Payment History', weight: 35, score: 85, impact: 'Positive',
      status: 'Excellent - No missed payments',
      description: 'Your payment history shows consistent on-time payments across all accounts.' },
    /* … */
  ];

  const recentAlerts: AlertItem[] = [
    { id: 1, type: 'score_change', severity: 'info', title: 'Credit Score Increased',
      message: 'Your credit score increased by 4 points to 742',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false, actionable: false,
      details: 'This increase is primarily due to reduced credit utilization and continued on-time payments.',
      recommendation: 'Continue maintaining low utilization rates and making payments on time.' },
    /* … */
  ];

  /* fake loading */
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1_000);
    return () => clearTimeout(t);
  }, []);

  /* handlers */
  const handleExport = async (format: 'pdf' | 'csv' | 'excel') => {
    console.log(`Exporting credit report as ${format}`);
    await new Promise(r => setTimeout(r, 2_000));
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1_500));
    setIsLoading(false);
  };

  /* skeleton */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <div className="flex-1 ml-80">
          <Header />
          <main className="pt-20 px-6 py-8">
            <div className="h-64 bg-muted rounded-lg animate-pulse" />
          </main>
        </div>
      </div>
    );
  }

  /* normal render */
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 ml-80">
        <Header />

        <main className="pt-20 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* page heading */}
            <header className="mb-8">
              <h1 className="text-3xl font-semibold text-foreground mb-2">
                Credit Score Overview
              </h1>
              <p className="text-muted-foreground">
                Monitor your credit score trends and key metrics
              </p>
            </header>

            {/* grid layout (giữ nguyên) */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 xl:grid-cols-4">
              <div className="lg:col-span-4">
                <DashboardHeader
                  onExport={handleExport}
                  onRefresh={handleRefresh}
                  lastUpdated={new Date(Date.now() - 2 * 60 * 60 * 1000)}
                />
              </div>

              <ScoreGauge
                score={currentScore}
                previousScore={previousScore}
                percentile={percentile}
                riskLevel={riskLevel}
              />

              <div className="lg:col-span-3">
                <KeyMetricsCards metrics={keyMetrics} />
              </div>

              <div className="lg:col-span-2 xl:col-span-3">
                <ScoreTrendChart
                  data={scoreTrendData}
                  timeRange={timeRange}
                  onTimeRangeChange={setTimeRange}
                />
              </div>

              <FactorBreakdown factors={creditFactors} />

              <div className="lg:col-span-2 xl:col-span-4">
                <AlertFeed alerts={recentAlerts} />
              </div>
            </div>

            {/* data freshness footer */}
            <footer className="mt-8 pt-6 border-t border-border text-sm text-muted-foreground flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span>Data updated 2 minutes ago</span>
              </div>
              <div className="flex items-center space-x-4">
                <span>Next update in 28 minutes</span>
                <button
                  onClick={handleRefresh}
                  className="text-primary hover:text-primary/80 transition-smooth"
                >
                  Refresh now
                </button>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
