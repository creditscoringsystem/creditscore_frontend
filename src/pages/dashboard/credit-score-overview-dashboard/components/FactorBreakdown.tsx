// src/pages/dashboard/credit-score-overview-dashboard/components/FactorBreakdown.tsx
'use client';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import Icon from '@/components/AppIcon';

export type Impact = 'Positive' | 'Neutral' | 'Negative';

export interface Factor {
  name: string;
  weight: number;     // % of score
  score: number;      // 0..100 (%)
  impact: Impact;
  status: string;     // "Excellent - No missed payments"
  description: string;
}

interface FactorBreakdownProps {
  factors?: Factor[];
  showTipsButton?: boolean;
}

/* ===== Palette ép cứng theo design (không đụng global) ===== */
const C = {
  card: '#FFFFFF',
  border: '#E5E7EB',
  fg: '#0F172A',
  muted: '#6B7280',
  neon: '#12F7A0',
  red: '#FF3B6B',
  neutral: '#8B8FA3',
  track: '#EEF2F7',
  pill: '#F3F4F6',
  shadow: '0 6px 24px rgba(15,23,42,0.06)',
};

/* ===== Demo defaults (để luôn đủ 5 mục nếu props thiếu) ===== */
const DEFAULTS: Factor[] = [
  {
    name: 'Payment History',
    weight: 35,
    score: 85,
    impact: 'Positive',
    status: 'Excellent - No missed payments',
    description:
      'Your payment history shows consistent on-time payments across all accounts.',
  },
  {
    name: 'Credit Utilization',
    weight: 30,
    score: 72,
    impact: 'Neutral',
    status: 'Good - 23% utilization',
    description:
      'Your credit utilization is within acceptable range but could be improved.',
  },
  {
    name: 'Length of History',
    weight: 15,
    score: 78,
    impact: 'Positive',
    status: 'Good - 6.5 years average age',
    description:
      'Your credit history length is above average and positively impacts your score.',
  },
  {
    name: 'New Credit',
    weight: 10,
    score: 65,
    impact: 'Negative',
    status: 'Fair - 2 recent inquiries',
    description:
      'Recent credit inquiries are slightly impacting your score.',
  },
  {
    name: 'Credit Mix',
    weight: 10,
    score: 80,
    impact: 'Positive',
    status: 'Good - Diverse accounts',
    description:
      'You have a good mix of credit types, including cards and installment loans.',
  },
];

const impactBadge = (impact: Impact) => {
  switch (impact) {
    case 'Positive':
      return 'bg-[rgba(18,247,160,0.15)] text-[#10b981]';
    case 'Neutral':
      return 'bg-[#F3F4F6] text-[#6B7280]';
    case 'Negative':
      return 'bg-[rgba(255,59,107,0.12)] text-[#ef4444]';
  }
};

const barColor = (impact: Impact) => {
  switch (impact) {
    case 'Positive':
      return C.neon;
    case 'Neutral':
      return C.neutral;
    case 'Negative':
      return C.red;
  }
};

const iconName = (name: string) => {
  if (name.toLowerCase().includes('payment')) return 'PieChart';
  if (name.toLowerCase().includes('utilization')) return 'CreditCard';
  if (name.toLowerCase().includes('length')) return 'Clock';
  if (name.toLowerCase().includes('new')) return 'PlusSquare';
  if (name.toLowerCase().includes('mix')) return 'Layers';
  return 'PieChart';
};

