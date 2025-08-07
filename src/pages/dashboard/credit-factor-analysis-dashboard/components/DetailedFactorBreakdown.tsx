// pages/credit-factor-analysis-dashboard/components/DetailedFactorBreakdown.tsx
// Next.js + TypeScript – original layout & logic kept
'use client';

import { cn } from '@/utils/cn';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

type ActiveCard =
  | 'payment_history'
  | 'utilization'
  | 'credit_age'
  | 'new_credit';

const DetailedFactorBreakdown: React.FC = () => {
  const [activeCard, setActiveCard] = useState<ActiveCard>('payment_history');

  /* --------------- mock datasets --------------- */
  const paymentHistoryData = [
    { month: 'Jan', onTime: 95, late: 5, missed: 0 },
    { month: 'Feb', onTime: 98, late: 2, missed: 0 },
    { month: 'Mar', onTime: 92, late: 6, missed: 2 },
    { month: 'Apr', onTime: 100, late: 0, missed: 0 },
    { month: 'May', onTime: 97, late: 3, missed: 0 },
    { month: 'Jun', onTime: 100, late: 0, missed: 0 },
  ];

  const utilizationData = [
    { account: 'Chase Freedom', limit: 5000, used: 1200, utilization: 24 },
    { account: 'Citi Double Cash', limit: 8000, used: 2400, utilization: 30 },
    { account: 'Amex Gold', limit: 10000, used: 1500, utilization: 15 },
    { account: 'Discover It', limit: 3000, used: 450, utilization: 15 },
    { account: 'Capital One', limit: 6000, used: 1800, utilization: 30 },
  ];

  const creditAgeData = [
    { name: '0-2 years', value: 2, color: '#EF4444' },
    { name: '2-5 years', value: 3, color: '#F59E0B' },
    { name: '5-10 years', value: 4, color: '#10B981' },
    { name: '10+ years', value: 2, color: '#3B82F6' },
  ];

  const newCreditData = [
    { month: 'Jan', inquiries: 0, newAccounts: 0 },
    { month: 'Feb', inquiries: 1, newAccounts: 0 },
    { month: 'Mar', inquiries: 0, newAccounts: 1 },
    { month: 'Apr', inquiries: 2, newAccounts: 0 },
    { month: 'May', inquiries: 0, newAccounts: 0 },
    { month: 'Jun', inquiries: 1, newAccounts: 1 },
  ];
  /* --------------------------------------------- */

  const factorCards = [
    {
      id: 'payment_history',
      title: 'Payment History Timeline',
      icon: 'Calendar',
      description: 'Track your payment performance over time',
      color: 'bg-emerald-50 border-emerald-200',
      iconColor: 'text-emerald-600',
    },
    {
      id: 'utilization',
      title: 'Utilization by Account',
      icon: 'CreditCard',
      description: 'Credit usage across all your accounts',
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
    },
    {
      id: 'credit_age',
      title: 'Credit Age Distribution',
      icon: 'Clock',
      description: 'Age breakdown of your credit accounts',
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600',
    },
    {
      id: 'new_credit',
      title: 'New Credit Activity',
      icon: 'Plus',
      description: 'Recent inquiries and new account openings',
      color: 'bg-amber-50 border-amber-200',
      iconColor: 'text-amber-600',
    },
  ] as const;

  /* ----------- chart renderers (unchanged) ----------- */
  const renderPaymentHistory = () => (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={paymentHistoryData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
          <YAxis stroke="#6B7280" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="onTime" stackId="a" fill="#10B981" name="On Time %" />
          <Bar dataKey="late" stackId="a" fill="#F59E0B" name="Late %" />
          <Bar dataKey="missed" stackId="a" fill="#EF4444" name="Missed %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderUtilization = () => (
    <div className="space-y-4">
      {utilizationData.map(acc => (
        <div key={acc.account} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {acc.account}
            </span>
            <span className="text-sm text-muted-foreground">
              ${acc.used.toLocaleString()} / ${acc.limit.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                acc.utilization > 30
                  ? 'bg-red-500'
                  : acc.utilization > 20
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${acc.utilization}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{acc.utilization}% utilized</span>
            <span
              className={`font-medium ${
                acc.utilization > 30
                  ? 'text-red-600'
                  : acc.utilization > 20
                  ? 'text-yellow-600'
                  : 'text-green-600'
              }`}
            >
              {acc.utilization > 30
                ? 'High'
                : acc.utilization > 20
                ? 'Medium'
                : 'Low'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCreditAge = () => (
    <div className="h-64 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={creditAgeData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {creditAgeData.map((e, i) => (
              <Cell key={i} fill={e.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  const renderNewCredit = () => (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={newCreditData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
          <YAxis stroke="#6B7280" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
            }}
          />
          <Line
            type="monotone"
            dataKey="inquiries"
            stroke="#F59E0B"
            strokeWidth={2}
            name="Hard Inquiries"
          />
          <Line
            type="monotone"
            dataKey="newAccounts"
            stroke="#3B82F6"
            strokeWidth={2}
            name="New Accounts"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const renderContent = () => {
    switch (activeCard) {
      case 'utilization':
        return renderUtilization();
      case 'credit_age':
        return renderCreditAge();
      case 'new_credit':
        return renderNewCredit();
      default:
        return renderPaymentHistory();
    }
  };

  const insights: Record<ActiveCard, string[]> = {
    payment_history: [
      'Perfect payment record in April and June',
      '2% missed payment in March needs attention',
      'Overall 96% on-time payment rate is excellent',
    ],
    utilization: [
      'Two accounts above 30% utilization threshold',
      'Average utilization of 23% is within good range',
      'Consider paying down Citi and Capital One balances',
    ],
    credit_age: [
      '4 accounts aged 5-10 years provide strong foundation',
      'Average account age of 6.2 years is very good',
      'Avoid closing older accounts to maintain age',
    ],
    new_credit: [
      '4 hard inquiries in last 6 months',
      '2 new accounts opened recently',
      'Consider spacing out future credit applications',
    ],
  };

  /* --------------- UI --------------- */
  return (
    <div className="col-span-full space-y-6">
      <header className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Detailed Factor Breakdown
        </h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="BarChart3" size={16} />
          <span>Interactive Analysis</span>
        </div>
      </header>

      {/* factor selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {factorCards.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCard(c.id as ActiveCard)}
            className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-elevation-2 ${
              activeCard === c.id
                ? `${c.color} shadow-elevation-1`
                : 'bg-card border-border hover:border-primary/20'
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  activeCard === c.id ? 'bg-white/50' : 'bg-muted'
                }`}
              >
                <Icon
                  name={c.icon}
                  size={18}
                  className={
                    activeCard === c.id ? c.iconColor : 'text-muted-foreground'
                  }
                />
              </div>
              <h4 className="font-medium text-foreground">{c.title}</h4>
            </div>
            <p className="text-sm text-muted-foreground">{c.description}</p>
          </button>
        ))}
      </div>

      {/* main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* chart */}
        <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-foreground">
              {factorCards.find(f => f.id === activeCard)?.title}
            </h4>
            <button className="text-muted-foreground hover:text-foreground">
              <Icon name="Download" size={16} />
            </button>
          </div>
          {renderContent()}
        </div>

        {/* insights */}
        <aside className="bg-card rounded-lg border border-border p-6">
          <h4 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Icon name="Lightbulb" size={18} className="text-primary" />
            <span>Key Insights</span>
          </h4>

          <ul className="space-y-3">
            {insights[activeCard].map(txt => (
              <li key={txt} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">{txt}</p>
              </li>
            ))}
          </ul>

          {/* recommendations */}
          <div className="mt-6 pt-4 border-t border-border">
            <h5 className="font-medium text-foreground mb-3">
              Recommended Actions
            </h5>
            {activeCard === 'payment_history' && (
              <div className="p-3 bg-emerald-50 rounded-lg text-sm text-emerald-800">
                Set up automatic payments to maintain perfect record
              </div>
            )}
            {activeCard === 'utilization' && (
              <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                Pay down high utilization accounts first
              </div>
            )}
            {activeCard === 'credit_age' && (
              <div className="p-3 bg-purple-50 rounded-lg text-sm text-purple-800">
                Keep oldest accounts active with small purchases
              </div>
            )}
            {activeCard === 'new_credit' && (
              <div className="p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
                Wait 3-6 months before next credit application
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DetailedFactorBreakdown;
