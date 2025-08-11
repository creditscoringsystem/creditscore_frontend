// Mock: dữ liệu tổng cho trang Overview
import type { NextApiRequest, NextApiResponse } from 'next';

type TrendPoint = { date: string; score: number };
type KeyMetrics = {
  monthlyChange: number;
  utilizationRate: number;
  utilizationChange: number;
  daysSinceUpdate: number;
};

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  // 24 tháng gần nhất
  const now = new Date();
  const trend: TrendPoint[] = Array.from({ length: 24 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (23 - i), 1);
    const base = 720;
    const jitter = Math.round(Math.sin(i / 3) * 6 + (Math.random() * 4 - 2));
    return { date: d.toISOString().slice(0, 10), score: Math.max(300, Math.min(850, base + jitter)) };
    // UI của bạn đã có helper buildScorePointsFromISO -> dùng cho chart
  });

  const data = {
    currentScore: 742,
    previousScore: 730,
    percentile: 78,
    riskLevel: 'Good',
    keyMetrics: <KeyMetrics>{
      monthlyChange: 12,
      utilizationRate: 23,
      utilizationChange: -3,
      daysSinceUpdate: 2,
    },
    trend, // ISO date + score
    creditFactors: [
      {
        name: 'Payment History',
        weight: 35,
        score: 85,
        impact: 'Positive',
        status: 'Excellent - No missed payments',
        description: 'Your payment history shows consistent on-time payments across all accounts.',
      },
      {
        name: 'Credit Utilization',
        weight: 30,
        score: 80,
        impact: 'Neutral',
        status: 'Below 30% recommended',
        description: 'Keeping utilization under 30% can improve your score.',
      },
    ],
    recentAlerts: [
      {
        id: 1,
        type: 'score_change',
        severity: 'info',
        title: 'Credit Score Increased',
        message: 'Your credit score increased by 4 points to 742',
        timestamp: new Date().toISOString(),
        read: false,
        actionable: false,
      },
    ],
    // Tỷ giá để client tự format tiền tệ
    fx: { base: 'USD', VND: 25000 },
  };

  res.status(200).json(data);
}
