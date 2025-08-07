'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import Icon from '@/components/AppIcon';

interface Summary {
  critical: number;
  high: number;
  total: number;
  resolved: number;
}

type Severity = 'critical' | 'high' | 'medium' | 'low';

interface DistributionItem {
  name: string;
  value: number;
  severity: Severity;
}

interface FrequencyTrendItem {
  date: string;
  alerts: number;
}

interface ResolutionItem {
  severity: string;
  hours: number;
}

interface StatusItem {
  name: string;
  count: number;
}

export interface AlertAnalyticsProps {
  analyticsData?: {
    summary?: Summary;
    typeDistribution?: DistributionItem[];
    frequencyTrend?: FrequencyTrendItem[];
    resolutionTimes?: ResolutionItem[];
    statusBreakdown?: StatusItem[];
  };
}

const COLORS: Record<Severity, string> = {
  critical: '#EF4444',
  high: '#F97316',
  medium: '#EAB308',
  low: '#3B82F6',
};

const STATUS_COLORS: Record<string, string> = {
  new: '#3B82F6',
  acknowledged: '#EAB308',
  investigating: '#F97316',
  resolved: '#10B981',
};

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-popover border border-border rounded-lg shadow-elevation-2 p-3">
      <p className="text-sm font-medium text-popover-foreground">{label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} className="text-sm text-muted-foreground">
          <span style={{ color: entry.color }}>●</span> {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

const AlertAnalytics: React.FC<AlertAnalyticsProps> = ({ analyticsData = {} }) => {
  const {
    summary = { critical: 0, high: 0, total: 0, resolved: 0 },
    typeDistribution = [],
    frequencyTrend = [],
    resolutionTimes = [],
    statusBreakdown = [],
  } = analyticsData;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {([
          { label: 'Critical', key: 'critical', bg: 'bg-red-100', icon: 'AlertTriangle', color: 'text-red-600' },
          { label: 'High', key: 'high', bg: 'bg-orange-100', icon: 'AlertCircle', color: 'text-orange-600' },
          { label: 'Total Alerts', key: 'total', bg: 'bg-blue-100', icon: 'Bell', color: 'text-blue-600' },
          { label: 'Resolved', key: 'resolved', bg: 'bg-green-100', icon: 'CheckCircle', color: 'text-green-600' },
        ] as const).map(item => (
          <div key={item.key} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className={`${item.bg} p-2 rounded-lg`}>
                <Icon name={item.icon} size={20} className={item.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {summary[item.key as keyof Summary]}
                </p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Type Distribution */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="PieChart" size={20} className="text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Alert Type Distribution</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={typeDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                labelLine={false}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent! * 100).toFixed(0)}%`}
              >
                {typeDistribution.map((d, i) => (
                  <Cell key={i} fill={COLORS[d.severity]} />
                ))}
              </Pie>
              <RechartsTooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Frequency Trend */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="TrendingUp" size={20} className="text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Alert Frequency (Last 30 Days)</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={frequencyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <RechartsTooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="alerts" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resolution Times */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Clock" size={20} className="text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Average Resolution Time</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={resolutionTimes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="severity" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
              <RechartsTooltip content={<CustomTooltip />} />
              <Bar dataKey="hours" fill="#3B82F6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="BarChart3" size={20} className="text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Alert Status Breakdown</h3>
        </div>
        <div className="space-y-3">
          {statusBreakdown.map(status => (
            <div key={status.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: STATUS_COLORS[status.name.toLowerCase()] || '#6B7280' }}
                />
                <span className="text-sm font-medium text-foreground">{status.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">{status.count}</span>
                <div className="w-24 bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(status.count / summary.total) * 100}%`,
                      backgroundColor: STATUS_COLORS[status.name.toLowerCase()] || '#6B7280',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlertAnalytics;
