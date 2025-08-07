// components/ScoreTrendChart.tsx
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

// ────────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────────
type TimeRange = '3M' | '6M' | '1Y' | '2Y';

interface ScorePoint {
  month: string;
  score: number;
  change?: number;
}

interface ScoreTrendChartProps {
  data: ScorePoint[];
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

// ────────────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────────────
const ScoreTrendChart: React.FC<ScoreTrendChartProps> = ({
  data,
  timeRange,
  onTimeRangeChange,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<ScorePoint | null>(null);

  // ─── Options ────────────────────────────────────────────────────────────────
  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: '3M', label: '3 Months' },
    { value: '6M', label: '6 Months' },
    { value: '1Y', label: '1 Year' },
    { value: '2Y', label: '2 Years' },
  ];

  // ─── Tooltip ────────────────────────────────────────────────────────────────
  const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload as ScorePoint;

      return (
        <div className="bg-popover border border-border rounded-lg shadow-elevation-2 p-3">
          <p className="text-sm font-medium text-popover-foreground mb-1">{label}</p>

          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span className="text-sm text-popover-foreground">
              Score:{' '}
              <span className="font-semibold">{point.score}</span>
            </span>
          </div>

          {point.change !== undefined && (
            <p
              className={`text-xs mt-1 ${
                point.change > 0
                  ? 'text-success'
                  : point.change < 0
                  ? 'text-destructive'
                  : 'text-muted-foreground'
              }`}
            >
              {point.change > 0 ? '+' : ''}
              {point.change} from previous month
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // ─── Filtered Data ───────────────────────────────────────────────────────────
  const filteredData = data.filter((_, idx) => {
    switch (timeRange) {
      case '3M':
        return idx >= data.length - 3;
      case '6M':
        return idx >= data.length - 6;
      case '1Y':
        return idx >= data.length - 12;
      case '2Y':
      default:
        return true;
    }
  });

  const minScore = Math.min(...filteredData.map((d) => d.score)) - 20;
  const maxScore = Math.max(...filteredData.map((d) => d.score)) + 20;

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-elevation-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Credit Score Trend</h3>
          <p className="text-sm text-muted-foreground">24-month historical view</p>
        </div>

        {/* Time-range selector */}
        <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
          {timeRangeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onTimeRangeChange(opt.value)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-smooth ${
                timeRange === opt.value
                  ? 'bg-primary text-primary-foreground shadow-elevation-1'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            onMouseMove={(e) => {
              const pt = e?.activePayload?.[0]?.payload as ScorePoint | undefined;
              setHoveredPoint(pt ?? null);
            }}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="month"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[minScore, maxScore]}
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              dataKey="score"
              type="monotone"
              stroke="var(--color-primary)"
              strokeWidth={3}
              dot={{ fill: 'var(--color-primary)', r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
        {[
          { label: 'Highest', value: Math.max(...filteredData.map((d) => d.score)) },
          { label: 'Lowest', value: Math.min(...filteredData.map((d) => d.score)) },
          {
            label: 'Average',
            value: Math.round(
              filteredData.reduce((sum, d) => sum + d.score, 0) / filteredData.length
            ),
          },
          {
            label: 'Range',
            value:
              Math.max(...filteredData.map((d) => d.score)) -
              Math.min(...filteredData.map((d) => d.score)),
          },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-lg font-semibold text-foreground">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreTrendChart;
