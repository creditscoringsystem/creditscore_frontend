// This file is part of the Credit Scoring UI project.
// src/components/ui/ImpactSummaryCards.tsx
'use client';

import React from 'react';
import Icon from '@/components/AppIcon';

interface Scenario {
  paymentAmount: number;
  utilizationChange: number;
  newAccounts: number;
  payoffTimeline: number;
  creditLimit: number;
}

type ColorKey = 'success' | 'warning' | 'destructive' | 'muted-foreground';
type TrendKey = 'up' | 'down' | 'neutral';

interface Impact {
  id: string;
  title: string;
  icon: string;
  currentValue: string;
  projectedValue: string | number;
  impact: number;
  description: string;
  color: ColorKey;
  trend: TrendKey;
}

interface ImpactSummaryCardsProps {
  currentScenario?: Scenario | null;
  projectedResults?: any; // reserved
}

/* ===== Local palette (fallback) ===== */
const C = {
  card: 'var(--color-card, #FFFFFF)',
  border: 'var(--color-border, #E5E7EB)',
  fg: 'var(--color-foreground, #0F172A)',
  muted: 'var(--color-muted-foreground, #6B7280)',
  shadow: '0 6px 24px rgba(15,23,42,0.06)',
};

const accent = (k: ColorKey) => {
  switch (k) {
    case 'success':
      return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    case 'warning':
      return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
    case 'destructive':
      return { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' };
    default:
      return { text: 'text-muted-foreground', bg: 'bg-slate-50', border: 'border-border' };
  }
};

const trendIconOf = (t: TrendKey) => (t === 'up' ? 'TrendingUp' : t === 'down' ? 'TrendingDown' : 'Minus');
const trendTextOf = (t: TrendKey) =>
  t === 'up' ? 'text-emerald-600' : t === 'down' ? 'text-rose-600' : 'text-muted-foreground';

/* Fallback để luôn có số liệu */
const FALLBACK_SCENARIO: Scenario = {
  paymentAmount: 250,
  utilizationChange: -15,
  newAccounts: 0,
  payoffTimeline: 12,
  creditLimit: 5000,
};

export default function ImpactSummaryCards({ currentScenario }: ImpactSummaryCardsProps) {
  const calculateImpacts = (scenario: Scenario): Impact[] => {
    const baseScore = 720;
    const paymentImpact = (scenario.paymentAmount / 100) * 2.5;
    const utilizationImpact = Math.abs(scenario.utilizationChange) * 1.2;
    const newAccountImpact = scenario.newAccounts * -8;
    const payoffImpact = scenario.payoffTimeline <= 12 ? 20 : 12;
    const creditLimitImpact = (scenario.creditLimit / 1000) * 0.8;

    return [
      {
        id: 'payment',
        title: 'Payment History',
        icon: 'CreditCard',
        currentValue: '35%',
        projectedValue: '38%',
        impact: Math.round(paymentImpact),
        description: `Additional $${scenario.paymentAmount}/month payment`,
        color: paymentImpact > 0 ? 'success' : 'muted-foreground',
        trend: paymentImpact > 0 ? 'up' : 'neutral',
      },
      {
        id: 'utilization',
        title: 'Credit Utilization',
        icon: 'PieChart',
        currentValue: '65%',
        projectedValue: `${Math.max(10, 65 + scenario.utilizationChange)}%`,
        impact: Math.round(utilizationImpact),
        description: `${scenario.utilizationChange > 0 ? 'Increase' : 'Decrease'} by ${Math.abs(
          scenario.utilizationChange,
        )}%`,
        color: scenario.utilizationChange < 0 ? 'success' : 'destructive',
        trend: scenario.utilizationChange < 0 ? 'up' : 'down',
      },
      {
        id: 'newCredit',
        title: 'New Credit Accounts',
        icon: 'Plus',
        currentValue: '2',
        projectedValue: 2 + scenario.newAccounts,
        impact: Math.round(newAccountImpact),
        description: `${scenario.newAccounts} new account${scenario.newAccounts !== 1 ? 's' : ''}`,
        color: scenario.newAccounts === 0 ? 'success' : 'destructive',
        trend: scenario.newAccounts === 0 ? 'neutral' : 'down',
      },
      {
        id: 'payoff',
        title: 'Debt Payoff',
        icon: 'Target',
        currentValue: '24 mo',
        projectedValue: `${scenario.payoffTimeline} mo`,
        impact: Math.round(payoffImpact),
        description: `Complete payoff in ${scenario.payoffTimeline} months`,
        color: scenario.payoffTimeline <= 12 ? 'success' : 'warning',
        trend: scenario.payoffTimeline <= 12 ? 'up' : 'neutral',
      },
      {
        id: 'creditLimit',
        title: 'Credit Limit',
        icon: 'TrendingUp',
        currentValue: '$15,000',
        projectedValue: `$${(15000 + scenario.creditLimit).toLocaleString()}`,
        impact: Math.round(creditLimitImpact),
        description: `$${scenario.creditLimit.toLocaleString()} limit increase`,
        color: scenario.creditLimit > 0 ? 'success' : 'muted-foreground',
        trend: scenario.creditLimit > 0 ? 'up' : 'neutral',
      },
      {
        id: 'overall',
        title: 'Overall Impact',
        icon: 'BarChart3',
        currentValue: '720',
        projectedValue: Math.round(
          baseScore + paymentImpact + utilizationImpact + newAccountImpact + payoffImpact + creditLimitImpact,
        ),
        impact: Math.round(paymentImpact + utilizationImpact + newAccountImpact + payoffImpact + creditLimitImpact),
        description: 'Combined effect of all changes',
        color:
          paymentImpact + utilizationImpact + newAccountImpact + payoffImpact + creditLimitImpact > 0
            ? 'success'
            : 'destructive',
        trend:
          paymentImpact + utilizationImpact + newAccountImpact + payoffImpact + creditLimitImpact > 0 ? 'up' : 'down',
      },
    ];
  };

  const impacts = calculateImpacts(currentScenario ?? FALLBACK_SCENARIO);

  /* ===== DỌC 1 CỘT: giống Progress Timeline ===== */
  return (
    <div className="space-y-4">
      {impacts.map((impact) => {
        const ac = accent(impact.color);
        const showBar = impact.id === 'overall';

        return (
          <div
            key={impact.id}
            className="rounded-2xl border px-5 py-4 flex items-center justify-between"
            style={{ background: C.card, borderColor: C.border, boxShadow: C.shadow }}
          >
            {/* Left block: icon + title + meta */}
            <div className="flex items-start gap-4 min-w-0">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${ac.bg} ${ac.border} border`}>
                <Icon name={impact.icon} size={20} className={ac.text} />
              </div>

              <div className="min-w-0">
                <div className="text-base font-semibold truncate" style={{ color: C.fg }}>
                  {impact.title}
                </div>

                <div className="mt-1 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-xs" style={{ color: C.muted }}>
                      Current
                    </div>
                    <div className="font-medium" style={{ color: C.fg }}>
                      {impact.currentValue}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: C.muted }}>
                      Projected
                    </div>
                    <div className={`font-semibold ${ac.text}`}>{impact.projectedValue}</div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: C.muted }}>
                      Impact
                    </div>
                    <div className={`font-bold ${trendTextOf(impact.trend)}`}>
                      {impact.impact > 0 ? `+${impact.impact}` : impact.impact}
                      {impact.id !== 'overall' && ' pts'}
                    </div>
                  </div>
                </div>

                {/* description / progress */}
                {!showBar ? (
                  <p className="mt-2 text-xs" style={{ color: C.muted }}>
                    {impact.description}
                  </p>
                ) : (
                  <div className="mt-3">
                    <div className="w-full rounded-full h-2 bg-slate-100" role="progressbar" aria-valuemin={-50} aria-valuemax={50}>
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          impact.impact > 0 ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.abs(impact.impact) * 2)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-1" style={{ color: C.muted }}>
                      <span>0</span>
                      <span>+50 pts</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right block: trend icon + big value (giống ô số ở timeline) */}
            <div className="ml-6 text-right shrink-0">
              <Icon name={trendIconOf(impact.trend)} size={18} className={`mx-auto ${trendTextOf(impact.trend)} mb-1`} />
              <div className="text-2xl font-bold" style={{ color: C.fg }}>
                {impact.id === 'overall' ? impact.projectedValue : impact.projectedValue}
              </div>
              {impact.id === 'overall' && (
                <div className="text-xs" style={{ color: C.muted }}>
                  projected
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
