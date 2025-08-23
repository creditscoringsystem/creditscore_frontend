// src/pages/dashboard/what-if-scenario-simulator-dashboard/index.tsx
'use client';

import React, { useEffect, useState } from 'react';
import DashboardShell from '@/components/layouts/DashboardShell';

import ScenarioControlPanel, { Scenario } from './components/ScenarioControlPanel';
import ScenarioVisualization from './components/ScenarioVisualization';
import ResultsPanel from './components/ResultsPanel';
import TimelineSlider from './components/TimelineSlider';
import ImpactSummaryCards from './components/ImpactSummaryCards';
import ScenarioComparison from './components/ScenarioComparison';

import { CurrencyProvider, useCurrency } from '@/features/simulator/CurrencyContext';

import {
  fetchSimulator,
  saveScenario as apiSaveScenario,
  deleteScenario as apiDeleteScenario,
  exportResults as apiExportResults,
} from '@/lib/mockApi';
import { simulateScore, simulateProjection } from '@/services/survey.service';
import { getToken } from '@/services/auth.service';

/** Page Component (function declaration + default export) */
export default function SimulatorPage() {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [savedScenarios, setSavedScenarios] = useState<Scenario[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<number>(12);
  const [projectedResults, setProjectedResults] = useState<any>(null);

  // Decode JWT (same style as overview page)
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

  // Map Scenario controls -> hypothetical survey answers (flat) for Score Service
  const toHypotheticalAnswers = (s: Scenario) => {
    // credit_usage bucket from utilizationChange
    const util = Math.abs(s.utilizationChange ?? 0);
    const credit_usage =
      util < 10
        ? '<10%'
        : util <= 30
        ? '11-30%'
        : util <= 50
        ? '31-50%'
        : util <= 70
        ? '51-70%'
        : '>70%';
    const credit_cards = String(Math.max(1, 1 + (s.newAccounts ?? 0)));
    return {
      // override a few impactful fields; defaults will be filled server-side mapper
      credit_usage,
      credit_cards,
      pay_timing: 'on_time',
      late_12m: '0',
      pay_full_on_time: 'yes',
    } as Record<string, string>;
  };

  // Map ProjectionOut (BE) -> ProjectedResults (FE ResultsPanel expects)
  function mapProjectionToResults(out: any) {
    if (!out) return null;
    const proj = Array.isArray(out.projection) ? out.projection : [];
    const min = proj.length ? Math.min(...proj.map((p: any) => Number(p.confLo ?? p.simulated ?? 0))) : undefined;
    const max = proj.length ? Math.max(...proj.map((p: any) => Number(p.confHi ?? p.simulated ?? 0))) : undefined;
    const target = Number(out?.summary?.projected ?? out?.score ?? 0) || undefined;
    const confidencePct = Number(out?.summary?.confidence ?? Math.round((out?.confidence ?? 0) * 100)) || undefined;
    const timeToTarget = (proj.length ? (proj[proj.length - 1]?.month ?? proj.length) : undefined);
    const monthlyProgress = proj.map((p: any) => ({ month: Number(p.month) + 1, score: Number(p.simulated), confidence: confidencePct ?? 85 }));

    return {
      scoreRange: target ? { min: (min ?? Math.max(300, target - 25)), max: (max ?? Math.min(850, target + 25)), target } : undefined,
      confidenceLevel: confidencePct,
      timeToTarget,
      monthlyProgress,
      creditScoreChange: typeof out?.summary?.delta === 'number' ? out.summary.delta : undefined,
    } as any;
  }

  /** nạp danh sách scenario đã lưu (mock) */
  const loadSaved = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSimulator();
      setSavedScenarios(data?.savedScenarios ?? []);
    } catch {
      // fallback demo
      setSavedScenarios([
        { id: 1, name: 'Aggressive Paydown',    paymentAmount: 500, utilizationChange: -25, newAccounts: 0, payoffTimeline: 8,  creditLimit: 0,    accountAge: 24, createdAt: '2025-01-05T10:30:00.000Z' },
        { id: 2, name: 'Conservative Approach', paymentAmount: 150, utilizationChange: -10, newAccounts: 0, payoffTimeline: 18, creditLimit: 2500, accountAge: 24, createdAt: '2025-01-04T14:15:00.000Z' },
        { id: 3, name: 'Balance Transfer Strategy', paymentAmount: 300, utilizationChange: -20, newAccounts: 1, payoffTimeline: 12, creditLimit: 7500, accountAge: 24, createdAt: '2025-01-03T09:45:00.000Z' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadSaved(); }, []);

  /** chạy mô phỏng khi chỉnh control */
  const handleScenarioChange = async (scenario: Scenario) => {
    setCurrentScenario(scenario);
    try {
      // Gọi BE thật nếu có userId, đồng thời vẫn dựng dữ liệu local/mock cho UI
      const token = getToken();
      const claims = token ? decodeJwt(token) : null;
      const userId: string | undefined = claims?.sub || claims?.user_id || claims?.uid || claims?.id;
      if (userId) {
        try {
          const answers = toHypotheticalAnswers(scenario);
          await simulateScore(userId, answers);
        } catch (e) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn('simulateScore failed, falling back to local projection', e);
          }
        }
      }
      // Gọi projection thật để hiển thị biểu đồ
      if (userId) {
        const answers = toHypotheticalAnswers(scenario);
        const out = await simulateProjection(userId, answers);
        setProjectedResults(mapProjectionToResults(out));
      } else {
        setProjectedResults(null);
      }
    } catch {
      setProjectedResults(null);
    }
  };

  const handleSaveScenario = async (scenario: Scenario) => {
    try {
      const saved = await apiSaveScenario(scenario);
      setSavedScenarios(prev => [...prev, saved]);
    } catch {
      const newScenario: Scenario = { ...scenario, id: (savedScenarios.at(-1)?.id ?? 0) + 1, createdAt: new Date().toISOString() };
      setSavedScenarios(prev => [...prev, newScenario]);
    }
  };

  const handleTimeframeChange = async (tf: number) => {
    setSelectedTimeframe(tf);
    if (currentScenario) {
      try {
        const token = getToken();
        const claims = token ? decodeJwt(token) : null;
        const userId: string | undefined = claims?.sub || claims?.user_id || claims?.uid || claims?.id;
        if (userId) {
          try {
            const answers = toHypotheticalAnswers(currentScenario);
            await simulateScore(userId, answers);
          } catch {}
        }
        if (userId && currentScenario) {
          const answers = toHypotheticalAnswers(currentScenario);
          const out = await simulateProjection(userId, answers);
          setProjectedResults(mapProjectionToResults(out));
        } else {
          setProjectedResults(null);
        }
      } catch {
        setProjectedResults(null);
      }
    }
  };

  const handlePlayAnimation = (_playing: boolean) => { /* visualization tự xử lý */ };

  const handleExportResults = async (data: any) => {
    try { await apiExportResults(data); } catch { /* ignore */ }
  };

  const handleLoadScenario = async (scenario: Scenario) => {
    setCurrentScenario(scenario);
    await handleScenarioChange(scenario);
  };

  const handleDeleteScenario = async (id: number) => {
    try { await apiDeleteScenario(id); } catch { /* ignore */ }
    setSavedScenarios(prev => prev.filter(s => s.id !== id));
    if (currentScenario?.id === id) {
      setCurrentScenario(null);
      setProjectedResults(null);
    }
  };

  // chuẩn hoá danh sách cho ScenarioComparison: chỉ những item có id (bắt buộc)
  const savedForComparison = savedScenarios.filter(
    (s): s is Scenario & { id: number } => typeof s.id === 'number'
  );

  // Bridge để khớp type kỳ vọng của ScenarioComparison
  // - Hàm không async, trả về void
  // - Tham số có thể có id string | number
  const handleLoadScenarioFromComparison = (scenario: any): void => {
    setCurrentScenario(scenario as Scenario);
    void handleScenarioChange(scenario as Scenario);
  };

  const handleDeleteScenarioFromComparison = (id: string | number): void => {
    const numericId = typeof id === 'string' ? Number(id) : id;
    void handleDeleteScenario(numericId);
  };

  // Container chuẩn giữa + “nudge” sang trái (đồng bộ Overview/Analysis)
  const CONTAINER = 'mx-auto max-w-[1440px] px-6';
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
      {/* Bọc toàn bộ trang bằng CurrencyProvider để các component share currency */}
      <CurrencyProvider>
        <div className={`${CONTAINER} ${NUDGE_LEFT}`}>
          <HeaderWithCurrencyToggle />

          {/* Layout 5-5-5: grid-cols-15 */}
          <div className="grid gap-6 grid-cols-15">
            {/* col 1 - 5 */}
            <div className="col-span-15 lg:col-span-5 space-y-6">
              <ScenarioControlPanel
                onScenarioChange={handleScenarioChange}
                currentScenario={currentScenario}
                onSaveScenario={handleSaveScenario}
                savedScenarios={savedScenarios}
              />
              <TimelineSlider
                selectedTimeframe={selectedTimeframe}
                onTimeframeChange={handleTimeframeChange}
                onPlayAnimation={handlePlayAnimation}
              />
            </div>

            {/* col 2 - 5 */}
            <div className="col-span-15 lg:col-span-5 space-y-6">
              <ScenarioVisualization
                currentScenario={currentScenario}
                selectedTimeframe={selectedTimeframe}
              />
              <ImpactSummaryCards
                currentScenario={currentScenario ?? {
                  paymentAmount: 250,
                  utilizationChange: -15,
                  newAccounts: 0,
                  payoffTimeline: 12,
                  creditLimit: 5000,
                  accountAge: 24,
                }}
              />
            </div>

            {/* col 3 - 5 */}
            <div className="col-span-15 lg:col-span-5 space-y-6">
              <ResultsPanel
                currentScenario={currentScenario}
                projectedResults={projectedResults}
                onExportResults={handleExportResults}
              />
            </div>

            {/* full width */}
            <div className="col-span-15 mt-8">
              <ScenarioComparison
                savedScenarios={savedForComparison as any}
                onLoadScenario={handleLoadScenarioFromComparison}
                onDeleteScenario={handleDeleteScenarioFromComparison}
              />
            </div>
          </div>
        </div>
      </CurrencyProvider>
    </DashboardShell>
  );
}

