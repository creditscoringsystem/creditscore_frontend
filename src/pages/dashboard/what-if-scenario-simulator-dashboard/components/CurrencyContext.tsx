'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

export type Currency = 'USD' | 'VND';
export const USD_TO_VND = 25000;

const fmtUSD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const fmtVND = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

type Ctx = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  /** format số USD sang chuỗi đúng đơn vị hiện tại */
  formatMoney: (amountUSD: number) => string;
  /** hệ số quy đổi hiển thị (1 với USD, 25.000 với VND) – chỉ dùng nếu cần value số */
  rate: number;
};

const CurrencyContext = createContext<Ctx | null>(null);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('USD');

  const value = useMemo<Ctx>(() => {
    const rate = currency === 'USD' ? 1 : USD_TO_VND;
    const formatMoney = (usd: number) => (currency === 'USD' ? fmtUSD.format(usd) : fmtVND.format(usd * USD_TO_VND));
    return { currency, setCurrency, formatMoney, rate };
  }, [currency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
};
