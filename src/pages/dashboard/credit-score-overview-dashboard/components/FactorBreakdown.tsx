// components/overview/FactorBreakdown.tsx
// Converted to TypeScript – layout & Tailwind giữ nguyên.

import React from 'react';
import Icon from '@/components/AppIcon';

/* ---------- types ---------- */
export type ImpactType = 'positive' | 'negative' | 'neutral';

export interface FactorItem {
  name: string;
  weight: number;         // % weight
  impact: ImpactType;     // text label
  score: number;          // 0–100
  description?: string;
  status?: string;
}

interface FactorBreakdownProps {
  factors: FactorItem[];
}

/* ---------- component ---------- */
const FactorBreakdown: React.FC<FactorBreakdownProps> = ({ factors }) => {
  /* helper -------------------------------------------------- */
  const getFactorIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'payment history':
        return 'Clock';
      case 'credit utilization':
        return 'CreditCard';
      case 'length of history':
        return 'Calendar';
      case 'new credit':
        return 'Plus';
      case 'credit mix':
        return 'BarChart3';
      default:
        return 'Info';
    }
  };

  const getImpactColor = (impact: ImpactType | undefined) => {
    switch (impact) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getImpactIcon = (impact: ImpactType | undefined) => {
    switch (impact) {
      case 'positive':
        return 'TrendingUp';
      case 'negative':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  const getBarColor = (impact: ImpactType | undefined) => {
    switch (impact) {
      case 'positive':
        return 'bg-success';
      case 'negative':
        return 'bg-destructive';
      default:
        return 'bg-muted-foreground';
    }
  };

  /* render --------------------------------------------------- */
  return (
    <section className="bg-card rounded-lg border border-border p-6 shadow-elevation-1">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Factor Breakdown
          </h3>
          <p className="text-sm text-muted-foreground">
            Impact on your credit score
          </p>
        </div>
        <button className="text-primary hover:text-primary/80 transition">
          <Icon name="HelpCircle" size={20} />
        </button>
      </div>

      {/* list */}
      <div className="space-y-6">
        {factors.map(factor => (
          <div key={factor.name} className="space-y-3">
            {/* header row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                  <Icon
                    name={getFactorIcon(factor.name)}
                    size={16}
                    className="text-muted-foreground"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    {factor.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {factor.weight}% of score
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Icon
                  name={getImpactIcon(factor.impact)}
                  size={16}
                  className={getImpactColor(factor.impact)}
                />
                <span
                  className={`text-sm font-medium ${getImpactColor(
                    factor.impact,
                  )}`}
                >
                  {factor.impact}
                </span>
              </div>
            </div>

            {/* progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
              <div className="relative">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getBarColor(
                      factor.impact,
                    )}`}
                    style={{ width: `${factor.score}%` }}
                  />
                </div>
                {/* indicator */}
                <div
                  className="absolute top-0 w-1 h-2 bg-foreground rounded-full -translate-x-0.5"
                  style={{ left: `${factor.score}%` }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">0%</span>
                <span className="text-sm font-medium text-foreground">
                  {factor.score}%
                </span>
                <span className="text-muted-foreground">100%</span>
              </div>
            </div>

            {/* details */}
            <div className="bg-muted/50 rounded-lg p-3">
              {factor.description && (
                <p className="text-xs text-muted-foreground mb-2">
                  {factor.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">
                  Current Status:
                </span>
                <span className="text-xs text-muted-foreground">
                  {factor.status ?? '—'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* action */}
      <div className="mt-6 pt-4 border-t border-border">
        <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary/90 transition flex items-center justify-center gap-2">
          <Icon name="Target" size={16} />
          <span>Get Improvement Tips</span>
        </button>
      </div>
    </section>
  );
};

export default FactorBreakdown;
