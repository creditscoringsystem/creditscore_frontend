// pages/credit-factor-analysis-dashboard/index.tsx
'use client';

import React, { useEffect, useState } from 'react';
import DashboardShell from '@/components/layouts/DashboardShell';
import DetailedFactorBreakdown from './components/DetailedFactorBreakdown';

const CreditFactorAnalysisDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1_000);
    return () => clearTimeout(t);
  }, []);

  // Container chuẩn giữa + “nudge” sang trái (đồng bộ Overview)
  const CONTAINER = 'mx-auto max-w-[1200px] px-6';
  const NUDGE_LEFT = 'md:transform md:-translate-x-38 xl:-translate-x-30';

  if (isLoading) {
    return (
      <DashboardShell>
        <div className={`${CONTAINER} ${NUDGE_LEFT}`}>
          <div className="h-64 rounded-lg animate-pulse bg-[var(--color-muted)]" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className={`${CONTAINER} ${NUDGE_LEFT}`}>
        <header className="mb-8">
          {/* Đậm hơn + ép màu đen xanh đậm */}
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: '#0F172A' }} // đen đậm
          >
            Factor Analysis
          </h1>
          {/* Mô tả cũng đậm màu hơn một chút */}
          <p
            className="text-base"
            style={{ color: '#374151' }} // xám đậm
          >
            Detailed breakdown of credit score factors
          </p>
        </header>

        {/* Chỉ giữ phần nội dung thật cần dùng */}
        <div className="space-y-6">
          <DetailedFactorBreakdown />
        </div>
      </div>
    </DashboardShell>
  );
};

export default CreditFactorAnalysisDashboard;
