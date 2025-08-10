// pages/credit-factor-analysis-dashboard/components/DetailedFactorBreakdown.tsx
'use client';

import Icon from '@/components/AppIcon';
import React, { useMemo, useState, useEffect } from 'react';
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

type ActiveCard = 'payment_history' | 'utilization' | 'credit_age' | 'new_credit';

/* ===== palette ép cứng để đồng bộ với Overview ===== */
const C = {
  card: 'var(--color-card, #fff)',
  border: 'var(--color-border, #E5E7EB)',
  fg: 'var(--color-foreground, #0F172A)',
  muted: 'var(--color-muted-foreground, #6B7280)',
  track: '#E9EDF3',
  green: '#12F7A0', // neon green
  orange: '#F59E0B',
  red: '#FF3B6B',
  blue: '#3B82F6',
  shadow: '0 6px 24px rgba(15,23,42,0.06)',
};

/* ====== cấu hình tiền tệ ====== */
const USD_TO_VND = 25000;
const fmtVND = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});
const fmtUSD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const toVND = (usd: number) => fmtVND.format(usd * USD_TO_VND);

/* ==========================
   HƯỚNG DẪN GẮN BACKEND (đọc nhanh)
   - Backend: cung cấp các endpoint JSON (không redirect HTML)
     + GET /api/payment-history   -> [{ month, onTime, late, missed }]
     + GET /api/utilization       -> [{ account, limit, used, utilization }]
     + GET /api/credit-age        -> [{ name, value, color? }]
     + GET /api/new-credit        -> [{ month, inquiries, newAccounts }]
   - Content-Type: application/json; Status đúng (200|4xx|5xx). Nếu 401 → trả JSON, KHÔNG redirect trang HTML login.
   - Nếu API khác domain: set NEXT_PUBLIC_API_BASE trong .env và bật CORS phía server.
   - Frontend (file này): chỉ cần đổi URL, UI sẽ render như cũ.
========================== */

