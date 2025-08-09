// src/pages/dashboard/credit-score-overview-dashboard/index.tsx
'use client';

import React, { useEffect, useState } from 'react';
import DashboardShell from '@/components/layouts/DashboardShell';

import DashboardHeader from './components/DashboardHeader';
import ScoreGauge      from './components/ScoreGauge';
import KeyMetricsCards from './components/KeyMetricsCards';
import ScoreTrendChart from './components/ScoreTrendChart';
import FactorBreakdown from './components/FactorBreakdown';
import AlertFeed       from './components/AlertFeed';

type TimeRange = '3M' | '6M' | '1Y' | '2Y';
interface KeyMetrics { monthlyChange: number; utilizationRate: number; utilizationChange: number; daysSinceUpdate: number; }
interface TrendPoint { month: string; score: number; change: number; }
interface Factor { name: string; weight: number; score: number; impact: 'Positive'|'Negative'|'Neutral'; status: string; description: string; }
interface AlertItem { id: number; type: string; severity: 'high'|'medium'|'low'|'info'; title: string; message: string; timestamp: Date; read: boolean; actionable: boolean; details?: string; recommendation?: string; }

export default function CreditScoreOverviewDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('1Y');
  const [isLoading, setIsLoading] = useState(true);

  // mock
  const currentScore  = 742;
  const previousScore = 730;
  const percentile    = 78;
  const riskLevel     = 'Good';
  const keyMetrics: KeyMetrics = { monthlyChange: 12, utilizationRate: 23, utilizationChange: -3, daysSinceUpdate: 2 };

  //const scoreTrendData: TrendPoint[] = [
  //  { month: 'Jan 2023', score: 698, change: 0 },
  // { month: 'Aug 2024', score: 742, change: -3 },
  //];
// ví dụ: data từ backend (ISO date + score)
const apiData = [
  { date: '2023-09-01', score: 735 },
  { date: '2023-10-01', score: 739 },
  // ...
];

// C1: nếu đã có ISO date -> build thành điểm hiển thị:
//import { buildScorePointsFromISO, makeDemoScoreHistory } from './components/ScoreTrendChart';

// dùng data thực:
//const scoreTrendData = buildScorePointsFromISO(apiData);

// hoặc dùng dữ liệu mẫu 24 tháng (để nhìn rõ animation):
// const scoreTrendData = buildScorePointsFromISO(makeDemoScoreHistory(24, 748));
// helpers dựng điểm chart từ ISO date (local-only, không cần import)
const buildScorePointsFromISO = (rows: { date: string; score: number }[]): TrendPoint[] => {
  const sorted = [...rows].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  return sorted.map((r, i, arr) => ({
    month: new Date(r.date).toLocaleString('en-US', { month: 'short', year: 'numeric' }),
    score: r.score,
    change: i ? r.score - arr[i - 1].score : 0,
  }));
};

// dữ liệu mẫu 24 tháng (fallback khi apiData trống) – chỉ để demo animation
const makeDemoScoreHistory = (months: number, base = 748): { date: string; score: number }[] => {
  const out: { date: string; score: number }[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const jitter = Math.round(Math.sin(i / 3) * 6 + (Math.random() * 4 - 2));
    const score = Math.max(300, Math.min(850, base + jitter));
    out.push({ date: d.toISOString().slice(0, 10), score });
  }
  return out;
};

// dữ liệu truyền vào chart (ưu tiên apiData, nếu rỗng thì dùng demo)
const scoreTrendData: TrendPoint[] = buildScorePointsFromISO(
  apiData && apiData.length ? apiData : makeDemoScoreHistory(24, 748)
);

  const creditFactors: Factor[] = [
    {
      name: 'Payment History',
      weight: 35,
      score: 85,
      impact: 'Positive',
      status: 'Excellent - No missed payments',
      description: 'Your payment history shows consistent on-time payments across all accounts.',
    },
  ];

  const recentAlerts: AlertItem[] = [
    {
      id: 1,
      type: 'score_change',
      severity: 'info',
      title: 'Credit Score Increased',
      message: 'Your credit score increased by 4 points to 742',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      actionable: false,
    },
  ];

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const handleExport  = async (_fmt: 'pdf'|'csv'|'excel') => { await new Promise(r => setTimeout(r, 800)); };
  const handleRefresh = async () => { setIsLoading(true); await new Promise(r => setTimeout(r, 600)); setIsLoading(false); };

  // Container chuẩn đặt giữa; NUDGE để ép sang trái một chút (không đụng global)
  const CONTAINER = 'mx-auto max-w-[1200px] px-6';
  // chỉnh mức dịch trái ở đây: -translate-x-38 (~-32px), xl:-translate-x-12 (~-48px)
  const NUDGE_LEFT = 'md:transform md:-translate-x-38 xl:-translate-x-30';

  if (isLoading) {
    return (
      <DashboardShell>
        <div className={`${CONTAINER} ${NUDGE_LEFT}`}>
          <div className="h-64 rounded-lg animate-pulse bg-[var(--color-muted)]" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      {/* bọc toàn bộ nội dung trong CONTAINER + NUDGE_LEFT để dời sang trái */}
      <div className={`${CONTAINER} ${NUDGE_LEFT}`}>
        <header className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Credit Score Overview</h1>
          <p className="text-[var(--color-muted-foreground)]">
            Monitor your credit score trends and key metrics
          </p>
        </header>

        <div className="mb-6">
          <DashboardHeader
            onExport={handleExport}
            onRefresh={handleRefresh}
            lastUpdated={new Date(Date.now() - 2 * 60 * 60 * 1000)}
          />
        </div>

        {/* Gauge rộng, Key metrics hẹp & xếp dọc */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-start">
          <div className="lg:col-span-4">
            <ScoreGauge
              score={currentScore}
              previousScore={previousScore}
              percentile={percentile}
              riskLevel={riskLevel}
              // nếu component bạn có prop size="lg" thì giữ; không có cũng không sao
              size="lg"
            />
          </div>

          <div className="lg:col-span-2 w-full max-w-[480px] ml-auto">
            {/* nếu KeyMetricsCards có prop stacked thì ok; không có thì vẫn render bình thường */}
            <KeyMetricsCards metrics={keyMetrics} stacked />
          </div>
        </div>

        <div className="mt-6 grid gap-6 grid-cols-1 items-start">
  <div className="min-w-0">
    <ScoreTrendChart
      data={scoreTrendData}
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
    />
  </div>

  <div className="min-w-0">
    <FactorBreakdown factors={creditFactors} />
  </div>

  <div className="min-w-0">
    <AlertFeed alerts={recentAlerts} />
  </div>
</div>

      </div>
    </DashboardShell>
  );
}
