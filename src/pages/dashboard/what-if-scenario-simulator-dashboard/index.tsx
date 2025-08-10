'use client';

import React, { useEffect, useState } from 'react';
import DashboardShell from '@/components/layouts/DashboardShell';
import ScenarioControlPanel, { Scenario } from './components/ScenarioControlPanel';
import ScenarioVisualization from './components/ScenarioVisualization';
import ResultsPanel from './components/ResultsPanel';
import TimelineSlider from './components/TimelineSlider';
import ImpactSummaryCards from './components/ImpactSummaryCards';
import ScenarioComparison from './components/ScenarioComparison';
import { CurrencyProvider, useCurrency } from './components/CurrencyContext';

export default function WhatIfScenarioSimulatorDashboard() {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [savedScenarios, setSavedScenarios] = useState<Scenario[]>([
    { id: 1, name: 'Aggressive Paydown',    paymentAmount: 500, utilizationChange: -25, newAccounts: 0, payoffTimeline: 8,  creditLimit: 0,    accountAge: 24, createdAt: '2025-01-05T10:30:00.000Z' },
    { id: 2, name: 'Conservative Approach', paymentAmount: 150, utilizationChange: -10, newAccounts: 0, payoffTimeline: 18, creditLimit: 2500, accountAge: 24, createdAt: '2025-01-04T14:15:00.000Z' },
    { id: 3, name: 'Balance Transfer Strategy', paymentAmount: 300, utilizationChange: -20, newAccounts: 1, payoffTimeline: 12, creditLimit: 7500, accountAge: 24, createdAt: '2025-01-03T09:45:00.000Z' }
  ]);

  const [selectedTimeframe, setSelectedTimeframe] = useState<number>(12);
  const [projectedResults, setProjectedResults] = useState<any>(null);

  const handleScenarioChange = (scenario: Scenario) => {
    setCurrentScenario(scenario);
    setTimeout(() => {
      setProjectedResults({
        creditScoreChange: Math.floor(Math.random() * 100) + 20,
        totalInterestSaved: Math.floor(Math.random() * 5000) + 1000,
        payoffDate: new Date(Date.now() + (scenario.payoffTimeline ?? 0) * 30 * 24 * 60 * 60 * 1000)
      });
    }, 500);
  };

  const handleSaveScenario = (scenario: Scenario) => {
    const newScenario: Scenario = {
      ...scenario,
      id: savedScenarios.length + 1,
      createdAt: new Date().toISOString()
    };
    setSavedScenarios(prev => [...prev, newScenario]);
  };

  const handleTimeframeChange = (tf: number) => setSelectedTimeframe(tf);
  const handlePlayAnimation = (playing: boolean) => { /* no-op */ };
  const handleExportResults = (data: any) => { /* no-op */ };
  const handleLoadScenario = (scenario: Scenario) => { setCurrentScenario(scenario); handleScenarioChange(scenario); };
  const handleDeleteScenario = (id: number) => setSavedScenarios(prev => prev.filter(s => s.id !== id));

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Container chuẩn giữa + “nudge” sang trái (đồng bộ Overview/Analysis)
  const CONTAINER = 'mx-auto max-w-[1440px] px-6'; // mở rộng container 1 chút cho thoáng
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
      {/* Wrap toàn bộ trang bằng CurrencyProvider */}
      <CurrencyProvider>
        <div className={`${CONTAINER} ${NUDGE_LEFT}`}>
          <HeaderWithCurrencyToggle />

          {/* Giữ NGUYÊN bố cục lưới & component như file gốc (layout 5-5-5) */}
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
                  paymentAmount: 250, utilizationChange: -15, newAccounts: 0, payoffTimeline: 12, creditLimit: 5000
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
                savedScenarios={savedScenarios}
                onLoadScenario={handleLoadScenario}
                onDeleteScenario={handleDeleteScenario}
              />
            </div>
          </div>
        </div>
      </CurrencyProvider>
    </DashboardShell>
  );
}

/* ====== UI toggle tiền tệ ở header ====== */
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

      {/* Toggle pill neon */}
      <div
        className="flex items-center p-1 rounded-full border"
        style={{ borderColor: 'var(--color-border,#E5E7EB)', boxShadow: '0 6px 24px rgba(15,23,42,0.06)' }}
      >
        <button
          onClick={() => setCurrency('USD')}
          className={`px-4 h-9 rounded-full text-sm font-medium transition-all ${
            currency === 'USD' ? '!bg-[var(--color-neon,#12F7A0)] !text-[#0F172A]' : 'text-[var(--color-foreground,#0F172A)]'
          }`}
        >
          USD
        </button>
        <button
          onClick={() => setCurrency('VND')}
          className={`px-4 h-9 rounded-full text-sm font-medium transition-all ${
            currency === 'VND' ? '!bg-[var(--color-neon,#12F7A0)] !text-[#0F172A]' : 'text-[var(--color-foreground,#0F172A)]'
          }`}
        >
          VND
        </button>
      </div>
    </header>
  );
}
