import axios from 'axios';
import { getToken } from '@/services/auth.service';

// Base URL riêng cho Profile Service
// Có thể cấu hình qua NEXT_PUBLIC_PROFILE_API_BASE_URL
const profileApi = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? ''
      : (process.env.NEXT_PUBLIC_PROFILE_API_BASE_URL || 'https://profile-service-l6e7.onrender.com'),
  timeout: 15000,
});

// Giải mã JWT tối giản để lấy userId (sub/user_id/uid/id)
function decodeJwt(token: string): any | null {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = typeof window !== 'undefined' ? window.atob(base64) : Buffer.from(base64, 'base64').toString('binary');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function extractUserIdFromToken(): string | null {
  const token = getToken();
  const claims = token ? decodeJwt(token) : null;
  const uid: string | undefined = claims?.sub || claims?.user_id || claims?.uid || claims?.id;
  if (uid) return uid;
  // Dev fallback: allow overriding via localStorage in dev without auth
  try {
    if (typeof window !== 'undefined') {
      const dev = window.localStorage.getItem('dev_user_id');
      if (dev && dev.trim()) return dev.trim();
    }
  } catch {}
  return null;
}

// Interceptor: tự gắn X-User-Id cho mọi request
profileApi.interceptors.request.use((config) => {
  const existing = (config.headers || {}) as Record<string, any>;
  // Nếu đã set sẵn X-User-Id bởi caller thì giữ nguyên
  if (!existing['X-User-Id'] && !existing['x-user-id']) {
    const uid = extractUserIdFromToken();
    const finalUid = uid ?? (process.env.NODE_ENV === 'development' ? 'demo_user' : undefined);
    if (finalUid) {
      config.headers = { ...existing, 'X-User-Id': finalUid } as any;
    }
  }
  return config;
});

// Types
export type ProfileUpdate = {
  full_name?: string | null;
  email?: string | null; // dạng email hợp lệ
  phone?: string | null; // 10-11 chữ số
  avatar?: string | null; // URL http/https
  date_of_birth?: string | null; // YYYY-MM-DD
  address?: string | null;
};

export type ProfileOut = {
  user_id: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  avatar?: string | null;
  date_of_birth?: string | null;
  address?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Preferences = {
  theme?: 'light' | 'dark' | 'auto';
  language?: 'vi' | 'en' | 'zh';
};

// Services: Profile
export async function getMyProfile() {
  const { data } = await profileApi.get<ProfileOut>('/api/v1/profile/me');
  return data;
}

export async function createMyProfile(payload: ProfileUpdate) {
  const { data } = await profileApi.post<ProfileOut>('/api/v1/profile/me', payload);
  return data;
}

export async function updateMyProfile(payload: ProfileUpdate) {
  const { data } = await profileApi.put<ProfileOut>('/api/v1/profile/me', payload);
  return data;
}

// Services: Preferences
export async function getMyPreferences() {
  const { data } = await profileApi.get<Preferences>('/api/v1/preferences/me');
  return data;
}

export async function updateMyPreferences(payload: Preferences) {
  const { data } = await profileApi.put<Preferences>('/api/v1/preferences/me', payload);
  return data;
}
