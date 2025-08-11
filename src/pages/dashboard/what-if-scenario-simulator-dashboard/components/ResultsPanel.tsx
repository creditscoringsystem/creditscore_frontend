// src/pages/dashboard/what-if-scenario-simulator-dashboard/components/ResultsPanel.tsx
'use client';

import React, { useMemo, useState } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

interface FactorImpact {
  factor: string;
  current: number;
  projected: number;
  change: number;
}

interface ScoreRange {
  min: number;
  max: number;
  target: number;
}

interface ProjectedResults {
  scoreRange?: ScoreRange;
  confidenceLevel?: number;
  timeToTarget?: number;
  factorImpacts?: FactorImpact[];
  monthlyProgress?: { month: number; score: number; confidence: number }[];
  creditScoreChange?: number;
  totalInterestSaved?: number;
  payoffDate?: Date | string;
}

interface ResultsPanelProps {
  currentScenario?: any;
  projectedResults?: ProjectedResults;
  onExportResults?: (data: any) => void;
}

/* ================= helpers ================= */
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const monthsBetween = (to?: Date | string) => {
  if (!to) return undefined;
  const d = typeof to === 'string' ? new Date(to) : to;
  if (Number.isNaN(d.getTime())) return undefined;
  const now = new Date();
  return Math.max(0, (d.getFullYear() - now.getFullYear()) * 12 + (d.getMonth() - now.getMonth()));
};

const buildSafeResults = (raw?: ProjectedResults): Required<ProjectedResults> => {
  const defaults: Required<ProjectedResults> = {
    scoreRange: { min: 745, max: 785, target: 765 },
    confidenceLevel: 87,
    timeToTarget: 8,
    factorImpacts: [
      { factor: 'Payment History',     current: 35, projected: 38, change:  3 },
      { factor: 'Credit Utilization',  current: 25, projected: 30, change:  5 },
      { factor: 'Length of History',   current: 15, projected: 16, change:  1 },
      { factor: 'Credit Mix',          current: 10, projected: 10, change:  0 },
      { factor: 'New Credit',          current: 10, projected:  8, change: -2 },
    ],
    monthlyProgress: [
      { month:  1, score: 725, confidence: 90 },
      { month:  3, score: 740, confidence: 88 },
      { month:  6, score: 755, confidence: 86 },
      { month: 12, score: 765, confidence: 85 },
    ],
    creditScoreChange: 0,
    totalInterestSaved: 0,
    payoffDate: undefined as unknown as Date,
  };

  if (!raw) return defaults;

  let sr = raw.scoreRange;
  if (!sr && typeof raw.creditScoreChange === 'number') {
    const base = 720;
    const tgt = clamp(base + raw.creditScoreChange, 300, 850);
    sr = { min: clamp(tgt - 25, 300, 850), max: clamp(tgt + 25, 300, 850), target: tgt };
  }
  const months = raw.timeToTarget ?? monthsBetween(raw.payoffDate);

  return {
    scoreRange:       { ...defaults.scoreRange, ...(sr ?? {}) },
    confidenceLevel:  raw.confidenceLevel  ?? defaults.confidenceLevel,
    timeToTarget:     months               ?? defaults.timeToTarget,
    factorImpacts:    raw.factorImpacts    ?? defaults.factorImpacts,
    monthlyProgress:  raw.monthlyProgress  ?? defaults.monthlyProgress,
    creditScoreChange: raw.creditScoreChange ?? defaults.creditScoreChange,
    totalInterestSaved: raw.totalInterestSaved ?? defaults.totalInterestSaved,
    payoffDate:       (raw.payoffDate as any) ?? (defaults.payoffDate as any),
  };
};

const toneForChange = (v: number) =>
  v > 0 ? 'text-emerald-600' : v < 0 ? 'text-rose-600' : 'text-slate-500';

const iconForChange = (v: number) =>
  v > 0 ? 'TrendingUp' : v < 0 ? 'TrendingDown' : 'Minus';

