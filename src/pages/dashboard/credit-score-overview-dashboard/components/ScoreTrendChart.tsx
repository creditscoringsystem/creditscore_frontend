// src/pages/dashboard/credit-score-overview-dashboard/components/ScoreTrendChart.tsx
'use client';

import React, { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type {
  TooltipProps,
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

/* ───────── types ───────── */
export type TimeRange = '3M' | '6M' | '1Y' | '2Y';

export interface ScorePoint {
  month: string;   // ví dụ "Aug 2024"
  score: number;   // 300..850
  change?: number; // +/- so với tháng trước
}

type RawPoint = { date: string | Date; score: number; change?: number };

interface ScoreTrendChartProps {
  /** Bạn có thể truyền:
   *   1) ScorePoint[] (đã có { month, score })
   *   2) RawPoint[]   ({ date: ISOString | Date, score })
   * Nếu không truyền hoặc mảng quá ngắn (<4) → tự sinh demo 36 tháng. */
  data?: ScorePoint[] | RawPoint[];
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

/* ───────── helpers (export để tái dùng) ───────── */
export function buildScorePointsFromISO(raw: RawPoint[]): ScorePoint[] {
  const parsed = raw
    .map(r => ({ date: new Date(r.date), score: r.score }))
    .sort((a, b) => +a.date - +b.date);

  return parsed.map((p, i) => {
    const prev = parsed[i - 1]?.score;
    const change = typeof prev === 'number' ? p.score - prev : 0;
    const month = p.date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    return { month, score: p.score, change };
  });
}

/** Demo N tháng với dao động rõ ràng để đồ thị uốn lượn */
export function makeDemoScoreHistory(months = 36, start = 738): RawPoint[] {
  const out: RawPoint[] = [];
  const now = new Date();
  let score = start;

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    // dao động “mềm” nhưng đủ lớn để thấy khác biệt khi đổi range
    const delta = Math.round((Math.sin(i / 2.1) + Math.cos(i / 3.7)) * 6);
    score = Math.max(700, Math.min(772, score + delta));
    out.push({ date: d, score });
  }
  return out;
}

/* ───────── main component ───────── */
const ScoreTrendChart: React.FC<ScoreTrendChartProps> = ({
  data,
  timeRange,
  onTimeRangeChange,
}) => {
  // neon local (không đụng global.css)
  const cssVars = {
    '--neon': '#00FF88',
    '--neon-text': '#0F0F0F',
  } as React.CSSProperties;

  const [hoverX, setHoverX] = useState<string | null>(null);

  // Chuẩn hoá data:
  // - Nếu không có dữ liệu hoặc dữ liệu < 4 điểm → dùng demo 36 tháng
  // - Nếu là RawPoint[] → convert sang ScorePoint[]
  const points: ScorePoint[] = useMemo(() => {
    const ensurePoints = (src: ScorePoint[] | RawPoint[]) => {
      const looksLikeRaw = (d: any): d is RawPoint => 'date' in d && !('month' in d);
      const normalized = looksLikeRaw(src[0])
        ? buildScorePointsFromISO(src as RawPoint[])
        : (src as ScorePoint[]);
      return normalized;
    };

    const demo = buildScorePointsFromISO(makeDemoScoreHistory(36, 736));

    if (!data || data.length < 4) return demo;

    const normalized = ensurePoints(data);
    return normalized.length < 4 ? demo : normalized;
  }, [data]);

  // Filter theo time range
  const filtered = useMemo(() => {
    const n = points.length;
    switch (timeRange) {
      case '3M': return points.slice(Math.max(0, n - 3));
      case '6M': return points.slice(Math.max(0, n - 6));
      case '1Y': return points.slice(Math.max(0, n - 12));
      case '2Y':
      default:   return points;
    }
  }, [points, timeRange]);

  // Domain Y cố định (theo design tham chiếu)
  const minY = 700;
  const maxY = 772;

  // Stats strip
  const stats = useMemo(() => {
    const arr = filtered.map(d => d.score);
    const hi = Math.max(...arr);
    const lo = Math.min(...arr);
    const avg = Math.round(arr.reduce((s, v) => s + v, 0) / arr.length);
    return { hi, lo, avg, range: hi - lo };
  }, [filtered]);

  const ranges = [
    { value: '3M', label: '3 Months' },
    { value: '6M', label: '6 Months' },
    { value: '1Y', label: '1 Year' },
    { value: '2Y', label: '2 Years' },
  ] as const;

  const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({ active, payload, label }) => {
    const p = payload?.[0]?.payload as ScorePoint | undefined;
    if (!active || !p) return null;
    return (
      <div className="bg-white border border-border rounded-lg shadow-elevation-2 p-3">
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full" style={{ background: 'var(--neon)' }} />
          <span className="text-sm text-foreground">
            Score: <span className="font-semibold">{p.score}</span>
          </span>
        </div>
        {typeof p.change === 'number' && (
          <p className={['text-xs mt-1', p.change > 0 ? 'text-success' : p.change < 0 ? 'text-destructive' : 'text-muted-foreground'].join(' ')}>
            {p.change > 0 ? '+' : ''}{p.change} from previous month
          </p>
        )}
      </div>
    );
  };

  return (
    <div
      className="rounded-xl border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_6px_18px_rgba(0,0,0,0.04)] p-6 transition-transform hover:-translate-y-0.5"
      style={cssVars}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          {/* Tiêu đề neon gradient */}  
          <h3 className="text-lg font-semibold text-[#0F172A]">
            Credit Score Trend
          </h3>
          <p className="text-sm text-muted-foreground">24-month historical view</p>
        </div>

        {/* Segmented pill neon */}
        <div className="flex items-center gap-1 rounded-full bg-white/80 backdrop-blur px-1 py-1 shadow-elevation-1">
          {ranges.map(r => (
            <button
              key={r.value}
              onClick={() => onTimeRangeChange(r.value)}
              aria-pressed={timeRange === r.value}
              className={[
                'px-3 py-1 text-sm font-medium rounded-full transition-smooth',
                timeRange === r.value
                  ? 'bg-[var(--neon)] text-[var(--neon-text)] shadow'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              ].join(' ')}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            key={`${timeRange}-${filtered.length}`}
            data={filtered}
            margin={{ top: 10, right: 24, left: 8, bottom: 8 }}
            onMouseMove={(e) => {
              const m = (e?.activePayload?.[0]?.payload as ScorePoint | undefined)?.month ?? null;
              setHoverX(m);
            }}
            onMouseLeave={() => setHoverX(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="month"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minY, maxY]}
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              ticks={[700, 720, 740, 760]}
            />
            <Tooltip content={<CustomTooltip />} />

            {hoverX && (
              <ReferenceLine
                x={hoverX}
                stroke="var(--color-muted-foreground)"
                strokeDasharray="4 4"
                ifOverflow="extendDomain"
              />
            )}

            <Line
              type="monotone"
              dataKey="score"
              stroke="var(--neon)"
              strokeWidth={3}
              dot={{ r: 4, fill: 'var(--neon)', strokeWidth: 2 }}
              activeDot={{ r: 6, stroke: 'var(--neon)', strokeWidth: 2 }}
              isAnimationActive
              animationDuration={700}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats strip */}
      <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Highest', value: stats.hi },
          { label: 'Lowest',  value: stats.lo },
          { label: 'Average', value: stats.avg },
          { label: 'Range',   value: stats.range },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-lg font-semibold bg-gradient-to-r from-[#12F7A0] to-[#00E5A9] bg-clip-text text-transparent">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreTrendChart;
