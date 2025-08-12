// src/pages/dashboard/credit-factor-analysis-dashboard/components/FactorCorrelationHeatmap.tsx
// Next.js + TypeScript — UI/behaviour untouched
'use client';

import { cn } from '@/utils/cn';
import Icon from '@/components/AppIcon';
import { FactorKey } from '@/types/factors';
import React, { useState, useMemo } from 'react';

interface Factor {
  key: FactorKey;
  name: string;
  short: string;
}

interface FactorCorrelationHeatmapProps {
  onFactorHighlight?: (factors: [FactorKey, FactorKey]) => void;
}

const FactorCorrelationHeatmap: React.FC<FactorCorrelationHeatmapProps> = ({
  onFactorHighlight,
}) => {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  /* factors list */
  const factors: Factor[] = [
    { key: 'payment_history', name: 'Payment History', short: 'Payment' },
    { key: 'utilization', name: 'Credit Utilization', short: 'Utilization' },
    { key: 'credit_age', name: 'Credit Age', short: 'Age' },
    { key: 'new_credit', name: 'New Credit', short: 'New Credit' },
    { key: 'credit_mix', name: 'Credit Mix', short: 'Mix' },
  ];

  /* correlation matrix */
  const correlationData: Record<FactorKey, Record<FactorKey, number>> =
    useMemo(
      () => ({
        payment_history: {
          payment_history: 1,
          utilization: -0.65,
          credit_age: 0.72,
          new_credit: -0.43,
          credit_mix: 0.38,
        },
        utilization: {
          payment_history: -0.65,
          utilization: 1,
          credit_age: -0.52,
          new_credit: 0.34,
          credit_mix: -0.29,
        },
        credit_age: {
          payment_history: 0.72,
          utilization: -0.52,
          credit_age: 1,
          new_credit: -0.67,
          credit_mix: 0.45,
        },
        new_credit: {
          payment_history: -0.43,
          utilization: 0.34,
          credit_age: -0.67,
          new_credit: 1,
          credit_mix: -0.31,
        },
        credit_mix: {
          payment_history: 0.38,
          utilization: -0.29,
          credit_age: 0.45,
          new_credit: -0.31,
          credit_mix: 1,
        },
      }),
      [],
    );

  /* helpers */
  const getCorrelationColor = (v: number) => {
    if (v === 1) return 'bg-gray-100';
    if (v > 0.7) return 'bg-emerald-600';
    if (v > 0.4) return 'bg-emerald-400';
    if (v > 0.1) return 'bg-emerald-200';
    if (v > -0.1) return 'bg-gray-100';
    if (v > -0.4) return 'bg-red-200';
    if (v > -0.7) return 'bg-red-400';
    return 'bg-red-600';
  };

  const getTextColor = (v: number) =>
    Math.abs(v) > 0.4 ? 'text-white' : 'text-gray-800';

  const getCorrelationStrength = (v: number) =>
    Math.abs(v) >= 0.7
      ? 'Strong'
      : Math.abs(v) >= 0.4
      ? 'Moderate'
      : Math.abs(v) >= 0.1
      ? 'Weak'
      : 'None';

  const getCorrelationDirection = (v: number) =>
    v > 0.1 ? 'Positive' : v < -0.1 ? 'Negative' : 'Neutral';

  const handleCellClick = (row: FactorKey, col: FactorKey) => {
    const key = `${row}-${col}`;
    setSelectedCell(prev => (prev === key ? null : key));
    onFactorHighlight?.([row, col]);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {/* heading */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Factor Correlation Matrix
          </h3>
          <p className="text-sm text-muted-foreground">
            Understand how credit factors influence each other
          </p>
        </div>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Info" size={16} />
          <span>Click cells to highlight</span>
        </div>
      </header>

      {/* heat-map */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* header row */}
          <div className="grid grid-cols-6 gap-1 mb-1">
            <div className="h-12" />
            {factors.map(f => (
              <div key={f.key} className="h-12 flex items-center justify-center">
                <span className="text-xs font-medium text-muted-foreground text-center">
                  {f.short}
                </span>
              </div>
            ))}
          </div>

          {/* rows */}
          {factors.map(row => (
            <div key={row.key} className="grid grid-cols-6 gap-1 mb-1">
              {/* row label */}
              <div className="h-12 flex items-center justify-end pr-2">
                <span className="text-xs font-medium text-muted-foreground text-right">
                  {row.short}
                </span>
              </div>

              {/* cells */}
              {factors.map(col => {
                const v = correlationData[row.key][col.key];
                const key = `${row.key}-${col.key}`;
                const isSel = selectedCell === key;
                const isHover = hoveredCell === key;

                return (
                  <div
                    key={col.key}
                    className={`h-12 flex items-center justify-center rounded cursor-pointer transition-all ${
                      getCorrelationColor(v)
                    } ${isSel ? 'ring-2 ring-primary ring-offset-2' : ''} ${
                      isHover ? 'scale-105 shadow-elevation-2' : ''
                    } hover:scale-105 hover:shadow-elevation-2`}
                    onClick={() => handleCellClick(row.key, col.key)}
                    onMouseEnter={() => setHoveredCell(key)}
                    onMouseLeave={() => setHoveredCell(null)}
                    title={`${row.name} vs ${col.name}: ${v.toFixed(2)}`}
                  >
                    <span className={`text-xs font-semibold ${getTextColor(v)}`}>
                      {v.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* legend */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">
            Correlation Strength
          </span>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Strong Negative</span>
            <span>Weak</span>
            <span>Strong Positive</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {[
            'bg-red-600',
            'bg-red-400',
            'bg-red-200',
            'bg-gray-100',
            'bg-emerald-200',
            'bg-emerald-400',
            'bg-emerald-600',
          ].map(c => (
            <div key={c} className={`w-6 h-4 rounded-sm ${c}`} />
          ))}
          <div className="ml-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span>-1.0</span>
            <span>0</span>
            <span>+1.0</span>
          </div>
        </div>
      </div>

      {/* details */}
      {selectedCell && (() => {
        const [r, c] = selectedCell.split('-') as [FactorKey, FactorKey];
        const v = correlationData[r][c];
        const row = factors.find(f => f.key === r)!;
        const col = factors.find(f => f.key === c)!;

        return (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  Correlation Details
                </h4>

                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Factors:</span>
                    <span className="font-medium text-foreground">
                      {row.name} × {col.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Correlation:</span>
                    <span className="font-medium text-foreground">
                      {v.toFixed(3)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Strength:</span>
                    <span className="font-medium text-foreground">
                      {getCorrelationStrength(v)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Direction:</span>
                    <span className="font-medium text-foreground">
                      {getCorrelationDirection(v)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCell(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default FactorCorrelationHeatmap;
