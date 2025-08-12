'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Currency = 'USD' | 'VND';

type Ctx = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatMoney: (amount: number) => string;
};

const CurrencyContext = createContext<Ctx | undefined>(undefined);

// Lazy init KHÔNG đọc localStorage khi SSR
function getInitial(): Currency {
  if (typeof window === 'undefined') return 'USD';
  const saved = window.localStorage.getItem('currency') as Currency | null;
  return saved === 'VND' || saved === 'USD' ? saved : 'USD';
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(getInitial);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('currency', currency);
      }
    } catch {/* ignore */}
  }, [currency]);

  const formatMoney = useMemo(() => {
    if (currency === 'VND') {
      const fmt = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
      });
      return (amount: number) => fmt.format(amount).replace('\u00A0', ' ');
    }
    const fmt = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    return (amount: number) => fmt.format(amount);
  }, [currency]);

  const value: Ctx = { currency, setCurrency, formatMoney };
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): Ctx {
  const ctx = useContext(CurrencyContext);
  if (ctx) return ctx;

  // 🔒 Fallback an toàn cho trường hợp component bị prerender riêng lẻ (không có Provider)
  const formatUSD = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);

  return {
    currency: 'USD',
    setCurrency: () => {},
    formatMoney: formatUSD,
  };
}
