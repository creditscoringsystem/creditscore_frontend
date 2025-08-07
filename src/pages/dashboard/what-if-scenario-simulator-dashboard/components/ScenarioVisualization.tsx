'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Line,
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

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

interface ChartDataPoint {
  month: number;
  monthLabel: string;
  current: number | null;
  simulated: number | null;
  confidenceUpper: number | null;
  confidenceLower: number | null;
  date: string;
}

export default function ScenarioVisualization({
  currentScenario,
  selectedTimeframe = 12
}: ScenarioVisualizationProps) {
  const [activeScenarios, setActiveScenarios] = useState<string[]>(['current', 'simulated']);
  const [chartType, setChartType] = useState<'line' | 'area'>('line');
  const [showConfidenceInterval, setShowConfidenceInterval] = useState<boolean>(true);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  const generateScenarioData = (scenario: Scenario | {}, type: 'simulated' | 'current') => {
    const baseScore = 720;
    const months = selectedTimeframe;
    const data: ChartDataPoint[] = [];

    for (let i = 0; i <= months; i++) {
      let scoreChange = 0;

      if (type === 'simulated' && 'paymentAmount' in scenario) {
        const s = scenario as Scenario;
        const paymentImpact = (s.paymentAmount! / 100) * 0.5;
        const utilizationImpact = Math.abs(s.utilizationChange!) * 0.8;
        const newAccountImpact = s.newAccounts! * -5;
        const payoffImpact = s.payoffTimeline! <= 12 ? 15 : 8;
        const creditLimitImpact = (s.creditLimit! / 1000) * 0.3;
        scoreChange = (paymentImpact + utilizationImpact + payoffImpact + creditLimitImpact + newAccountImpact) * (i / months);
      } else {
        scoreChange = Math.random() * 10 - 5;
      }

      const score = Math.min(850, Math.max(300, baseScore + scoreChange));
      const confidenceUpper = Math.min(850, score + (Math.random() * 20 + 10));
      const confidenceLower = Math.max(300, score - (Math.random() * 15 + 8));

      data.push({
        month: i,
        monthLabel: i === 0 ? 'Now' : `${i}mo`,
        current: type === 'current' ? score : null,
        simulated: type === 'simulated' ? score : null,
        confidenceUpper: type === 'simulated' ? confidenceUpper : null,
        confidenceLower: type === 'simulated' ? confidenceLower : null,
        date: new Date(2025, 0, 1 + i * 30).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      });
    }

    return data;
  };

  useEffect(() => {
    if (currentScenario) {
      const simulatedData = generateScenarioData(currentScenario, 'simulated');
      const currentData = generateScenarioData({}, 'current');
      const merged = simulatedData.map((point, idx) => ({
        ...point,
        current: currentData[idx]?.current ?? point.current
      }));
      setChartData(merged);
    }
  }, [currentScenario, selectedTimeframe]);

  const toggleScenario = (type: string) => {
    setActiveScenarios(prev =>
      prev.includes(type) ? prev.filter(v => v !== type) : [...prev, type]
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-elevation-2 p-4">
          <p className="text-sm font-medium text-popover-foreground mb-2">{`Month ${label}`}</p>
          {payload.map((entry: any, i: number) => (
            <div key={i} className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-semibold text-foreground">{Math.round(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={20} className="text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Score Projection</h3>
              <p className="text-sm text-muted-foreground">Compare current vs simulated trajectory</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant={chartType === 'line' ? 'default' : 'outline'} size="sm" iconName="TrendingUp" onClick={() => setChartType('line')}>Line</Button>
            <Button variant={chartType === 'area' ? 'default' : 'outline'} size="sm" iconName="AreaChart" onClick={() => setChartType('area')}>Area</Button>
          </div>
        </div>
        {/* Chart Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" checked={activeScenarios.includes('current')} onChange={() => toggleScenario('current')} className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary" />
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-muted-foreground rounded-full" />
              <span className="text-sm text-foreground">Current Trajectory</span>
            </div>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" checked={activeScenarios.includes('simulated')} onChange={() => toggleScenario('simulated')} className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary" />
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span className="text-sm text-foreground">Simulated Scenario</span>
            </div>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" checked={showConfidenceInterval} onChange={(e: ChangeEvent<HTMLInputElement>) => setShowConfidenceInterval(e.target.checked)} className="w-4 h-4 text-secondary bg-background border-border rounded focus:ring-secondary" />
            <span className="text-sm text-foreground">Confidence Interval</span>
          </label>
        </div>
      </div>
      {/* Chart */}
      <div className="p-6">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="monthLabel" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis domain={[650, 800]} stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {showConfidenceInterval && activeScenarios.includes('simulated') && (
                <Area type="monotone" dataKey="confidenceUpper" stroke="none" fill="var(--color-primary)" fillOpacity={0.1} name="Confidence Range" />
              )}
              {activeScenarios.includes('current') && (
                <Line type="monotone" dataKey="current" stroke="var(--color-muted-foreground)" strokeWidth={2} strokeDasharray="5 5" dot={{ r:4 }} name="Current Trajectory" />
              )}
              {activeScenarios.includes('simulated') && (
                chartType === 'line' ? (
                  <Line type="monotone" dataKey="simulated" stroke="var(--color-primary)" strokeWidth={3} dot={{ r:5 }} name="Simulated Scenario" />
                ) : (
                  <Area type="monotone" dataKey="simulated" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.3} name="Simulated Scenario" />
                )
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        {/* Chart Summary Blocks */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Target" size={16} className="text-success" />
              <span className="text-sm font-medium text-foreground">Projected Score</span>
            </div>
            <div className="text-2xl font-bold text-success">
              {chartData.length > 0 ? Math.round(chartData[chartData.length - 1].simulated || 720) : 720}
            </div>
            <div className="text-xs text-muted-foreground">
              +{chartData.length > 0 ? Math.round((chartData[chartData.length - 1].simulated || 720) - 720) : 0} points
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Clock" size={16} className="text-warning" />
              <span className="text-sm font-medium text-foreground">Time to Target</span>
            </div>
            <div className="text-2xl font-bold text-warning">
              {Math.round(selectedTimeframe * 0.7)} mo
            </div>
            <div className="text-xs text-muted-foreground">To reach 750+ score</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="TrendingUp" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Confidence</span>
            </div>
            <div className="text-2xl font-bold text-primary">87%</div>
            <div className="text-xs text-muted-foreground">Prediction accuracy</div>
          </div>
        </div>
      </div>
    </div>
  );
}
