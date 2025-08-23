import type { NextApiRequest, NextApiResponse } from 'next';

// In-memory store cho dev
const profiles: Record<string, {
  user_id: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  avatar?: string | null;
  date_of_birth?: string | null;
  address?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}> = {};

function getUserId(req: NextApiRequest): string | null {
  const uid = (req.headers['x-user-id'] || req.headers['X-User-Id'] || '') as string;
  return uid && String(uid).trim() ? String(uid).trim() : null;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const uid = getUserId(req);
  if (!uid) return res.status(400).json({ message: 'Missing X-User-Id header' });

  if (req.method === 'GET') {
    const prof = profiles[uid] || {
      user_id: uid,
      full_name: null,
      email: `${uid}@example.com`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    profiles[uid] = prof;
    return res.status(200).json(prof);
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const prof = {
      user_id: uid,
      full_name: body.full_name ?? null,
      email: body.email ?? `${uid}@example.com`,
      phone: body.phone ?? null,
      avatar: body.avatar ?? null,
      date_of_birth: body.date_of_birth ?? null,
      address: body.address ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    profiles[uid] = prof;
    return res.status(201).json(prof);
  }

  if (req.method === 'PUT') {
    const body = req.body || {};
    const prev = profiles[uid] || { user_id: uid } as any;
    const next = {
      ...prev,
      ...body,
      user_id: uid,
      updated_at: new Date().toISOString(),
    };
    profiles[uid] = next;
    return res.status(200).json(next);
  }

  res.setHeader('Allow', 'GET, POST, PUT');
  return res.status(405).end('Method Not Allowed');
}
