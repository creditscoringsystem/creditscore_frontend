// src/pages/api/mock/scenarios.ts

// Mock: lưu & đọc danh sách scenario (in-memory)
import type { NextApiRequest, NextApiResponse } from 'next';

type Scenario = {
  paymentAmount: number;
  utilizationChange: number;
  newAccounts: number;
  payoffTimeline: number;
  creditLimit: number;
  accountAge: number;
  name?: string;
  id?: number;
  createdAt?: string;
};

let SCENARIOS: Scenario[] = [
  { id: 1, name: 'Aggressive Paydown',     paymentAmount: 500, utilizationChange: -25, newAccounts: 0, payoffTimeline: 8,  creditLimit: 0,    accountAge: 24, createdAt: '2025-01-05T10:30:00.000Z' },
  { id: 2, name: 'Conservative Approach',  paymentAmount: 150, utilizationChange: -10, newAccounts: 0, payoffTimeline: 18, creditLimit: 2500, accountAge: 24, createdAt: '2025-01-04T14:15:00.000Z' },
  { id: 3, name: 'Balance Transfer Strategy', paymentAmount: 300, utilizationChange: -20, newAccounts: 1, payoffTimeline: 12, creditLimit: 7500, accountAge: 24, createdAt: '2025-01-03T09:45:00.000Z' },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({ items: SCENARIOS });
  }

  if (req.method === 'POST') {
    const s = req.body as Scenario;
    const newItem: Scenario = {
      ...s,
      id: (SCENARIOS.at(-1)?.id ?? 0) + 1,
      createdAt: new Date().toISOString(),
    };
    SCENARIOS.push(newItem);
    return res.status(201).json(newItem);
  }

  if (req.method === 'DELETE') {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: 'Missing id' });
    SCENARIOS = SCENARIOS.filter(s => s.id !== id);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
