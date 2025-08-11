// This file is part of the Credit Scoring UI project.
// src/components/ui/ImpactSummaryCards.tsx
'use client';

import React from 'react';
import Icon from '@/components/AppIcon';
import { useCurrency } from '@/pages/dashboard/what-if-scenario-simulator-dashboard/components/CurrencyContext';

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

/* ===== Palette fallback ===== */
const C = {
  card: 'var(--color-card, #FFFFFF)',
  border: 'var(--color-border, #E5E7EB)',
  fg: 'var(--color-foreground, #0F172A)',
  muted: 'var(--color-muted-foreground, #6B7280)',
  shadow: '0 6px 24px rgba(15,23,42,0.06)',
};

const accent = (k: ColorKey) => {
  switch (k) {
    case 'success': return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    case 'warning': return { text: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200' };
    case 'destructive': return { text: 'text-rose-600', bg: 'bg-rose-50',    border: 'border-rose-200' };
    default: return { text: 'text-muted-foreground', bg: 'bg-slate-50', border: 'border-border' };
  }
};
const trendIconOf = (t: TrendKey) => (t === 'up' ? 'TrendingUp' : t === 'down' ? 'TrendingDown' : 'Minus');
const trendTextOf = (t: TrendKey) => (t === 'up' ? 'text-emerald-600' : t === 'down' ? 'text-rose-600' : 'text-muted-foreground');

/* Co chữ số lớn theo độ dài chuỗi để không tràn */
const bigSize = (v: string | number) => {
  const len = String(v).length;
  if (len <= 10) return 'text-[20px]';
  if (len <= 14) return 'text-[18px]';
  if (len <= 18) return 'text-[16px]';
  return 'text-[14px]';
};

/* Fallback dữ liệu */
const FALLBACK_SCENARIO: Scenario = {
  paymentAmount: 250,
  utilizationChange: -15,
  newAccounts: 0,
  payoffTimeline: 12,
  creditLimit: 5000,
};

export default function ImpactSummaryCards({ currentScenario }: ImpactSummaryCardsProps) {
  const { formatMoney } = useCurrency();
  const s = currentScenario ?? FALLBACK_SCENARIO;

  // ====== tính toán impacts
  const baseScore = 720;
  const paymentImpact = (s.paymentAmount / 100) * 2.5;
  const utilizationImpact = Math.abs(s.utilizationChange) * 1.2;
  const newAccountImpact = s.newAccounts * -8;
  const payoffImpact = s.payoffTimeline <= 12 ? 20 : 12;
  const creditLimitImpact = (s.creditLimit / 1000) * 0.8;

  const impacts: Impact[] = [
    {
      id: 'payment',
      title: 'Payment History',
      icon: 'CreditCard',
      currentValue: '35%',
      projectedValue: '38%',
      impact: Math.round(paymentImpact),
      description: `Additional ${formatMoney(s.paymentAmount)}/month payment`,
      color: paymentImpact > 0 ? 'success' : 'muted-foreground',
      trend: paymentImpact > 0 ? 'up' : 'neutral',
    },
    {
      id: 'utilization',
      title: 'Credit Utilization',
      icon: 'PieChart',
      currentValue: '65%',
      projectedValue: `${Math.max(10, 65 + s.utilizationChange)}%`,
      impact: Math.round(utilizationImpact),
      description: `${s.utilizationChange > 0 ? 'Increase' : 'Decrease'} by ${Math.abs(s.utilizationChange)}%`,
      color: s.utilizationChange < 0 ? 'success' : 'destructive',
      trend: s.utilizationChange < 0 ? 'up' : 'down',
    },
    {
      id: 'newCredit',
      title: 'New Credit Accounts',
      icon: 'Plus',
      currentValue: '2',
      projectedValue: 2 + s.newAccounts,
      impact: Math.round(newAccountImpact),
      description: `${s.newAccounts} new account${s.newAccounts !== 1 ? 's' : ''}`,
      color: s.newAccounts === 0 ? 'success' : 'destructive',
      trend: s.newAccounts === 0 ? 'neutral' : 'down',
    },
    {
      id: 'payoff',
      title: 'Debt Payoff',
      icon: 'Target',
      currentValue: '24 mo',
      projectedValue: `${s.payoffTimeline} mo`,
      impact: Math.round(payoffImpact),
      description: `Complete payoff in ${s.payoffTimeline} months`,
      color: s.payoffTimeline <= 12 ? 'success' : 'warning',
      trend: s.payoffTimeline <= 12 ? 'up' : 'neutral',
    },
    {
      id: 'creditLimit',
      title: 'Credit Limit',
      icon: 'TrendingUp',
      currentValue: formatMoney(15000),
      projectedValue: formatMoney(15000 + s.creditLimit),
      impact: Math.round(creditLimitImpact),
      description: `${formatMoney(s.creditLimit)} limit increase`,
      color: s.creditLimit > 0 ? 'success' : 'muted-foreground',
      trend: s.creditLimit > 0 ? 'up' : 'neutral',
    },
    {
      id: 'overall',
      title: 'Overall Impact',
      icon: 'BarChart3',
      currentValue: '720',
      projectedValue: Math.round(
        baseScore + paymentImpact + utilizationImpact + newAccountImpact + payoffImpact + creditLimitImpact
      ),
      impact: Math.round(paymentImpact + utilizationImpact + newAccountImpact + payoffImpact + creditLimitImpact),
      description: 'Combined effect of all changes',
      color:
        paymentImpact + utilizationImpact + newAccountImpact + payoffImpact + creditLimitImpact > 0
          ? 'success'
          : 'destructive',
      trend: paymentImpact + utilizationImpact + newAccountImpact + payoffImpact + creditLimitImpact > 0 ? 'up' : 'down',
    },
  ];

  return (
    <div className="space-y-4">
      {impacts.map((impact) => {
        const ac = accent(impact.color);
        const showBar = impact.id === 'overall';

        return (
          <div
            key={impact.id}
            className="rounded-2xl border px-4 py-4 hover:shadow-md transition-shadow flex items-start justify-between gap-4"
            style={{ background: C.card, borderColor: C.border, boxShadow: C.shadow }}
          >
            {/* LEFT: icon + text */}
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className={`flex-none w-12 h-12 rounded-xl flex items-center justify-center ${ac.bg} ${ac.border} border`}>
                <Icon name={impact.icon} size={20} className={ac.text} />
              </div>

              <div className="min-w-0">
                <div className="text-[13px] font-semibold tracking-tight" style={{ color: C.fg }}>
                  {impact.title}
                </div>

                {/* meta: Current + Impact; dùng auto-fit để tự rớt, nhưng giữ kích cỡ tối thiểu nên không xô lệch */}
                <div
                  className="mt-1 grid gap-3 text-[11px]"
                  style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}
                >
                  <div className="min-w-[120px]">
                    <div style={{ color: C.muted }}>Current</div>
                    <div className="font-medium tabular-nums" style={{ color: C.fg }}>
                      {impact.currentValue}
                    </div>
                  </div>

                  <div className="min-w-[120px]">
                    <div style={{ color: C.muted }}>Impact</div>
                    <div className={`font-bold ${trendTextOf(impact.trend)}`}>
                      {impact.impact > 0 ? `+${impact.impact}` : impact.impact}
                      {impact.id !== 'overall' && ' pts'}
                    </div>
                  </div>
                </div>

                {!showBar ? (
                  <p className="mt-2 text-[11px] leading-relaxed" style={{ color: C.muted }}>
                    {impact.description}
                  </p>
                ) : (
                  <div className="mt-2">
                    <div className="w-full rounded-full h-2 bg-slate-100" role="progressbar" aria-valuemin={-50} aria-valuemax={50}>
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          impact.impact > 0 ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.abs(impact.impact) * 2)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] mt-1" style={{ color: C.muted }}>
                      <span>0</span>
                      <span>+50 pts</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: projected block (cột cố định) */}
            <div className="shrink-0 text-right w-[128px] sm:w-[144px] md:w-[160px]">
              <Icon name={trendIconOf(impact.trend)} size={16} className={`inline-block ${trendTextOf(impact.trend)} mb-1`} />
              <div
                className={`${bigSize(impact.projectedValue)} font-extrabold leading-6 tabular-nums break-words`}
                style={{ color: C.fg }}
                title={String(impact.projectedValue)}
              >
                {impact.projectedValue}
              </div>
              <div className="text-[11px]" style={{ color: C.muted }}>
                projected
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
