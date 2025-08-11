// Mock: tính kết quả Simulator theo scenario gửi lên
import type { NextApiRequest, NextApiResponse } from 'next';

type Scenario = {
  paymentAmount: number;       // USD
  utilizationChange: number;   // %
  newAccounts: number;         // count
  payoffTimeline: number;      // months
  creditLimit: number;         // USD
  accountAge?: number;         // months
  name?: string;
  id?: number;
  createdAt?: string;
};

type FactorImpact = { factor: string; current: number; projected: number; change: number };
type ScoreRange = { min: number; max: number; target: number };

type ProjectedResults = {
  scoreRange: ScoreRange;
  confidenceLevel: number;
  timeToTarget: number;
  factorImpacts: FactorImpact[];
  monthlyProgress: { month: number; score: number; confidence: number }[];
};

type Resp = {
  scenario: Scenario;
  projectedResults: ProjectedResults;
  impactSummary: {
    paymentImpact: number;
    utilizationImpact: number;
    newAccountImpact: number;
    payoffImpact: number;
    creditLimitImpact: number;
    overallDelta: number;
    baseScore: number;
    projectedScore: number;
  };
};

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Resp | { error: string }>) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

  const { scenario, timeframe = 12 } = req.body as { scenario: Scenario; timeframe?: number };
  if (!scenario) return res.status(400).json({ error: 'Missing scenario' });

  const baseScore = 720;

  // Công thức “giả lập” (nhất quán với UI bạn đang dùng)
  const paymentImpact = (scenario.paymentAmount / 100) * 2.5;                  // + mỗi $100
  const utilizationImpact = Math.abs(scenario.utilizationChange) * 1.2;        // +/- theo %
  const newAccountImpact = scenario.newAccounts * -8;                           // mở mới -> trừ điểm
  const payoffImpact = scenario.payoffTimeline <= 12 ? 20 : 12;                 // trả trong 12m tốt hơn
  const creditLimitImpact = (scenario.creditLimit / 1000) * 0.8;                // tăng hạn mức nhẹ
  const overallDelta =
    paymentImpact + utilizationImpact + newAccountImpact + payoffImpact + creditLimitImpact;

  const projectedScore = clamp(Math.round(baseScore + overallDelta), 300, 850);
  const scoreRange: ScoreRange = {
    min: clamp(projectedScore - 25, 300, 850),
    max: clamp(projectedScore + 25, 300, 850),
    target: projectedScore,
  };

  // Conf & time-to-target “giả lập” gắn với độ lớn cải thiện
  const confidenceLevel = clamp(Math.round(80 + Math.min(10, overallDelta / 5)), 60, 95);
  const timeToTarget = clamp(
    Math.round(Math.max(3, scenario.payoffTimeline * 0.8)),
    3,
    Math.max(3, timeframe)
  );

  // Factor impacts hiển thị ở ResultsPanel
  const factorImpacts: FactorImpact[] = [
    { factor: 'Payment History', current: 35, projected: clamp(35 + Math.round(paymentImpact / 2), 0, 45), change: Math.round(paymentImpact / 2) },
    { factor: 'Credit Utilization', current: 25, projected: clamp(25 + Math.round(scenario.utilizationChange / 3), 10, 40), change: Math.round(scenario.utilizationChange / 3) },
    { factor: 'Length of History', current: 15, projected: 15 + (scenario.accountAge ? Math.min(2, Math.floor(scenario.accountAge / 24)) : 1), change: (scenario.accountAge ? Math.min(2, Math.floor(scenario.accountAge / 24)) : 1) },
    { factor: 'Credit Mix', current: 10, projected: 10, change: 0 },
    { factor: 'New Credit', current: 10, projected: clamp(10 - scenario.newAccounts * 2, 0, 15), change: -scenario.newAccounts * 2 },
  ];

  // Monthly progress tới target
  const months = Math.max(6, timeframe);
  const monthlyProgress = Array.from({ length: 4 }).map((_, i) => {
    const m = [1, Math.round(months / 3), Math.round((months * 2) / 3), months][i];
    const score = clamp(
      Math.round(baseScore + (overallDelta * (m / months)) + (i ? (Math.random() * 6 - 3) : 0)),
      300, 850
    );
    const conf = clamp(Math.round(confidenceLevel - (4 - i) * 2 + Math.random() * 2), 60, 95);
    return { month: m, score, confidence: conf };
  });

  const body: Resp = {
    scenario,
    projectedResults: {
      scoreRange,
      confidenceLevel,
      timeToTarget,
      factorImpacts,
      monthlyProgress,
    },
    impactSummary: {
      paymentImpact: Math.round(paymentImpact),
      utilizationImpact: Math.round(utilizationImpact),
      newAccountImpact: Math.round(newAccountImpact),
      payoffImpact: Math.round(payoffImpact),
      creditLimitImpact: Math.round(creditLimitImpact),
      overallDelta: Math.round(overallDelta),
      baseScore,
      projectedScore,
    },
  };

  res.status(200).json(body);
}
