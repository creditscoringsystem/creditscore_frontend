// src/pages/dashboard/what-if-scenario-simulator-dashboard/components/ScenarioComparison.tsx
'use client';

import React, { useState } from 'react';
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

  const generateComparisonData = (scenarios: ScenarioItem[]): ComparisonData[] =>
    scenarios.map(s => ({
      ...s,
      projectedScore: Math.round(720 + s.paymentAmount / 50 + Math.abs(s.utilizationChange) - s.newAccounts * 5),
      timeToTarget: Math.max(3, 12 - Math.floor(s.paymentAmount / 100)),
      totalCost: s.paymentAmount * 12,
      riskLevel: s.newAccounts > 2
        ? 'High'
        : s.utilizationChange > 0
          ? 'Medium'
          : 'Low',
    }));

  const handleSelect = (id: string | number) => {
    setSelectedScenarios(sel =>
      sel.includes(id)
        ? sel.filter(x => x !== id)
        : sel.length < 4 ? [...sel, id] : sel
    );
  };

  const sorted = [...savedScenarios].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'score') {
      const sa = 720 + a.paymentAmount / 50 + Math.abs(a.utilizationChange);
      const sb = 720 + b.paymentAmount / 50 + Math.abs(b.utilizationChange);
      return sb - sa;
    }
    // date
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const comparisonData = generateComparisonData(
    savedScenarios.filter(s => selectedScenarios.includes(s.id))
  );

  const riskColor = (r: ComparisonData['riskLevel']) => {
    if (r === 'Low') return 'text-success bg-success/10';
    if (r === 'Medium') return 'text-warning bg-warning/10';
    return 'text-destructive bg-destructive/10';
  };

  if (savedScenarios.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-elevation-1 p-8">
        <div className="text-center space-y-4">
          <Icon name="Bookmark" size={24} className="text-muted-foreground mx-auto" />
          <h3 className="text-lg font-semibold text-foreground">No Saved Scenarios</h3>
          <p className="text-sm text-muted-foreground">
            Create and save scenarios to compare different credit improvement strategies.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="GitCompare" size={20} className="text-accent" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">Scenario Comparison</h3>
              <p className="text-sm text-muted-foreground">Compare up to 4 saved scenarios</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="score">Sort by Score</option>
            </select>
            {selectedScenarios.length >= 2 && (
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
        {selectedScenarios.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {selectedScenarios.length} of 4 selected
          </p>
        )}
      </div>

      <div className="p-6">
        {!showComparison ? (
          <div className="space-y-4">
            {sorted.map(s => (
              <div
                key={s.id}
                className={`p-4 border rounded-lg cursor-pointer transition-smooth ${
                  selectedScenarios.includes(s.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleSelect(s.id)}
              >
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedScenarios.includes(s.id)}
                      onChange={() => handleSelect(s.id)}
                      className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                      onClick={e => e.stopPropagation()}
                    />
                    <span className="font-medium text-foreground">{s.name}</span>
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="text-sm text-foreground">${s.paymentAmount}/mo</div>
                    <div className="text-sm text-foreground">
                      {s.utilizationChange > 0 ? '+' : ''}{s.utilizationChange}%
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Play"
                      onClick={e => { e.stopPropagation(); onLoadScenario(s); }}
                    >
                      Load
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      className="text-destructive hover:text-destructive"
                      onClick={e => { e.stopPropagation(); onDeleteScenario(s.id); }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Back button */}
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-foreground">Comparison</h4>
              <Button variant="outline" size="sm" iconName="ArrowLeft" onClick={() => setShowComparison(false)}>
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
                        ${c.totalCost.toLocaleString()}
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

            {/* Recommendation */}
            <div className="bg-success/5 border border-success/20 rounded-lg p-4">
              <Icon name="Award" size={20} className="text-success inline mr-2" />
              <span className="text-sm text-foreground">
                Best scenario: <strong>{comparisonData[0]?.name}</strong>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
