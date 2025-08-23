// src/pages/dashboard/credit-score-overview-dashboard/index.tsx

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/layouts/DashboardShell';

import DashboardHeader from './components/DashboardHeader';
import ScoreGauge      from './components/ScoreGauge';
import KeyMetricsCards from './components/KeyMetricsCards';
import ScoreTrendChart from './components/ScoreTrendChart';
import FactorBreakdown from './components/FactorBreakdown';
import AlertFeed       from './components/AlertFeed';

// 🔧 Sửa 1: dùng namespace import để không phụ thuộc named export cụ thể
import * as mockApi from '@/lib/mockApi';
import { getCurrentScore, getScoreHistory, getScoreFactors } from '@/services/survey.service';
import { getAlerts } from '@/services/alerts.service';
import { getMyProfile } from '@/services/profile.service';
import { getToken } from '@/services/auth.service';

function decodeJwt(token: string): any {
  try {
    if (typeof window === 'undefined' || !('atob' in window)) return null;
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = window.atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

type TimeRange = '3M' | '6M' | '1Y' | '2Y';
interface KeyMetrics { monthlyChange: number; utilizationRate: number; utilizationChange: number; daysSinceUpdate: number; }
interface TrendPoint { month: string; score: number; change: number; }
interface Factor { name: string; weight: number; score: number; impact: 'Positive'|'Negative'|'Neutral'; status: string; description: string; }
interface AlertItem { id: number; type: string; severity: 'high'|'medium'|'low'|'info'; title: string; message: string; timestamp: Date; read: boolean; actionable: boolean; details?: string; recommendation?: string; }

export default function CreditScoreOverviewDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('1Y');
  const [isLoading, setIsLoading] = useState(true);

  // ---- state lấy từ API (giữ tên/shape như bạn đang dùng) ----
  const [currentScore,  setCurrentScore]  = useState(742);
  const [previousScore, setPreviousScore] = useState(730);
  const [percentile,    setPercentile]    = useState(78);
  const [riskLevel,     setRiskLevel]     = useState('Good');
  const [keyMetrics,    setKeyMetrics]    = useState<KeyMetrics>({ monthlyChange: 12, utilizationRate: 23, utilizationChange: -3, daysSinceUpdate: 2 });
  const [creditFactors, setCreditFactors] = useState<Factor[]>([]);
  const [recentAlerts,  setRecentAlerts]  = useState<AlertItem[]>([]);
  const [scoreTrendData, setScoreTrendData] = useState<TrendPoint[]>([]);
  const [userName, setUserName] = useState<string | undefined>(undefined);

  // helpers dựng điểm chart từ ISO date (giữ y nguyên style của bạn)
  const buildScorePointsFromISO = (rows: { date: string; score: number }[]): TrendPoint[] => {
    const sorted = [...rows].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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

  // nạp dữ liệu
  const load = async () => {
    setIsLoading(true);
    try {
      // Ưu tiên hiển thị điểm vừa tính xong từ sessionStorage (nếu có)
      let d: any = null;
      try {
        if (typeof window !== 'undefined') {
          const raw = window.sessionStorage.getItem('latest_score_payload');
          if (raw) {
            const cached = JSON.parse(raw);
            const cur = cached?.current_score ?? cached?.score ?? cached?.currentScore ?? 742;
            const prev = cached?.previous_score ?? cached?.previousScore ?? cur;
            d = {
              currentScore: cur,
              previousScore: prev,
              percentile: cached?.percentile ?? 78,
              riskLevel: cached?.band ?? cached?.category ?? 'Good',
              keyMetrics: { monthlyChange: 12, utilizationRate: 23, utilizationChange: -3, daysSinceUpdate: 0 },
              trend: (cached?.trend && Array.isArray(cached.trend) ? cached.trend : makeDemoScoreHistory(24, cur)),
              factors: cached?.factors ?? [],
              alerts: cached?.alerts ?? [],
            };
            // Dọn cache để không hiển thị lặp lại cho lần sau
            window.sessionStorage.removeItem('latest_score_payload');
          }
        }
      } catch {}

      // 🔧 Thử lấy điểm thật từ BE theo userId trong JWT
      const token = getToken();
      const claims = token ? decodeJwt(token) : null;
      const userId: string | undefined = claims?.sub || claims?.user_id || claims?.uid || claims?.id;

      if (!d && userId) {
        try {
          const [real, history, alerts, factorsResp, profile] = await Promise.all([
            getCurrentScore(userId),
            getScoreHistory(userId).catch(() => null),
            getAlerts(userId).catch(() => []),
            getScoreFactors(userId).catch(() => null),
            getMyProfile().catch(() => null),
          ]);
          // Map history (nếu có) sang dạng {date, score}
          let trendRows: { date: string; score: number }[] | null = null;
          if (Array.isArray(history)) {
            try {
              trendRows = history.map((r: any) => ({
                date:
                  r?.date ??
                  r?.timestamp ??
                  r?.month ??
                  r?.calculated_at ??
                  (typeof r?.updated_at === 'string' ? r.updated_at : new Date().toISOString().slice(0, 10)),
                score: Number(r?.score ?? r?.value ?? r?.points ?? r?.current_score ?? real?.current_score ?? 742),
              }));
            } catch {}
          }

          // Chuẩn hoá dữ liệu tối thiểu từ BE
          // Map factorsResp -> FactorBreakdown props
          let mappedFactors: any[] = [];
          try {
            const raw = Array.isArray(factorsResp?.factors) ? factorsResp.factors : [];
            mappedFactors = raw.map((it: any) => {
              const impactRaw = String(it?.impact ?? 'Neutral');
              const impact = impactRaw.charAt(0).toUpperCase() + impactRaw.slice(1).toLowerCase();
              return {
                name: String(it?.name ?? 'Factor'),
                weight: Number(it?.weight ?? 0),
                score: Number(it?.score ?? 0),
                impact: (impact === 'Positive' || impact === 'Negative' || impact === 'Neutral') ? impact : 'Neutral',
                status: String(it?.description ?? ''),
                description: String(it?.description ?? ''),
              };
            });
          } catch {}

          d = {
            currentScore: real?.current_score ?? real?.score ?? 742,
            previousScore: real?.previous_score ?? real?.previousScore ?? 730,
            percentile: real?.percentile ?? null,
            riskLevel: real?.category ?? real?.band ?? real?.riskLevel ?? 'Good',
            keyMetrics: real?.keyMetrics ?? { monthlyChange: 12, utilizationRate: 23, utilizationChange: -3, daysSinceUpdate: 2 },
            trend: trendRows && trendRows.length ? trendRows : (real?.trend ?? makeDemoScoreHistory(24, 748)),
            factors: Array.isArray(mappedFactors) && mappedFactors.length ? mappedFactors : (real?.factors ?? []),
            alerts: Array.isArray(alerts) ? alerts : [],
          };

          // set user name from profile
          try {
            const name = profile?.full_name || profile?.email || userId;
            if (name) setUserName(String(name));
          } catch {}
        } catch {
          // nếu API thật lỗi, fallback mock
          d = null;
        }
      }

      if (!d) {
        // fallback mock để không vỡ UI khi chưa có BE
        d =
          typeof (mockApi as any).fetchDashboard === 'function'
            ? await (mockApi as any).fetchDashboard()
            : {
                currentScore: 742,
                previousScore: 730,
                percentile: 78,
                riskLevel: 'Good',
                keyMetrics: { monthlyChange: 12, utilizationRate: 23, utilizationChange: -3, daysSinceUpdate: 2 },
                trend: makeDemoScoreHistory(24, 748),
                factors: [],
                alerts: [],
              };
      }

      // d should be: { currentScore, previousScore, percentile, riskLevel, keyMetrics, trend:[{date,score}], factors, alerts }
      setCurrentScore(d.currentScore);
      setPreviousScore(d.previousScore);
      setPercentile(d.percentile);
      setRiskLevel(d.riskLevel);
      setKeyMetrics(d.keyMetrics);

      const trendRows = (d.trend && d.trend.length ? d.trend : makeDemoScoreHistory(24, 748));
      setScoreTrendData(buildScorePointsFromISO(trendRows));

      setCreditFactors(d.factors || []);
      setRecentAlerts((d.alerts || []).map((a: any) => ({
        ...a,
        timestamp: new Date(a.timestamp),
      })));
    } catch {
      // fallback mọi thứ nếu API mock lỗi
      setScoreTrendData(buildScorePointsFromISO(makeDemoScoreHistory(24, 748)));
      setCreditFactors([]);
      setRecentAlerts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // giả độ trễ giống file gốc
    const t = setTimeout(load, 400);
    return () => clearTimeout(t);
  }, []);

  const handleExport  = async (_fmt: 'pdf'|'csv'|'excel') => { await new Promise(r => setTimeout(r, 800)); };
  const handleRefresh = async () => { await load(); };

  // Container chuẩn đặt giữa; NUDGE để ép sang trái một chút (không đụng global)
  const CONTAINER = 'mx-auto max-w-[1200px] px-6';
  // chỉnh mức dịch trái ở đây: -translate-x-38 (~-32px), xl:-translate-x-30 (~-48px)
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
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold mb-2">Credit Score Overview</h1>
              <p className="text-[var(--color-muted-foreground)]">
                Monitor your credit score trends and key metrics
              </p>
            </div>
            <Link
              href="/dashboard/what-if-scenario-simulator-dashboard"
              className="inline-flex items-center gap-2 h-10 px-4 rounded-lg font-medium border"
              style={{ borderColor: 'var(--color-border,#E5E7EB)', background: 'var(--color-card,#fff)', boxShadow: '0 6px 24px rgba(15,23,42,0.06)' }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-neon,#12F7A0)' }} />
              What-If Simulator
            </Link>
          </div>
        </header>

        <div className="mb-6">
          <DashboardHeader
            onExport={handleExport}
            onRefresh={handleRefresh}
            lastUpdated={new Date(Date.now() - 2 * 60 * 60 * 1000)}
            userName={userName}
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
              size="lg"
            />
          </div>

          <div className="lg:col-span-2 w-full max-w-[480px] ml-auto">
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
