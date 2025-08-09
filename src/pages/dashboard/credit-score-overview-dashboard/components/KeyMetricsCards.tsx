'use client';

import React from 'react';
import Icon from '@/components/AppIcon';

interface Metrics {
  monthlyChange: number;
  utilizationRate: number;
  utilizationChange: number;
  daysSinceUpdate: number;
}
interface KeyMetricsCardsProps {
  metrics: Metrics;
  stacked?: boolean; // NEW
}

const KeyMetricsCards: React.FC<KeyMetricsCardsProps> = ({ metrics, stacked }) => {
  const changeColor = (v: number) =>
    v > 0 ? 'text-[#00FF88]' : v < 0 ? 'text-[#FF3B57]' : 'text-[#6B7280]';
  const changeIcon = (v: number) => (v > 0 ? 'TrendingUp' : v < 0 ? 'TrendingDown' : 'Minus');
  const formatDays = (d: number) => (d === 0 ? 'Today' : d === 1 ? '1 day ago' : `${d} days ago`);

  const cardBase =
    'rounded-xl border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_6px_18px_rgba(0,0,0,0.04)] p-6';

  const Wrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div className={stacked ? 'grid grid-cols-1 gap-6' : 'grid grid-cols-1 md:grid-cols-3 gap-6'}>
      {children}
    </div>
  );

  return (
    <Wrapper>
      {/* Monthly change */}
      <div className={cardBase}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#00FF88]/10 flex items-center justify-center">
            <Icon name="Calendar" size={20} className="text-[#00FF88]" />
          </div>
          <h3 className="text-sm font-medium text-[#6B7280]">Monthly Change</h3>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-[#0F172A]">
            {metrics.monthlyChange > 0 ? '+' : ''}
            {metrics.monthlyChange}
          </span>
          <span className={`flex items-center ${changeColor(metrics.monthlyChange)}`}>
            <Icon name={changeIcon(metrics.monthlyChange)} size={16} />
            <span className="text-sm ml-1">points</span>
          </span>
        </div>
        <p className="text-sm text-[#6B7280] mt-2">vs. last month</p>
      </div>

      {/* Utilization */}
      <div className={cardBase}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#00C2FF]/10 flex items-center justify-center">
            <Icon name="CreditCard" size={20} className="text-[#00C2FF]" />
          </div>
          <h3 className="text-sm font-medium text-[#6B7280]">Credit Utilization</h3>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-[#0F172A]">
            {metrics.utilizationRate}%
          </span>
          <span className={`flex items-center ${changeColor(metrics.utilizationChange)}`}>
            <Icon name={changeIcon(metrics.utilizationChange)} size={16} />
            <span className="text-sm ml-1">{Math.abs(metrics.utilizationChange)}%</span>
          </span>
        </div>

        <div className="mt-3">
          <div className="w-full h-2 rounded-full bg-[#F1F5F9]">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                metrics.utilizationRate <= 30 ? 'bg-[#00FF88]' :
                metrics.utilizationRate <= 50 ? 'bg-[#FFB020]' : 'bg-[#FF3B57]'
              }`}
              style={{ width: `${Math.min(metrics.utilizationRate, 100)}%` }}
            />
          </div>
          <p className="text-sm text-[#6B7280] mt-2">Recommended: &lt; 30%</p>
        </div>
      </div>

      {/* Last update */}
      <div className={cardBase}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#6366F1]/10 flex items-center justify-center">
            <Icon name="RefreshCw" size={20} className="text-[#6366F1]" />
          </div>
          <h3 className="text-sm font-medium text-[#6B7280]">Last Update</h3>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-[#0F172A]">
            {metrics.daysSinceUpdate}
          </span>
          <span className="text-sm text-[#6B7280]">
            {metrics.daysSinceUpdate === 1 ? 'day' : 'days'}
          </span>
        </div>

        <p className="text-sm text-[#6B7280] mt-2">{formatDays(metrics.daysSinceUpdate)}</p>

        <div className="mt-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
          <span className="text-xs text-[#00FF88]">Data is current</span>
        </div>
      </div>
    </Wrapper>
  );
};

export default KeyMetricsCards;