const DetailedFactorBreakdown: React.FC = () => {
  const [activeCard, setActiveCard] = useState<ActiveCard>('payment_history');

  /* ==========================
     1) STATE dữ liệu từ API (ban đầu rỗng)
     - Có loading + error để UI thân thiện
  ========================== */
  type PaymentItem = { month: string; onTime: number; late: number; missed: number };
  type UtilItem = { account: string; limit: number; used: number; utilization: number };
  type AgeItem = { name: string; value: number; color?: string };
  type NewCreditItem = { month: string; inquiries: number; newAccounts: number };

  const [paymentHistoryData, setPaymentHistoryData] = useState<PaymentItem[]>([]);
  const [utilizationData, setUtilizationData] = useState<UtilItem[]>([]);
  const [creditAgeData, setCreditAgeData] = useState<AgeItem[]>([]);
  const [newCreditData, setNewCreditData] = useState<NewCreditItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // === Trạng thái tiền tệ (toggle USD/VND) ===
  const [currency, setCurrency] = useState<'USD' | 'VND'>('VND');
  const formatAmount = (usd: number) => (currency === 'USD' ? fmtUSD.format(usd) : toVND(usd));

  /* ==========================
     2) Helper parse JSON an toàn
     - Tránh lỗi "Unexpected token '<' ..." khi server trả HTML
  ========================== */
  async function parseJsonSafe(res: Response) {
    const ct = res.headers.get('content-type') || '';
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`HTTP ${res.status} ${res.statusText} | CT=${ct} | ${body.slice(0, 180)}`);
    }
    if (ct.includes('application/json')) return res.json();
    const body = await res.text();
    throw new Error(`Expected JSON, got CT=${ct} | ${body.slice(0, 180)}`);
  }

  /* ==========================
     3) GỌI API khi mount
     - Đổi URL theo backend của bạn
     - Nếu API khác domain: đặt NEXT_PUBLIC_API_BASE trong .env
  ========================== */
  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';
    const headers = { Accept: 'application/json' as const };

    const fetchAll = async () => {
      try {
        const [payment, utilization, age, credit] = await Promise.all([
          fetch(`${API_BASE}/api/payment-history`, { headers, credentials: 'include' }).then(parseJsonSafe),
          fetch(`${API_BASE}/api/utilization`, { headers, credentials: 'include' }).then(parseJsonSafe),
          fetch(`${API_BASE}/api/credit-age`, { headers, credentials: 'include' }).then(parseJsonSafe),
          fetch(`${API_BASE}/api/new-credit`, { headers, credentials: 'include' }).then(parseJsonSafe),
        ]);

        setPaymentHistoryData(payment);
        setUtilizationData(utilization);
        // Nếu backend không trả màu cho từng segment, gán màu mặc định theo thứ tự:
        const defaultAges: string[] = [C.red, C.orange, C.green, C.blue];
        setCreditAgeData(
          (age as AgeItem[]).map((x, i) => ({ ...x, color: x.color || defaultAges[i % defaultAges.length] }))
        );
        setNewCreditData(credit);
        setFetchError(null);
      } catch (err: any) {
        console.error('Fetch error:', err?.message || err);
        setFetchError(err?.message || 'Fetch error');

        // ✅ Fallback mock để UI vẫn hiển thị (có thể bỏ nếu không muốn)
        setPaymentHistoryData([
          { month: 'Jan', onTime: 95, late: 5, missed: 0 },
          { month: 'Feb', onTime: 98, late: 2, missed: 0 },
          { month: 'Mar', onTime: 92, late: 6, missed: 2 },
          { month: 'Apr', onTime: 100, late: 0, missed: 0 },
          { month: 'May', onTime: 97, late: 3, missed: 0 },
          { month: 'Jun', onTime: 100, late: 0, missed: 0 },
        ]);
        setUtilizationData([
          { account: 'Chase Freedom', limit: 5000, used: 1200, utilization: 24 },
          { account: 'Citi Double Cash', limit: 8000, used: 2400, utilization: 30 },
          { account: 'Amex Gold', limit: 10000, used: 1500, utilization: 15 },
          { account: 'Discover It', limit: 3000, used: 450, utilization: 15 },
          { account: 'Capital One', limit: 6000, used: 1800, utilization: 30 },
        ]);
        setCreditAgeData([
          { name: '0-2 years', value: 2, color: C.red },
          { name: '2-5 years', value: 3, color: C.orange },
          { name: '5-10 years', value: 4, color: C.green },
          { name: '10+ years', value: 2, color: C.blue },
        ]);
        setNewCreditData([
          { month: 'Jan', inquiries: 0, newAccounts: 0 },
          { month: 'Feb', inquiries: 1, newAccounts: 0 },
          { month: 'Mar', inquiries: 0, newAccounts: 1 },
          { month: 'Apr', inquiries: 2, newAccounts: 0 },
          { month: 'May', inquiries: 0, newAccounts: 0 },
          { month: 'Jun', inquiries: 1, newAccounts: 1 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  /* ---------------- chart renders ---------------- */
  const renderPaymentHistory = () => (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={paymentHistoryData}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
          <XAxis dataKey="month" stroke={C.muted} fontSize={12} />
          <YAxis stroke={C.muted} fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
            }}
          />
          <Bar dataKey="onTime" stackId="a" fill={C.green} name="On-time %" />
          <Bar dataKey="late" stackId="a" fill={C.orange} name="Late %" />
          <Bar dataKey="missed" stackId="a" fill={C.red} name="Missed %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderUtilization = () => (
    <div className="space-y-5">
      {utilizationData.map(acc => (
        <div key={acc.account} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-semibold" style={{ color: C.fg }}>
              {acc.account}
            </span>
            <span className="text-sm" style={{ color: C.fg }}>
              {formatAmount(acc.used)} <span className="text-[#9CA3AF]">/</span> {formatAmount(acc.limit)}
            </span>
          </div>

          <div className="w-full rounded-full h-2.5" style={{ background: C.track }}>
            <div
              className="h-2.5 rounded-full transition-all"
              style={{
                width: `${acc.utilization}%`,
                background:
                  acc.utilization > 30 ? C.red : acc.utilization > 20 ? C.orange : C.green,
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: C.muted }}>
              {acc.utilization}% utilized
            </span>
            <span
              className="text-sm font-medium"
              style={{
                color: acc.utilization > 30 ? '#ef4444' : acc.utilization > 20 ? '#d97706' : '#059669',
              }}
            >
              {acc.utilization > 30 ? 'High' : acc.utilization > 20 ? 'Medium' : 'Low'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const totalAges = useMemo(
    () => creditAgeData.reduce((s, v) => s + v.value, 0),
    [creditAgeData],
  );
  const avgYears = 6.2; // nếu backend trả chi tiết, có thể tính thật từ creditAgeData

  const renderCreditAge = () => (
    <div className="grid grid-cols-12 gap-6 items-center h-[320px]">
      {/* donut */}
      <div className="col-span-8 h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={creditAgeData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={4}
              dataKey="value"
              labelLine={false}
              label={({ percent }) => `${Math.round(percent * 100)}%`}
            >
              {creditAgeData.map((e, i) => (
                <Cell key={i} fill={e.color || C.green} />
              ))}
            </Pie>
            {/* @ts-ignore - SVG text props */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="central"
              fill={C.fg}
              fontSize="14"
              fontWeight="600"
            >
              Avg {avgYears}y
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* legend bên phải */}
      <div className="col-span-4 space-y-3">
        {creditAgeData.map(seg => {
          const pct = Math.round((seg.value / totalAges) * 100);
          return (
            <div key={seg.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: seg.color || C.green }}
                />
                <span className="text-sm font-medium" style={{ color: C.fg }}>
                  {seg.name}
                </span>
              </div>
              <span className="text-sm" style={{ color: C.muted }}>
                {seg.value} • {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderNewCredit = () => (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={newCreditData}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
          <XAxis dataKey="month" stroke={C.muted} fontSize={12} />
          <YAxis stroke={C.muted} fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
            }}
          />
          <Line type="monotone" dataKey="inquiries" stroke={C.orange} strokeWidth={2} name="Hard Inquiries" />
          <Line type="monotone" dataKey="newAccounts" stroke={C.blue} strokeWidth={2} name="New Accounts" />
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

  /* ------------------- UI ------------------- */
  if (loading) {
    return <div className="p-6 text-sm" style={{ color: C.muted }}>Loading data...</div>;
  }

  return (
    <div className="col-span-full space-y-6">
      <header className="flex items-center justify-between">
        <h3 className="text-xl font-semibold" style={{ color: C.fg }}>
          Detailed Factor Breakdown
        </h3>
        <div className="flex items-center gap-2 text-sm" style={{ color: C.muted }}>
          <Icon name="BarChart3" size={16} />
          <span>Interactive Analysis</span>
        </div>
      </header>

      {/* selector cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {([
          {
            id: 'payment_history',
            title: 'Payment History Timeline',
            icon: 'Calendar',
            description: 'Track your payment performance over time',
          },
          {
            id: 'utilization',
            title: 'Utilization by Account',
            icon: 'CreditCard',
            description: 'Credit usage across all your accounts',
          },
          {
            id: 'credit_age',
            title: 'Credit Age Distribution',
            icon: 'Clock',
            description: 'Age breakdown of your credit accounts',
          },
          {
            id: 'new_credit',
            title: 'New Credit Activity',
            icon: 'Plus',
            description: 'Recent inquiries and new account openings',
          },
        ] as const).map(c => {
          const active = activeCard === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveCard(c.id as ActiveCard)}
              className={`p-4 text-left rounded-2xl border transition-all hover:shadow-[${C.shadow}] ${
                active ? 'bg-white' : 'bg-white'
              }`}
              style={{
                borderColor: active ? C.green : C.border,
                boxShadow: active ? C.shadow : 'none',
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: '#F3F4F6' }}
                >
                  <Icon name={c.icon} size={18} className={active ? 'text-emerald-600' : ''} />
                </div>
                <h4 className="font-medium" style={{ color: C.fg }}>
                  {c.title}
                </h4>
              </div>
              <p className="text-sm" style={{ color: C.muted }}>
                {c.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Hàng 1: Chart full-width */}
      <div
        className="bg-white rounded-2xl border p-6"
        style={{ borderColor: C.border, boxShadow: C.shadow }}
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold flex items-center gap-3" style={{ color: C.fg }}>
            {
              ({
                payment_history: 'Payment History Timeline',
                utilization: 'Utilization by Account',
                credit_age: 'Credit Age Distribution',
                new_credit: 'New Credit Activity',
              } as const)[activeCard]
            }

            {/* === Toggle USD/VND chỉ hiện ở Utilization === */}
            {activeCard === 'utilization' && (
              <div
                className="flex items-center p-1 rounded-full border"
                style={{ borderColor: C.green }}
                role="tablist"
                aria-label="Currency toggle"
                title="Đổi đơn vị hiển thị"
              >
                <button
                  onClick={() => setCurrency('USD')}
                  role="tab"
                  aria-selected={currency === 'USD'}
                  className="px-3 py-1 text-xs font-semibold rounded-full transition"
                  style={{
                    background: currency === 'USD' ? C.green : 'transparent',
                    color: currency === 'USD' ? '#0F172A' : C.green,
                  }}
                >
                  USD
                </button>
                <button
                  onClick={() => setCurrency('VND')}
                  role="tab"
                  aria-selected={currency === 'VND'}
                  className="px-3 py-1 text-xs font-semibold rounded-full transition"
                  style={{
                    background: currency === 'VND' ? C.green : 'transparent',
                    color: currency === 'VND' ? '#0F172A' : C.green,
                  }}
                >
                  VND
                </button>
              </div>
            )}
          </h4>

          <button className="rounded-lg p-2 hover:bg-[#F8F9FA]" style={{ color: C.muted }}>
            <Icon name="Download" size={16} />
          </button>
        </div>

        {/* Error banner nhẹ (nếu có) */}
        {fetchError && (
          <div
            className="mb-4 px-3 py-2 rounded-lg text-xs"
            style={{ background: '#FFFBEB', color: '#92400E', border: '1px solid #FDE68A' }}
          >
            Dữ liệu đang hiển thị mock do lỗi gọi API. Chi tiết: {fetchError}
          </div>
        )}

        {renderContent()}
      </div>

      {/* Hàng 2: Key Insights full-width */}
      <div
        className="bg-white rounded-2xl border p-6"
        style={{ borderColor: C.border, boxShadow: C.shadow }}
      >
        <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: C.fg }}>
          <Icon name="Lightbulb" size={18} className="text-emerald-500" />
          <span>Key Insights</span>
        </h4>

        <ul className="space-y-3">
          {insights[activeCard].map(txt => (
            <li key={txt} className="flex items-start gap-3">
              <span className="w-2.5 h-2.5 rounded-full mt-2" style={{ background: C.green }} />
              <p className="text-[15px]" style={{ color: C.fg }}>
                {txt}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-6 pt-4 border-t" style={{ borderColor: C.border }}>
          <h5 className="font-medium mb-3" style={{ color: C.fg }}>
            Recommended Actions
          </h5>
          {activeCard === 'payment_history' && (
            <div className="px-4 py-3 rounded-lg text-sm" style={{ background: '#ECFDF5', color: '#065F46' }}>
              Set up automatic payments to maintain perfect record
            </div>
          )}
          {activeCard === 'utilization' && (
            <div className="px-4 py-3 rounded-lg text-sm" style={{ background: '#EFF6FF', color: '#1E40AF' }}>
              Pay down high utilization accounts first
            </div>
          )}
          {activeCard === 'credit_age' && (
            <div className="px-4 py-3 rounded-lg text-sm" style={{ background: '#F5F3FF', color: '#5B21B6' }}>
              Keep oldest accounts active with small purchases
            </div>
          )}
          {activeCard === 'new_credit' && (
            <div className="px-4 py-3 rounded-lg text-sm" style={{ background: '#FFFBEB', color: '#92400E' }}>
              Wait 3-6 months before next credit application
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedFactorBreakdown;
