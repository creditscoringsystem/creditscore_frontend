'use client';
import { useMemo, useSyncExternalStore } from 'react';

/* ===== Types ===== */
export type Severity = 'high' | 'medium' | 'low' | 'info';

export type AlertType =
  | 'score_change'
  | 'new_account'
  | 'payment_due'
  | 'utilization'
  | 'inquiry'
  | string;

export interface AlertItem {
  id: string | number;
  title: string;
  message: string;
  severity: Severity;
  type: AlertType;
  timestamp: string | Date;
  read?: boolean;
  actionable?: boolean;
  details?: string;
  recommendation?: string;
}

/* ===== Mini store (no deps) ===== */
type State = { alerts: AlertItem[] };
let state: State = {
  alerts: [
    {
      id: 'a1',
      title: 'Credit Score Update',
      message: 'Your credit score has increased by 15 points',
      severity: 'info',
      type: 'score_change',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      read: false,
      actionable: false,
      details:
        'This increase is mainly due to reduced utilization and on-time payments.',
      recommendation:
        'Keep utilization < 30% and maintain on-time payments to continue improving.',
    },
    {
      id: 'a2',
      title: 'Payment Reminder',
      message: 'Credit card payment due in 3 days',
      severity: 'high',
      type: 'payment_due',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: false,
      actionable: true,
      details:
        'Your Card •••• 1234 has a minimum payment due soon. Avoid late fees.',
      recommendation: 'Schedule an automatic payment or pay now.',
    },
    {
      id: 'a3',
      title: 'New Credit Inquiry',
      message: 'Hard inquiry detected from ABC Bank',
      severity: 'low',
      type: 'inquiry',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      read: true,
      actionable: false,
    },
    {
      id: 'a4',
      title: 'Credit Utilization Alert',
      message: 'Your credit utilization decreased to 23%',
      severity: 'medium',
      type: 'utilization',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
      actionable: true,
      details: 'Utilization moved from 28% → 23%.',
      recommendation: 'Try to keep balances below 30% for best impact.',
    },
  ],
};

const listeners = new Set<() => void>();
function emit() { listeners.forEach((l) => l()); }

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
export function getSnapshot() { return state; }
export function setState(updater: (s: State) => State) {
  state = updater(state);
  emit();
}

/* ===== Actions ===== */
export const notificationsActions = {
  markAllRead() {
    setState((s) => ({
      alerts: s.alerts.map((a) => ({ ...a, read: true })),
    }));
  },
  markRead(id: string | number) {
    setState((s) => ({
      alerts: s.alerts.map((a) => (a.id === id ? { ...a, read: true } : a)),
    }));
  },
  dismiss(id: string | number) {
    setState((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) }));
  },
  add(a: AlertItem) {
    setState((s) => ({ alerts: [a, ...s.alerts] }));
  },
  replaceAll(arr: AlertItem[]) {
    setState(() => ({ alerts: arr }));
  },
};

/* ===== Hook ===== */
export function useNotifications() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const unread = useMemo(
    () => snap.alerts.filter((a) => !a.read).length,
    [snap.alerts],
  );
  return { alerts: snap.alerts, unread, ...notificationsActions };
}
