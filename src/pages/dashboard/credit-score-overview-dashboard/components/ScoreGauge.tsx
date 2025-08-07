// components/overview/ScoreGauge.tsx
// TypeScript-ready, UI giữ nguyên.

import React from 'react';
import Icon from '@/components/AppIcon';

/* ---------- types ---------- */
type RiskLevel = 'Excellent' | 'Good' | 'Fair' | 'Poor' | string;

interface ScoreGaugeProps {
  score: number;          // current score 300-850
  previousScore: number;  // last known score
  percentile: number;     // e.g. 83
  riskLevel: RiskLevel;
}

/* ---------- component ---------- */
const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  previousScore,
  percentile,
  riskLevel,
}) => {
  /* helpers -------------------------------------------------- */
  const getScoreColor = (val: number) =>
    val >= 740 ? 'text-success' : val >= 670 ? 'text-warning' : 'text-destructive';

  const getRiskLevelColor = (lvl: RiskLevel) => {
    switch (lvl) {
      case 'Excellent':
        return 'bg-success text-success-foreground neon-glow';
      case 'Good':
        return 'bg-accent text-accent-foreground neon-glow';
      case 'Fair':
        return 'bg-warning text-warning-foreground';
      case 'Poor':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const change = score - previousScore;
  const scoreChange = {
    value: Math.abs(change),
    isPositive: change > 0,
    isNeutral: change === 0,
  };

  /* gauge maths ---------------------------------------------- */
  const radius = 90;
  const circumference = Math.PI * radius; // semicircle
  const strokeDashoffset =
    circumference - ((score - 300) / (850 - 300)) * circumference;

  /* render ---------------------------------------------------- */
  return (
    <section className="bg-card rounded-lg border border-border p-6 shadow-elevation-2 hover-lift">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Credit Score</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(
            riskLevel,
          )}`}
        >
          {riskLevel}
        </span>
      </div>

      {/* gauge */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="relative">
          <svg className="w-64 h-32" viewBox="0 0 200 100">
            {/* track */}
            <path
              d="M 20 90 A 80 80 0 0 1 180 90"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted opacity-20"
            />
            {/* progress */}
            <path
              d="M 20 90 A 80 80 0 0 1 180 90"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`transition-all duration-1000 ease-out ${getScoreColor(
                score,
              )} drop-shadow-lg`}
              style={{
                filter: 'drop-shadow(0 0 8px rgba(0,255,136,0.6))',
              }}
            />
            {/* tick labels */}
            <g className="text-xs text-muted-foreground">
              <text x="20" y="95" textAnchor="middle" className="fill-current">
                300
              </text>
              <text x="60" y="20" textAnchor="middle" className="fill-current">
                580
              </text>
              <text x="100" y="15" textAnchor="middle" className="fill-current">
                670
              </text>
              <text x="140" y="20" textAnchor="middle" className="fill-current">
                740
              </text>
              <text x="180" y="95" textAnchor="middle" className="fill-current">
                850
              </text>
            </g>
          </svg>

          {/* centre readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
            <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
            <span className="text-sm text-muted-foreground">FICO Score</span>

            {/* change */}
            <div className="flex items-center mt-2">
              {!scoreChange.isNeutral && (
                <Icon
                  name={scoreChange.isPositive ? 'TrendingUp' : 'TrendingDown'}
                  size={16}
                  className={scoreChange.isPositive ? 'text-success' : 'text-destructive'}
                />
              )}
              <span
                className={`text-sm ml-1 ${
                  scoreChange.isNeutral
                    ? 'text-muted-foreground'
                    : scoreChange.isPositive
                    ? 'text-success'
                    : 'text-destructive'
                }`}
              >
                {scoreChange.isNeutral
                  ? 'No change'
                  : `${scoreChange.isPositive ? '+' : '-'}${scoreChange.value} pts`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* percentile */}
      <div className="text-center mb-6">
        <span className="text-2xl font-semibold text-foreground mb-1 block">
          {percentile}th percentile
        </span>
        <p className="text-sm text-muted-foreground">
          Better than {percentile}% of consumers
        </p>
      </div>

      {/* legend */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Poor</span>
          <span>Fair</span>
          <span>Good</span>
          <span>Excellent</span>
        </div>
        <div
          className="h-2 bg-gradient-to-r from-destructive via-warning via-accent to-success rounded-full shadow-lg"
          style={{ filter: 'drop-shadow(0 0 4px rgba(0,255,136,0.3))' }}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>300</span>
          <span>580</span>
          <span>670</span>
          <span>740</span>
          <span>850</span>
        </div>
      </div>
    </section>
  );
};

export default ScoreGauge;
