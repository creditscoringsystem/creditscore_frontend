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
  projectedResults?: any;
}

export default function ImpactSummaryCards({ currentScenario }: ImpactSummaryCardsProps) {
  const calculateImpacts = (scenario: Scenario): Impact[] => {
    if (!scenario) return [];

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
        trend: paymentImpact > 0 ? 'up' : 'neutral'
      },
      {
        id: 'utilization',
        title: 'Credit Utilization',
        icon: 'PieChart',
        currentValue: '65%',
        projectedValue: `${Math.max(10, 65 + scenario.utilizationChange)}%`,
        impact: Math.round(utilizationImpact),
        description: `${scenario.utilizationChange > 0 ? 'Increase' : 'Decrease'} by ${Math.abs(
          scenario.utilizationChange
        )}%`,
        color: scenario.utilizationChange < 0 ? 'success' : 'destructive',
        trend: scenario.utilizationChange < 0 ? 'up' : 'down'
      },
      {
        id: 'newCredit',
        title: 'New Credit Accounts',
        icon: 'Plus',
        currentValue: '2',
        projectedValue: 2 + scenario.newAccounts,
        impact: Math.round(newAccountImpact),
        description: `${scenario.newAccounts} new account${
          scenario.newAccounts !== 1 ? 's' : ''
        }`,
        color: scenario.newAccounts === 0 ? 'success' : 'destructive',
        trend: scenario.newAccounts === 0 ? 'neutral' : 'down'
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
        trend: scenario.payoffTimeline <= 12 ? 'up' : 'neutral'
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
        trend: scenario.creditLimit > 0 ? 'up' : 'neutral'
      },
      {
        id: 'overall',
        title: 'Overall Impact',
        icon: 'BarChart3',
        currentValue: '720',
        projectedValue: Math.round(
          baseScore + paymentImpact + utilizationImpact + newAccountImpact + payoffImpact + creditLimitImpact
        ),
        impact: Math.round(
          paymentImpact + utilizationImpact + newAccountImpact + payoffImpact + creditLimitImpact
        ),
        description: 'Combined effect of all changes',
        color:
          paymentImpact + utilizationImpact + newAccountImpact + payoffImpact + creditLimitImpact > 0
            ? 'success'
            : 'destructive',
        trend:
          paymentImpact + utilizationImpact + newAccountImpact + payoffImpact + creditLimitImpact > 0
            ? 'up'
            : 'down'
      }
    ];
  };

  const impacts = currentScenario ? calculateImpacts(currentScenario) : [];

  const getColorClasses = (color: ColorKey) => {
    switch (color) {
      case 'success':
        return 'text-success bg-success/10 border-success/20';
      case 'warning':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'destructive':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getTrendIcon = (trend: TrendKey) => {
    switch (trend) {
      case 'up':
        return 'TrendingUp';
      case 'down':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  const getTrendColor = (trend: TrendKey) => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  if (!currentScenario) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-card border border-border rounded-lg p-6 animate-pulse"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-muted rounded-lg"></div>
              <div className="w-6 h-6 bg-muted rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="w-24 h-4 bg-muted rounded"></div>
              <div className="w-16 h-6 bg-muted rounded"></div>
              <div className="w-32 h-3 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {impacts.map((impact) => (
        <div
          key={impact.id}
          className={`bg-card border rounded-lg p-6 transition-smooth hover:shadow-elevation-2 ${
            getColorClasses(impact.color)
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`${getColorClasses(impact.color)} w-10 h-10 rounded-lg flex items-center justify-center`}>
                <Icon name={impact.icon} size={20} className={impact.color === 'muted-foreground' ? 'text-muted-foreground' : ''} />
              </div>
              <h4 className="text-sm font-semibold text-foreground">{impact.title}</h4>
            </div>
            <Icon name={getTrendIcon(impact.trend)} size={20} className={getTrendColor(impact.trend)} />
          </div>

          {/* Values */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Current</span>
              <span className="text-sm font-medium text-foreground">{impact.currentValue}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Projected</span>
              <span className={`text-sm font-semibold ${impact.color}`}>{impact.projectedValue}</span>
            </div>
            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Impact</span>
                <div className="flex items-center space-x-1">
                  <span className={`text-sm font-bold ${getTrendColor(impact.trend)}`}>{impact.impact > 0 ? `+${impact.impact}` : impact.impact}</span>
                  {impact.id !== 'overall' && <span className="text-xs text-muted-foreground">pts</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">{impact.description}</p>
          </div>

          {/* Progress Bar for Overall Impact */}
          {impact.id === 'overall' && (
            <div className="mt-4">
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    impact.impact > 0 ? 'bg-success' : 'bg-destructive'
                  }`}
                  style={{ width: `${Math.min(100, Math.abs(impact.impact) * 2)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0</span>
                <span>+50 pts</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
