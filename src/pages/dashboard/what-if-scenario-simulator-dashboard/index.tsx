'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';
import ScenarioControlPanel, { Scenario } from './components/ScenarioControlPanel';
import ScenarioVisualization from './components/ScenarioVisualization';
import ResultsPanel from './components/ResultsPanel';
import TimelineSlider from './components/TimelineSlider';
import ImpactSummaryCards from './components/ImpactSummaryCards';
import ScenarioComparison from './components/ScenarioComparison';

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

  const handleTimeframeChange = (tf: number) => {
    setSelectedTimeframe(tf);
  };

  const handlePlayAnimation = (playing: boolean) => {
    console.log('Playing animation for timeframe:', selectedTimeframe, playing);
  };

  const handleExportResults = (data: any) => {
    console.log('Exporting results:', data);
  };

  const handleLoadScenario = (scenario: Scenario) => {
    setCurrentScenario(scenario);
    handleScenarioChange(scenario);
  };

  const handleDeleteScenario = (id: number) => {
    setSavedScenarios(prev => prev.filter(s => s.id !== id));
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <div className="flex-1 ml-80">
          <Header />
          <main className="pt-20 px-6 py-8">
            {/* Loading skeleton */}
          </main>
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
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-foreground mb-2">Scenario Simulator</h1>
              <p className="text-muted-foreground">Model what-if scenarios for credit improvement</p>
            </div>
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <div className="hidden lg:grid lg:grid-cols-24 gap-6">
                <div className="lg:col-span-6 space-y-6">
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
                <div className="lg:col-span-12 space-y-6">
                  <ScenarioVisualization
                    currentScenario={currentScenario}
                    selectedTimeframe={selectedTimeframe}
                  />
                  <ImpactSummaryCards
                    currentScenario={currentScenario}
                    projectedResults={projectedResults}
                  />
                </div>
                <div className="lg:col-span-6 space-y-6">
                  <ResultsPanel
                    currentScenario={currentScenario}
                    projectedResults={projectedResults}
                    onExportResults={handleExportResults}
                  />
                </div>
              </div>
              <div className="hidden md:grid lg:hidden md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <ScenarioControlPanel
                    onScenarioChange={handleScenarioChange}
                    currentScenario={currentScenario}
                    onSaveScenario={handleSaveScenario}
                    savedScenarios={savedScenarios}
                  />
                  <ResultsPanel
                    currentScenario={currentScenario}
                    projectedResults={projectedResults}
                    onExportResults={handleExportResults}
                  />
                </div>
                <div className="space-y-6">
                  <ScenarioVisualization
                    currentScenario={currentScenario}
                    selectedTimeframe={selectedTimeframe}
                  />
                  <TimelineSlider
                    selectedTimeframe={selectedTimeframe}
                    onTimeframeChange={handleTimeframeChange}
                    onPlayAnimation={handlePlayAnimation}
                  />
                </div>
                <div className="md:col-span-2">
                  <ImpactSummaryCards
                    currentScenario={currentScenario}
                    projectedResults={projectedResults}
                  />
                </div>
              </div>
              <div className="md:hidden space-y-6">
                <ScenarioControlPanel
                  onScenarioChange={handleScenarioChange}
                  currentScenario={currentScenario}
                  onSaveScenario={handleSaveScenario}
                  savedScenarios={savedScenarios}
                />
                <ScenarioVisualization
                  currentScenario={currentScenario}
                  selectedTimeframe={selectedTimeframe}
                />
                <TimelineSlider
                  selectedTimeframe={selectedTimeframe}
                  onTimeframeChange={handleTimeframeChange}
                  onPlayAnimation={handlePlayAnimation}
                />
                <ResultsPanel
                  currentScenario={currentScenario}
                  projectedResults={projectedResults}
                  onExportResults={handleExportResults}
                />
                <ImpactSummaryCards
                  currentScenario={currentScenario}
                  projectedResults={projectedResults}
                />
              </div>
              <div className="lg:col-span-24 md:col-span-2 mt-8">
                <ScenarioComparison
                  savedScenarios={savedScenarios}
                  onLoadScenario={handleLoadScenario}
                  onDeleteScenario={handleDeleteScenario}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
