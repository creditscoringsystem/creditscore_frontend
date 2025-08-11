// src/pages/api/mock/simulator/projection.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const months = Math.max(1, Math.min(60, Number(req.query.months) || 12));
  const base = 720;

  const data = Array.from({ length: months + 1 }, (_, i) => {
    const t = i / months;
    const drift = Math.sin(i / 2.2) * 3;            // dao động nhẹ
    const gain  = 28 * t;                           // tăng dần
    const current = base + Math.round(drift);
    const simulated = base + Math.round(gain + drift);

    const conf = 14 + Math.random() * 6;
    return {
      month: i,
      monthLabel: i === 0 ? 'Now' : `${i} mo`,
      date: new Date(2025, 0, 1 + i * 30).toISOString(),
      current,
      simulated,
      confidenceUpper: Math.min(850, simulated + conf),
      confidenceLower: Math.max(300, simulated - conf),
    };
  });

  res.status(200).json({ data });
}
