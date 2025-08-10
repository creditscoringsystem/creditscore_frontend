// src/pages/dashboard/what-if-scenario-simulator-dashboard/components/ScenarioComparison.tsx
'use client';

import React, { useMemo, useState } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

export type ScenarioItem = {
  id: string | number;
  name: string;
  paymentAmount: number;
  utilizationChange: number;
  newAccounts: number;
  payoffTimeline: number;
  creditLimit: number;
  accountAge: number;
  createdAt: string;
};

interface ScenarioComparisonProps {
  savedScenarios: ScenarioItem[];
  onLoadScenario: (scenario: ScenarioItem) => void;
  onDeleteScenario: (id: string | number) => void;
}

interface ComparisonData extends ScenarioItem {
  projectedScore: number;
  timeToTarget: number;
  totalCost: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export default function ScenarioComparison({
  savedScenarios,
  onLoadScenario,
  onDeleteScenario,
}: ScenarioComparisonProps) {
  const [selectedScenarios, setSelectedScenarios] = useState<(string | number)[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'score'>('date');
  const [showComparison, setShowComparison] = useState(false);

  /* ---------- helpers ---------- */
  const fmtUSD = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US'); // 1/5/2025 như trong mock
  };

  const generateComparisonData = (scenarios: ScenarioItem[]): ComparisonData[] =>
    scenarios.map(s => ({
      ...s,
      projectedScore: Math.round(720 + s.paymentAmount / 50 + Math.abs(s.utilizationChange) - s.newAccounts * 5),
      timeToTarget: Math.max(3, 12 - Math.floor(s.paymentAmount / 100)),
      totalCost: s.paymentAmount * 12,
      riskLevel: s.newAccounts > 2 ? 'High' : s.utilizationChange > 0 ? 'Medium' : 'Low',
    }));

  const handleSelect = (id: string | number) => {
    setSelectedScenarios(sel =>
      sel.includes(id) ? sel.filter(x => x !== id) : sel.length < 4 ? [...sel, id] : sel,
    );
  };

  const sorted = useMemo(() => {
    const clone = [...savedScenarios];
    if (sortBy === 'name') clone.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'score') {
      clone.sort((a, b) => {
        const sa = 720 + a.paymentAmount / 50 + Math.abs(a.utilizationChange);
        const sb = 720 + b.paymentAmount / 50 + Math.abs(b.utilizationChange);
        return sb - sa;
      });
    } else {
      clone.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }
    return clone;
  }, [savedScenarios, sortBy]);

  const comparisonData = generateComparisonData(
    savedScenarios.filter(s => selectedScenarios.includes(s.id)),
  );

  const riskColor = (r: ComparisonData['riskLevel']) =>
    r === 'Low' ? 'text-success bg-success/10' : r === 'Medium' ? 'text-warning bg-warning/10' : 'text-destructive bg-destructive/10';