/* ====== Toggle USD/VND ở header (pill neon bo tròn) ====== */
function HeaderWithCurrencyToggle() {
  const { currency, setCurrency } = useCurrency();

  return (
    <header className="mb-8 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-4xl font-extrabold mb-2" style={{ color: '#0F172A' }}>
          Scenario Simulator
        </h1>
        <p className="text-base" style={{ color: '#374151' }}>
          Model what-if scenarios for credit improvement
        </p>
      </div>

      <div
        className="flex items-center p-1 rounded-full border"
        style={{ borderColor: 'var(--color-border,#E5E7EB)', boxShadow: '0 6px 24px rgba(15,23,42,0.06)' }}
      >
        <button
          onClick={() => setCurrency('USD')}
          className={`px-4 h-9 rounded-full text-sm font-medium transition-all ${
            currency === 'USD'
              ? '!bg-[var(--color-neon,#12F7A0)] !text-[#0F172A]'
              : 'text-[var(--color-foreground,#0F172A)]'
          }`}
        >
          USD
        </button>
        <button
          onClick={() => setCurrency('VND')}
          className={`px-4 h-9 rounded-full text-sm font-medium transition-all ${
            currency === 'VND'
              ? '!bg-[var(--color-neon,#12F7A0)] !text-[#0F172A]'
              : 'text-[var(--color-foreground,#0F172A)]'
          }`}
        >
          VND
        </button>
      </div>
    </header>
  );
}
