'use client';

import React from 'react';
import Icon from '@/components/AppIcon';

type RiskLevel = 'Excellent' | 'Good' | 'Fair' | 'Poor' | string;

interface ScoreGaugeProps {
  score: number;
  previousScore: number;
  percentile: number;
  riskLevel: RiskLevel;
  size?: 'md' | 'lg'; // NEW
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  previousScore,
  percentile,
  riskLevel,
  size = 'md',
}) => {
  const scoreColor = (v: number) =>
    v >= 740 ? '#00FF88' : v >= 670 ? '#FFB020' : '#FF3B57';

  const badgeClass = (() => {
    switch (riskLevel) {
      case 'Excellent': return 'bg-[#00FF88] text-[#0F0F0F]';
      case 'Good':      return 'bg-[#00FF88] text-[#0F0F0F]';
      case 'Fair':      return 'bg-[#FFB020] text-white';
      case 'Poor':      return 'bg-[#FF3B57] text-white';
      default:          return 'bg-[#F3F4F6] text-[#6B7280]';
    }
  })();

  const change = score - previousScore;
  const isNeutral = change === 0;
  const isPositive = change > 0;

  const pct = Math.max(0, Math.min(1, (score - 300) / (850 - 300)));
  const dashTotal = 100;

  const cardBase =
    'rounded-xl border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_6px_18px_rgba(0,0,0,0.04)] p-6 transition-transform hover:-translate-y-0.5';

  const svgClass =
    size === 'lg'
      ? 'w-[520px] max-w-full h-[290px]'
      : 'w-[420px] max-w-full h-[240px]';

  const gaugeMinH = size === 'lg' ? 'min-h-[270px]' : 'min-h-[230px]';

  return (
    <section className={cardBase}>
      <div className="flex items-center justify-between mb-7">
        <h3 className="text-lg font-semibold text-[#0F172A]">Credit Score</h3>
        <span className={`px-10 py-3 rounded-full text-sm font-semibold ${badgeClass}`}>
          {riskLevel}
        </span>
      </div>

      <div className={`relative flex items-center justify-center mb-6 ${gaugeMinH}`}>
        <svg className={svgClass} viewBox="0 0 260 160" aria-hidden="true">
          <path
            d="M 30 130 A 100 100 0 0 1 230 130"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="12"
            pathLength={dashTotal}
            strokeDasharray={dashTotal}
            strokeLinecap="round"
          />
          <path
            d="M 30 130 A 100 100 0 0 1 230 130"
            fill="none"
            stroke={scoreColor(score)}
            strokeWidth="12"
            pathLength={dashTotal}
            strokeDasharray={dashTotal}
            strokeDashoffset={dashTotal - pct * dashTotal}
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 10px rgba(0,255,136,0.45))' }}
          />
          <g fontSize="12" fill="#6B7280">
            <text x="30"  y="144" textAnchor="middle">300</text>
            <text x="80"  y="42"  textAnchor="middle">580</text>
            <text x="130" y="30"  textAnchor="middle">670</text>
            <text x="180" y="42"  textAnchor="middle">740</text>
            <text x="230" y="144" textAnchor="middle">850</text>
          </g>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 pointer-events-none">
          <span className="text-[47px] font-extrabold leading-none" style={{ color: scoreColor(score) }}>
            {score}
          </span>
          <span className="text-sm text-[#6B7280]">FICO Score</span>
          <div className="flex items-center mt-2">
            {!isNeutral && (
              <Icon
                name={isPositive ? 'TrendingUp' : 'TrendingDown'}
                size={16}
                className={isPositive ? 'text-[#00FF88]' : 'text-[#FF3B57]'}
              />
            )}
            <span
              className={`text-sm ml-2 ${
                isNeutral ? 'text-[#6B7280]' : isPositive ? 'text-[#00FF88]' : 'text-[#FF3B57]'
              }`}
            >
              {isNeutral ? 'No change' : `${isPositive ? '+' : '-'}${Math.abs(change)} pts`}
            </span>
          </div>
        </div>
      </div>

      <div className="text-center mb-8">
        <span className="block text-2xl font-semibold text-[#0F172A] mb-1">
          {percentile}th percentile
        </span>
        <p className="text-sm text-[#6B7280]">Better than {percentile}% of consumers</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-[#6B7280]">
          <span>Poor</span><span>Fair</span><span>Good</span><span>Excellent</span>
        </div>
        <div
          className="h-4 rounded-full shadow"
          style={{
            background: 'linear-gradient(90deg, #FF3B57 0%, #FFB020 40%, #00FF88 100%)',
            filter: 'drop-shadow(0 0 4px rgba(0,255,136,0.25))',
          }}
        />
        <div className="flex justify-between text-xs text-[#6B7280]">
          <span>300</span><span>580</span><span>670</span><span>740</span><span>850</span>
        </div>
      </div>
    </section>
  );
};

export default ScoreGauge;