/* ================= component ================= */
const ResultsPanel: React.FC<ResultsPanelProps> = ({
  currentScenario,
  projectedResults,
  onExportResults,
}) => {
  const [showDetails, setShowDetails] = useState(true);
  const results = useMemo(() => buildSafeResults(projectedResults), [projectedResults]);

  const handleExport = () => {
    onExportResults?.({
      scenario: currentScenario,
      results,
      exportedAt: new Date().toISOString(),
    });
  };

  return (
    <div
      className="rounded-xl border shadow-elevation-1 bg-card"
      style={{ borderColor: 'var(--color-border,#E5E7EB)' }}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--color-border,#E5E7EB)' }}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Icon name="BarChart3" size={18} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold" style={{ color: '#0F172A' }}>
                Projection Results
              </h3>
              <p className="text-xs" style={{ color: '#374151' }}>
                Expected outcomes and timeline
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" iconName="Download" onClick={handleExport}>
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName={showDetails ? 'ChevronUp' : 'ChevronDown'}
              onClick={() => setShowDetails((s) => !s)}
            >
              {showDetails ? 'Less' : 'More'}
            </Button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-6">
        {/* ===== Hero numbers (nhỏ & gọn – bám đúng design) ===== */}
        <div className="rounded-lg bg-gradient-to-r from-emerald-50/60 to-sky-50/60 px-4 py-5">
          <div className="text-center">
            <div className="text-[28px] leading-7 font-bold text-emerald-600">
              {results.scoreRange.target}
            </div>
            <div className="text-xs mt-1" style={{ color: '#374151' }}>
              Projected Score
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-[13px] font-semibold" style={{ color: '#0F172A' }}>
                {results.scoreRange.min} – {results.scoreRange.max}
              </div>
              <div className="text-[11px]" style={{ color: '#374151' }}>
                Score Range
              </div>
            </div>
            <div>
              <div className="text-[13px] font-semibold text-emerald-600">
                {results.confidenceLevel}%
              </div>
              <div className="text-[11px]" style={{ color: '#374151' }}>
                Confidence
              </div>
            </div>
            <div>
              <div className="text-[13px] font-semibold text-amber-500">
                {results.timeToTarget} mo
              </div>
              <div className="text-[11px]" style={{ color: '#374151' }}>
                To Target
              </div>
            </div>
          </div>
        </div>

        {/* ===== Factor impact (bám layout: trái-phải, nhỏ gọn, icon màu) ===== */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold" style={{ color: '#0F172A' }}>
              Factor Impact Analysis
            </h4>
            <span className="text-xs" style={{ color: '#374151' }}>
              Current vs Projected
            </span>
          </div>

          <div className="space-y-2">
            {results.factorImpacts.map((f, i) => (
              <div
                key={`${f.factor}-${i}`}
                className="flex items-center justify-between rounded-lg border px-3 py-2"
                style={{ borderColor: 'var(--color-border,#E5E7EB)' }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-md bg-slate-50 flex items-center justify-center">
                    <Icon name={iconForChange(f.change)} size={16} className={toneForChange(f.change)} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium truncate" style={{ color: '#0F172A' }}>
                      {f.factor}
                    </div>
                    <div className="text-[11px]" style={{ color: '#374151' }}>
                      {f.current}% → {f.projected}%
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className={`text-[13px] font-semibold ${toneForChange(f.change)}`}>
                    {f.change > 0 ? '+' : ''}{f.change}%
                  </div>
                  <div className="text-[11px]" style={{ color: '#374151' }}>
                    Impact
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Progress timeline (card dọc, số ở phải) ===== */}
        {showDetails && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold" style={{ color: '#0F172A' }}>
              Progress Timeline
            </h4>

            <div className="space-y-2">
              {results.monthlyProgress.map((m) => (
                <div
                  key={m.month}
                  className="flex items-center justify-between rounded-lg border px-3 py-3"
                  style={{ borderColor: 'var(--color-border,#E5E7EB)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-emerald-500 text-white text-[13px] leading-8 text-center font-semibold">
                      {m.month}
                    </div>
                    <div>
                      <div className="text-[13px] font-medium" style={{ color: '#0F172A' }}>
                        Month {m.month}
                      </div>
                      <div className="text-[11px]" style={{ color: '#374151' }}>
                        {m.confidence}% confidence
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-[15px] font-bold ${
                        m.score >= 750 ? 'text-emerald-600' : m.score >= 700 ? 'text-amber-600' : 'text-rose-600'
                      }`}
                    >
                      {m.score}
                    </div>
                    <div className="text-[11px]" style={{ color: '#374151' }}>
                      +{m.score - 720} pts
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== Key insights ===== */}
        <div className="rounded-lg border px-4 py-3" style={{ borderColor: 'var(--color-border,#E5E7EB)' }}>
          <div className="flex items-start gap-3">
            <Icon name="Lightbulb" size={18} className="text-emerald-600 mt-0.5" />
            <div>
              <h5 className="text-sm font-semibold" style={{ color: '#0F172A' }}>Key Insights</h5>
              <ul className="mt-1 space-y-1 text-[13px]" style={{ color: '#374151' }}>
                <li>• Reducing utilization by 15% has the highest impact</li>
                <li>• Additional payments accelerate improvement</li>
                <li>• Target score of {results.scoreRange.target}+ achievable in {results.timeToTarget} months</li>
                <li>• Avoid opening new accounts during this period</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ===== Recommendations ===== */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold" style={{ color: '#0F172A' }}>
            Recommended Actions
          </h4>

          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-3 rounded-lg border px-3 py-2 bg-emerald-50/50 border-emerald-100">
              <Icon name="CheckCircle" size={16} className="text-emerald-600" />
              <span className="text-[13px]" style={{ color: '#0F172A' }}>
                Pay down high-utilization cards first
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border px-3 py-2 bg-amber-50/50 border-amber-100">
              <Icon name="AlertTriangle" size={16} className="text-amber-600" />
              <span className="text-[13px]" style={{ color: '#0F172A' }}>
                Set up automatic payments to avoid late fees
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border px-3 py-2 bg-sky-50/50 border-sky-100">
              <Icon name="Info" size={16} className="text-sky-600" />
              <span className="text-[13px]" style={{ color: '#0F172A' }}>
                Monitor progress monthly for best results
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;
