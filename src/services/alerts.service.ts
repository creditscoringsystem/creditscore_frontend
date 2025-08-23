// src/services/alerts.service.ts
import api from '@/lib/apiClient';

export interface AlertOut {
  id: number;
  user_id: string;
  type: string;
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low' | 'info' | string;
  created_at: string; // ISO
  is_read: boolean;
}

export async function getAlerts(userId: string): Promise<AlertOut[]> {
  const { data } = await api.get(`/api/v1/alerts/${userId}`);
  return Array.isArray(data) ? data : [];
}

export async function markAlertRead(alertId: number): Promise<{ success: boolean }> {
  const { data } = await api.post(`/api/v1/alerts/${alertId}/read`);
  return data;
}

// Optional: FE có thể gọi khi tính điểm xong để tạo alerts tức thì (nếu cần)
export async function notifyScoreUpdated(payload: {
  user_id: string;
  old_score?: number | null;
  new_score: number;
  category?: string | null;
  model_version?: string | null;
  calculated_at?: string | null;
}) {
  const { data } = await api.post('/api/v1/alerts/on-score-updated', payload);
  return data as AlertOut[];
}
