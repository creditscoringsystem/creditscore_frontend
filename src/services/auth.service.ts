import api from '@/lib/apiClient';

const TOKEN_KEY = 'auth_token';
export const setToken = (t: string) => { if (typeof window !== 'undefined') window.localStorage.setItem(TOKEN_KEY, t); };
export const getToken = () => (typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_KEY) : null);
export const clearToken = () => { if (typeof window !== 'undefined') window.localStorage.removeItem(TOKEN_KEY); };

export type LoginDto = { email: string; password: string };
export type SignupDto = { name?: string; email: string; password: string };
export type ResetPasswordDto = { token: string; newPassword: string };
export type ChangePasswordDto = { oldPassword: string; newPassword: string };

export async function login(payload: LoginDto) {
  const res = await api.post('/api/v1/auth/login', payload);
  const { data, headers } = res as any;

  // Try to extract token from common shapes
  const token: string | undefined =
    data?.accessToken ||
    data?.token ||
    data?.access_token ||
    data?.jwt ||
    data?.data?.accessToken ||
    data?.data?.token ||
    data?.data?.access_token ||
    data?.data?.jwt ||
    data?.payload?.accessToken ||
    data?.payload?.token ||
    data?.payload?.access_token ||
    data?.payload?.jwt ||
    (() => {
      const authHeader: string | undefined = headers?.authorization || headers?.Authorization;
      if (authHeader && typeof authHeader === 'string') {
        const m = authHeader.match(/Bearer\s+(.+)/i);
        return m ? m[1] : undefined;
      }
      return undefined;
    })();

  if (token) setToken(token);
  return data;
}

export async function signup(payload: SignupDto) {
  const { data } = await api.post('/api/v1/auth/signup', payload);
  return data;
}

export async function verifyToken() {
  const { data } = await api.post('/api/v1/auth/verify-token');
  return data;
}

export async function forgotPassword(payload: { email: string }) {
  const { data } = await api.post('/api/v1/auth/forgot-password', payload);
  return data;
}

export async function resetPassword(payload: ResetPasswordDto) {
  const { data } = await api.post('/api/v1/auth/reset-password', payload);
  return data;
}

export async function changePassword(payload: ChangePasswordDto) {
  const { data } = await api.post('/api/v1/auth/change-password', payload);
  return data;
}

export function logout() {
  clearToken();
}