const FactorCard: React.FC<{ f: Factor }> = ({ f }) => {
  const width = Math.max(0, Math.min(100, f.score));

  return (
    <div
      className="rounded-2xl p-4 border"
      style={{ background: C.card, borderColor: C.border, boxShadow: C.shadow }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: C.pill }}
          >
            <Icon name={iconName(f.name)} size={18} />
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: C.fg }}>
              {f.name}
            </div>
            <div className="text-xs" style={{ color: C.muted }}>
              {f.weight}% of score
            </div>
          </div>
        </div>

        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${impactBadge(
            f.impact,
          )}`}
        >
          {f.impact}
        </span>
      </div>

      {/* Scale labels */}
      <div className="flex items-center justify-between text-[11px] mb-1" style={{ color: C.muted }}>
        <span>Poor</span>
        <span>Excellent</span>
      </div>

      {/* Progress */}
      <div
        className="w-full h-2.5 rounded-full overflow-hidden"
        style={{ background: C.track }}
      >
        <div
          className="h-full"
          style={{ width: `${width}%`, background: barColor(f.impact) }}
        />
      </div>

      {/* % value */}
      <div className="mt-4 mb-2 flex items-center gap-2">
        <Icon
          name={
            f.impact === 'Negative'
              ? 'TrendingDown'
              : f.impact === 'Positive'
              ? 'TrendingUp'
              : 'Minus'
          }
          size={14}
          className={
            f.impact === 'Negative'
              ? 'text-[#ef4444]'
              : f.impact === 'Positive'
              ? 'text-[#10b981]'
              : 'text-[#6B7280]'
          }
        />
        <span className="text-sm font-medium" style={{ color: C.fg }}>
          {width}%
        </span>
      </div>

      {/* Description */}
      <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
        {f.description}
      </p>

      {/* Status */}
      <div className="mt-3 text-xs">
        <div style={{ color: C.muted }}>Current Status:</div>
        <div className="font-medium" style={{ color: C.fg }}>
          {f.status}
        </div>
      </div>
    </div>
  );
};

const FactorBreakdown: React.FC<FactorBreakdownProps> = ({
  factors,
  showTipsButton = true,
}) => {
  // Merge props với defaults để luôn đủ 5 card (ưu tiên data bạn truyền)
  const mapByName = new Map(DEFAULTS.map((d) => [d.name, d]));
  (factors ?? []).forEach((f) => mapByName.set(f.name, f));
  const list = Array.from(mapByName.values());

  // ⬇️ chỉ bổ sung popover cho nút dấu chấm hỏi
  const [openHelp, setOpenHelp] = useState(false);
  const helpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!helpRef.current) return;
      if (!helpRef.current.contains(e.target as Node)) setOpenHelp(false);
    }
    if (openHelp) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [openHelp]);

  return (
    <section
      className="rounded-2xl p-4 border"
      style={{ background: C.card, borderColor: C.border, boxShadow: C.shadow }}
    >
      {/* Title + Help */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: C.fg }}>
            Factor Breakdown
          </h3>
          <p className="text-xs" style={{ color: C.muted }}>
            Impact on your credit score
          </p>
        </div>

        <div className="relative" ref={helpRef}>
          <button
            aria-label="Help"
            onClick={() => setOpenHelp((v) => !v)}
            className="p-2 rounded-lg hover:opacity-80"
            style={{ color: C.muted, background: C.pill }}
          >
            <Icon name="CircleHelp" size={16} />
          </button>

          {openHelp && (
            <div
              className="absolute right-0 top-full mt-2 w-[300px] rounded-lg border p-3 z-10"
              style={{ background: C.card, borderColor: C.border, boxShadow: C.shadow }}
            >
              <div className="flex items-center gap-2 mb-2" style={{ color: C.fg }}>
                <Icon name="Info" size={16} />
                <span className="text-sm font-medium">How this works</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
                Each factor shows its weight in your overall score, your current performance,
                and a short note. Improving lower cards (e.g., utilization or new credit)
                will typically raise your score faster.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Grid ngang */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {list.map((f) => (
          <FactorCard key={f.name} f={f} />
        ))}
      </div>

      {/* CTA */}
      {showTipsButton && (
        <Link
          href="/dashboard/credit-factor-analysis-dashboard"
          className="mt-6 block w-full text-center py-3 rounded-full bg-[#12F7A0] text-[#0B1520] font-semibold shadow-[0_8px_20px_rgba(18,247,160,0.30)] hover:opacity-95 transition"
        >
          <span className="inline-flex items-center gap-2 justify-center">
            <Icon name="Sparkles" size={18} />
            Get Improvement Tips
          </span>
        </Link>
      )}
    </section>
  );
};

export default FactorBreakdown;
