import type { NextApiRequest, NextApiResponse } from 'next';

// In-memory store cho dev
const store: Record<string, { theme?: 'light'|'dark'|'auto'; language?: 'vi'|'en'|'zh' }> = {};

function getUserId(req: NextApiRequest): string | null {
  const uid = (req.headers['x-user-id'] || req.headers['X-User-Id'] || '') as string;
  return uid && String(uid).trim() ? String(uid).trim() : null;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const uid = getUserId(req);
  if (!uid) return res.status(400).json({ message: 'Missing X-User-Id header' });

  if (req.method === 'GET') {
    const prefs = store[uid] ?? { theme: 'light', language: 'vi' };
    return res.status(200).json(prefs);
  }

  if (req.method === 'PUT') {
    const body = req.body || {};
    const prev = store[uid] ?? { theme: 'light', language: 'vi' };
    const next: typeof prev = { ...prev };

    if (body.theme !== undefined) {
      const t = body.theme;
      if (!['light','dark','auto'].includes(t)) {
        return res.status(400).json({ message: 'Invalid theme' });
      }
      next.theme = t;
    }
    if (body.language !== undefined) {
      const l = body.language;
      if (!['vi','en','zh'].includes(l)) {
        return res.status(400).json({ message: 'Invalid language' });
      }
      next.language = l;
    }

    store[uid] = next;
    return res.status(200).json(next);
  }

  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).end('Method Not Allowed');
}
