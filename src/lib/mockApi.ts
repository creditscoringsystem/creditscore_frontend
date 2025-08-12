// An toàn với SSR + không import từ /pages, lưu localStorage khi chạy client.
// Không cần 'use client' ở đây.

type Scenario = {
  id?: number;
  name?: string;
  createdAt?: string;
  paymentAmount: number;
  utilizationChange: number;
  newAccounts: number;
  payoffTimeline: number;
  creditLimit: number;
  accountAge: number;
};

const KEY = 'simulator:saved';
let memoryStore: Scenario[] = []; // fallback khi SSR hoặc user chặn localStorage

function read(): Scenario[] {
  try {
    if (typeof window === 'undefined') return memoryStore; // SSR
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Scenario[]) : [];
  } catch {
    return memoryStore;
  }
}

function write(rows: Scenario[]) {
  memoryStore = rows;
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(KEY, JSON.stringify(rows));
    }
  } catch {
    // ignore
  }
}

/* =================== Overview dashboard =================== */
export async function fetchDashboard() {
  return {
    currentScore: 742,
    previousScore: 730,
    percentile: 78,
    riskLevel: 'Good',
    keyMetrics: {
      monthlyChange: 12,
      utilizationRate: 23,
      utilizationChange: -3,
      daysSinceUpdate: 2,
    },
    trend: Array.from({ length: 24 }).map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (23 - i));
      const base = 736 + Math.round(Math.sin(i / 3) * 6);
      return {
        date: d.toISOString().slice(0, 10),
        score: Math.max(700, Math.min(772, base)),
      };
    }),
    factors: [
      { name: 'Payment History',      weight: 35, score: 90, impact: 'Positive', status: 'Stable',         description: 'On-time payments' },
      { name: 'Credit Utilization',   weight: 30, score: 72, impact: 'Neutral',  status: 'Could Improve',  description: 'Keep under 30%' },
      { name: 'Credit Age',           weight: 15, score: 83, impact: 'Positive', status: 'Increasing',     description: 'Average age rising' },
      { name: 'New Credit',           weight: 10, score: 76, impact: 'Neutral',  status: 'Stable',         description: 'Few recent inquiries' },
      { name: 'Credit Mix',           weight: 10, score: 78, impact: 'Positive', status: 'Healthy',        description: 'Good mix of accounts' },
    ],
    alerts: [
      { id: 101, type: 'payment',     severity: 'low',    title: 'Upcoming payment', message: 'Card **** 1234 due in 5 days', timestamp: new Date().toISOString(), read: false, actionable: true },
      { id: 102, type: 'utilization', severity: 'medium', title: 'Utilization high', message: 'One card above 40%',           timestamp: new Date(Date.now() - 86400000).toISOString(), read: false, actionable: true },
    ],
  };
}

/* =================== Simulator (bạn đã có) =================== */
export async function fetchSimulator() {
  return { savedScenarios: read() };
}

export async function saveScenario(s: Scenario) {
  const rows = read();
  const saved: Scenario = {
    ...s,
    id: s.id ?? (rows.at(-1)?.id ?? 0) + 1,
    createdAt: new Date().toISOString(),
  };
  write([...rows, saved]);
  return saved;
}

export async function deleteScenario(id: number) {
  write(read().filter((r) => r.id !== id));
  return { ok: true };
}

export async function simulateScenario(s: Scenario, timeframe: number) {
  // Thuật toán mock đơn giản, khớp shape của ResultsPanel
  const base = 720;
  const paymentImpact = Math.round((s.paymentAmount / 100) * 2.5);
  const utilImpact = Math.round(Math.abs(s.utilizationChange) * 1.2);
  const newAccImpact = -8 * (s.newAccounts || 0);
  const payoffImpact = s.payoffTimeline <= 12 ? 20 : 12;
  const limitImpact = Math.round((s.creditLimit / 1000) * 0.8);
  const totalImpact = paymentImpact + utilImpact + newAccImpact + payoffImpact + limitImpact;

  const months = timeframe;
  const checkpoints = [1, Math.max(2, Math.floor(months / 3)), Math.max(3, Math.floor((months * 2) / 3)), months];
  const monthlyProgress = checkpoints.map((m, i) => ({
    month: m,
    score: base + Math.max(0, Math.round((totalImpact * (i + 1)) / checkpoints.length)),
    confidence: 90 - i * 2,
  }));

  return {
    projectedResults: {
      scoreRange: {
        min: base + Math.max(0, Math.floor(totalImpact / 3)),
        max: base + Math.max(15, totalImpact),
        target: base + Math.max(0, totalImpact),
      },
      confidenceLevel: 85,
      timeToTarget: Math.max(6, Math.min(24, s.payoffTimeline)),
      factorImpacts: [
        { factor: 'Payment History',     current: 35, projected: 38, change: Math.max(0, Math.floor(paymentImpact / 2)) },
        { factor: 'Credit Utilization',  current: 25, projected: 30, change: Math.max(0, Math.floor(utilImpact / 2)) },
        { factor: 'New Credit',          current: 10, projected: Math.max(0, 10 - (s.newAccounts || 0) * 2), change: -(s.newAccounts || 0) * 2 },
      ],
      monthlyProgress,
    },
  };
}

export async function exportResults(payload: any) {
  // mock export — có thể đổi thành gọi /api/export
  console.log('[mock export]', payload);
  return { ok: true };
}
