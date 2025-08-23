import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://score-service.onrender.com',
  timeout: 15000,
  withCredentials: true, 
});

// Attach Authorization header from localStorage if present (Bearer token)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('auth_token');
    if (token) {
      // Preserve existing headers and set Authorization
      const existing = config.headers ?? {};
      config.headers = { ...(existing as any), Authorization: `Bearer ${token}` } as any;
    }
  }
  return config;
});

// Optional: normalize 401 handling (do not redirect automatically to avoid UX jumps)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // You can add global handling for 401 here if desired
    return Promise.reject(err);
  }
);

export default api;