  /* ---------- empty ---------- */
  if (savedScenarios.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-elevation-1 p-10 text-center">
        <Icon name="Bookmark" size={24} className="text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-foreground">No Saved Scenarios</h3>
        <p className="text-sm text-muted-foreground">
          Create and save scenarios to compare different credit improvement strategies.
        </p>
      </div>
    );
  }

  /* ---------- main ---------- */
  return (
    <section className="bg-card border border-border rounded-lg shadow-elevation-1">
      {/* Header */}
      <header className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex w-9 h-9 rounded-xl items-center justify-center bg-accent/10">
              <Icon name="GitCompare" size={18} className="text-accent" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Scenario Comparison</h3>
              <p className="text-sm text-muted-foreground">Compare up to 4 saved scenarios side by side</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="sort">Sort</label>
            <select
              id="sort"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="text-sm border border-border rounded-full px-4 py-2 bg-background text-foreground hover:border-foreground/30"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="score">Sort by Score</option>
            </select>

            {selectedScenarios.length >= 2 && !showComparison && (
              <Button
                variant="default"
                size="sm"
                iconName="BarChart3"
                onClick={() => setShowComparison(true)}
              >
                Compare ({selectedScenarios.length})
              </Button>
            )}
          </div>
        </div>

        {selectedScenarios.length > 0 && !showComparison && (
          <p className="mt-2 text-sm text-muted-foreground">{selectedScenarios.length} of 4 selected</p>
        )}
      </header>

      {/* Body */}
      <div className="p-6">
        {!showComparison ? (
          <div className="space-y-4">
            {sorted.map(s => {
              const selected = selectedScenarios.includes(s.id);
              const utilColor =
                s.utilizationChange < 0
                  ? 'text-success'
                  : s.utilizationChange > 0
                  ? 'text-destructive'
                  : 'text-muted-foreground';

              return (
                <div
                  key={s.id}
                  onClick={() => handleSelect(s.id)}
                  className={[
                    'rounded-xl border transition-smooth cursor-pointer',
                    selected ? 'border-primary bg-primary/5 shadow-elevation-1' : 'border-border hover:border-primary/40 hover:shadow-elevation-1',
                    'px-5 py-4',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Left: checkbox + name + created date */}
                    <div className="flex items-center gap-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => handleSelect(s.id)}
                        onClick={e => e.stopPropagation()}
                        className="w-[18px] h-[18px] rounded border-border text-primary"
                        aria-label={`Select ${s.name}`}
                      />
                      <div className="min-w-0">
                        <div className="font-medium text-foreground truncate">{s.name}</div>
                        <div className="text-xs text-muted-foreground">Created {formatDate(s.createdAt)}</div>
                      </div>
                    </div>

                    {/* Right: metrics + actions */}
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="text-right">
                        <div className="text-[15px] font-semibold text-foreground">
                          {fmtUSD(s.paymentAmount)}/mo
                        </div>
                        <div className="text-xs text-muted-foreground">Payment</div>
                      </div>

                      <div className="text-right">
                        <div className={`text-[15px] font-semibold ${utilColor}`}>
                          {s.utilizationChange > 0 ? '+' : ''}
                          {s.utilizationChange}%
                        </div>
                        <div className="text-xs text-muted-foreground">Utilization</div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Play"
                        onClick={e => {
                          e.stopPropagation();
                          onLoadScenario(s);
                        }}
                      >
                        Load
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Trash2"
                        className="text-destructive hover:text-destructive"
                        onClick={e => {
                          e.stopPropagation();
                          const ok = window.confirm(`Delete scenario "${s.name}"?`);
                          if (ok) onDeleteScenario(s.id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Comparison table */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-foreground">Comparison</h4>
              <Button
                variant="outline"
                size="sm"
                iconName="ArrowLeft"
                onClick={() => setShowComparison(false)}
              >
                Back
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-3 text-left text-sm font-semibold">Metric</th>
                    {comparisonData.map(c => (
                      <th key={c.id} className="p-3 text-center text-sm font-semibold">{c.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-3 text-sm text-muted-foreground">Projected Score</td>
                    {comparisonData.map(c => (
                      <td key={c.id} className="p-3 text-center text-success font-semibold">
                        {c.projectedScore}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-sm text-muted-foreground">Time to Target</td>
                    {comparisonData.map(c => (
                      <td key={c.id} className="p-3 text-center text-warning font-semibold">
                        {c.timeToTarget} mo
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-sm text-muted-foreground">Total Cost (12mo)</td>
                    {comparisonData.map(c => (
                      <td key={c.id} className="p-3 text-center text-foreground font-semibold">
                        {fmtUSD(c.totalCost)}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-sm text-muted-foreground">Risk Level</td>
                    {comparisonData.map(c => (
                      <td key={c.id} className="p-3 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${riskColor(c.riskLevel)}`}>
                          {c.riskLevel}
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-success/5 border border-success/20 rounded-lg p-4">
              <Icon name="Award" size={20} className="text-success inline mr-2" />
              <span className="text-sm text-foreground">
                Best scenario: <strong>{comparisonData[0]?.name}</strong>
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
