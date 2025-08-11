// src/pages/dashboard/what-if-scenario-simulator-dashboard/components/ScenarioVisualization.tsx
'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import {
  Line,
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Icon from '@/components/AppIcon';

interface Scenario {
  paymentAmount?: number;
  utilizationChange?: number;
  newAccounts?: number;
  payoffTimeline?: number;
  creditLimit?: number;
}

interface ScenarioVisualizationProps {
  currentScenario?: Scenario;
  savedScenarios?: Scenario[];
  selectedTimeframe?: number;
}

type ChartType = 'line' | 'area';

interface ChartDataPoint {
  month: number;
  monthLabel: string;
  current: number | null;
  simulated: number | null;
  confHi: number | null;
  confLo: number | null;
}

const NEON   = 'var(--color-neon, #12F7A0)';
const FG     = 'var(--color-foreground, #0F172A)';
const BORDER = 'var(--color-border, #E5E7EB)';

export default function ScenarioVisualization({
  currentScenario,
  selectedTimeframe = 12,
}: ScenarioVisualizationProps) {
  const [active, setActive] = useState<string[]>(['current', 'simulated']);
  const [chartType, setChartType] = useState<ChartType>('line');
  const [showCI, setShowCI] = useState(true);
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loadingRemote, setLoadingRemote] = useState(false);

  // ---------- helpers ----------
  const generateLocal = (scenario: Scenario | {}, type: 'simulated' | 'current'): ChartDataPoint[] => {
    const baseScore = 720;
    const months = selectedTimeframe;
    const rows: ChartDataPoint[] = [];

    for (let i = 0; i <= months; i++) {
      let delta = 0;

      if (type === 'simulated' && 'paymentAmount' in scenario) {
        const s = scenario as Scenario;
        const pay   = (s.paymentAmount ?? 0) / 100 * 0.6;
        const util  = Math.abs(s.utilizationChange ?? 0) * 1.0;
        const newA  = (s.newAccounts ?? 0) * -5;
        const payoff= (s.payoffTimeline ?? 12) <= 12 ? 14 : 8;
        const limit = (s.creditLimit ?? 0) / 1000 * 0.4;
        const total = pay + util + newA + payoff + limit;
        delta = total * (i / months);
      } else {
        delta = Math.sin(i / 3) * 2;
      }

      const score = Math.min(850, Math.max(300, baseScore + delta));
      const hi = Math.min(850, score + 12 + Math.random() * 10);
      const lo = Math.max(300, score - 10 - Math.random() * 8);

      rows.push({
        month: i,
        monthLabel: i === 0 ? 'Now' : `${i} mo`,
        current:   type === 'current'   ? score : null,
        simulated: type === 'simulated' ? score : null,
        confHi:    type === 'simulated' ? hi    : null,
        confLo:    type === 'simulated' ? lo    : null,
      });
    }
    return rows;
  };

  // Try mock backend first; fallback to local
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingRemote(true);
      try {
        const res = await fetch(`/api/mock/simulator/projection?months=${selectedTimeframe}`);
        if (!res.ok) throw new Error('mock api not available');
        const json = await res.json();
        const rows: ChartDataPoint[] = (json?.data ?? []).map((r: any) => ({
          month: r.month,
          monthLabel: r.monthLabel ?? (r.month === 0 ? 'Now' : `${r.month} mo`),
          current: r.current ?? null,
          simulated: r.simulated ?? null,
          confHi: r.confHi ?? null,
          confLo: r.confLo ?? null,
        }));
        if (!cancelled && rows.length) setData(rows);
        if (!rows.length) throw new Error('empty');
      } catch {
        const sim = generateLocal(currentScenario ?? {}, 'simulated');
        const cur = generateLocal({}, 'current');
        const merged = sim.map((p, i) => ({ ...p, current: cur[i]?.current ?? null }));
        if (!cancelled) setData(merged);
      } finally {
        if (!cancelled) setLoadingRemote(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScenario, selectedTimeframe]);

  const toggle = (k: 'current' | 'simulated') =>
    setActive((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="rounded-xl border p-3 bg-white/95 backdrop-blur-sm"
             style={{ borderColor: BORDER, color: FG }}>
          <div className="text-xs font-medium mb-1">{label}</div>
          {payload.map((p: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
              <span className="opacity-80">{p.name}:</span>
              <span className="font-semibold">{Math.round(p.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // summary numbers
  const last = data[data.length - 1];
  const projected = Math.round(last?.simulated ?? 720);
  const delta = projected - 720;
  const timeToTarget = Math.round(selectedTimeframe * 0.67);
  const confidence = 87;

  const lineOpacity = chartType === 'line' ? 1 : 0;
  const areaOpacity = chartType === 'area' ? 1 : 0;

  return (
    <div className="rounded-xl border bg-card" style={{ borderColor: BORDER }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                 style={{ background: 'rgba(18,247,160,0.12)' }}>
              <Icon name="TrendingUp" size={18} style={{ color: NEON }} />
            </div>
            <div>
              <h3 className="text-lg font-semibold" style={{ color: FG }}>Score Projection</h3>
              <p className="text-sm" style={{ color: FG, opacity: 0.8 }}>
                Compare current vs simulated trajectory
              </p>
            </div>
          </div>

          {/* Neon pill toggle */}
          <div className="inline-flex items-center rounded-full p-1"
               style={{ background: 'rgba(18,247,160,0.12)', border: `1px solid ${NEON}` }}>
            <button
              type="button"
              onClick={() => setChartType('line')}
              className={`px-3 h-8 rounded-full text-sm font-medium transition-all focus:outline-none
                ${chartType === 'line'
                  ? 'bg-[var(--color-neon,#12F7A0)] text-[#0F172A]'
                  : 'text-[var(--color-foreground,#0F172A)]/85 hover:bg-white/60'}`}
              aria-pressed={chartType === 'line'}
            >
              <span className="inline-flex items-center gap-1">
                <Icon name="LineChart" size={14} />
                Line
              </span>
            </button>
            <button
              type="button"
              onClick={() => setChartType('area')}
              className={`px-3 h-8 rounded-full text-sm font-medium transition-all focus:outline-none
                ${chartType === 'area'
                  ? 'bg-[var(--color-neon,#12F7A0)] text-[#0F172A]'
                  : 'text-[var(--color-foreground,#0F172A)]/85 hover:bg-white/60'}`}
              aria-pressed={chartType === 'area'}
            >
              <span className="inline-flex items-center gap-1">
                <Icon name="AreaChart" size={14} />
                Area
              </span>
            </button>
          </div>
        </div>

        {/* Switches */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={active.includes('current')}
              onChange={() => toggle('current')}
              className="size-4 rounded border"
              style={{ accentColor: FG, borderColor: BORDER }}
            />
            <span className="inline-flex items-center gap-2 text-sm" style={{ color: FG }}>
              <span className="inline-block size-2.5 rounded-full" style={{ background: '#6b7280' }} />
              Current Trajectory
            </span>
          </label>

          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={active.includes('simulated')}
              onChange={() => toggle('simulated')}
              className="size-4 rounded border"
              style={{ accentColor: NEON, borderColor: BORDER }}
            />
            <span className="inline-flex items-center gap-2 text-sm" style={{ color: FG }}>
              <span className="inline-block size-2.5 rounded-full" style={{ background: NEON }} />
              Simulated Scenario
            </span>
          </label>

          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showCI}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setShowCI(e.target.checked)}
              className="size-4 rounded border"
              style={{ accentColor: NEON, borderColor: BORDER }}
            />
            <span className="text-sm" style={{ color: FG }}>Confidence Interval</span>
          </label>
        </div>
      </div>

      {/* Chart */}
      <div className="px-4 pb-2 pt-2">
        <div className="h-64 md:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <defs>
                <linearGradient id="simFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={NEON} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={NEON} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
              <XAxis dataKey="monthLabel" stroke={FG} tick={{ fontSize: 12, fill: FG }} />
              <YAxis domain={[650, 800]}    stroke={FG} tick={{ fontSize: 12, fill: FG }} />
              <Tooltip content={<CustomTooltip />} />

              {showCI && active.includes('simulated') && (
                <Area
                  type="monotone"
                  dataKey="confHi"
                  stroke="none"
                  fill="url(#simFill)"
                  name="Confidence Range"
                  isAnimationActive={false}
                  style={{ transition: 'opacity .25s ease', opacity: active.includes('simulated') ? 1 : 0 }}
                />
              )}

              {active.includes('current') && (
                <Line
                  type="monotone"
                  dataKey="current"
                  stroke="#6B7280"
                  strokeDasharray="5 5"
                  dot={{ r: 3 }}
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              )}

              {/* Simulated – fade swap */}
              <Line
                type="monotone"
                dataKey="simulated"
                stroke={NEON}
                strokeWidth={3}
                dot={{ r: 0 }}
                isAnimationActive={false}
                name="Simulated Scenario (Line)"
                style={{ transition: 'opacity .24s ease', opacity: chartType === 'line' ? 1 : 0 }}
              />
              <Area
                type="monotone"
                dataKey="simulated"
                stroke={NEON}
                fill="url(#simFill)"
                isAnimationActive={false}
                name="Simulated Scenario (Area)"
                style={{ transition: 'opacity .24s ease', opacity: chartType === 'area' ? 1 : 0 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-6 text-sm" style={{ color: FG }}>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block w-4 h-2 rounded-full" style={{ background: 'rgba(18,247,160,.3)' }} />
            Confidence Range
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block w-4 h-[2px] bg-[#6B7280]" /> Current Trajectory
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block w-4 h-[2px]" style={{ background: NEON }} /> Simulated Scenario
          </span>
        </div>
      </div>

      {/* Summary – ONLY change: force 3 rows cùng dòng bằng min-h */}
      <div className="px-2 pb-5">
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {/* Projected */}
          <div className="flex flex-col">
            {/* Row 1: Title */}
            <div className="flex items-center gap-2 text-[15px] font-semibold min-h-[24px]" style={{ color: FG }}>
              <Icon name="Target" size={16} style={{ color: NEON }} />
              <span>Projected Score</span>
            </div>
            {/* Row 2: Big number */}
            <div className="mt-1 text-3xl md:text-4xl font-extrabold leading-none min-h-[44px] md:min-h-[48px]"
                 style={{ color: NEON }}>
              {projected}
            </div>
            {/* Row 3: Subtext */}
            <div className="text-xs min-h-[32px] flex items-end" style={{ color: FG, opacity: 0.9 }}>
              {delta >= 0 ? `+${delta}` : delta} points
            </div>
          </div>

          {/* Time to Target */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-[15px] font-semibold min-h-[24px]" style={{ color: FG }}>
              <Icon name="Clock" size={16} className="text-warning" />
              <span>Time to Target</span>
            </div>
            <div className="mt-1 text-3xl md:text-4xl font-extrabold leading-none min-h-[44px] md:min-h-[48px] text-orange-500">
              {timeToTarget} <span className="font-bold">mo</span>
            </div>
            <div className="text-xs min-h-[32px] flex items-end" style={{ color: FG, opacity: 0.9 }}>
              To reach 750+ score
            </div>
          </div>

          {/* Confidence */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-[15px] font-semibold min-h-[24px]" style={{ color: FG }}>
              <Icon name="TrendingUp" size={16} style={{ color: NEON }} />
              <span>Confidence</span>
            </div>
            <div className="mt-1 text-3xl md:text-4xl font-extrabold leading-none min-h-[44px] md:min-h-[48px]"
                 style={{ color: NEON }}>
              {confidence}%
            </div>
            <div className="text-xs min-h-[32px] flex items-end" style={{ color: FG, opacity: 0.9 }}>
              Prediction accuracy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
