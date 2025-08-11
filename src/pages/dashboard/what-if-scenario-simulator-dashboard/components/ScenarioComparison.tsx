'use client';

import React, { useMemo, useState } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

export type ScenarioItem = {
  id: string | number;
  name: string;
  paymentAmount: number;
  utilizationChange: number;
  newAccounts: number;
  payoffTimeline: number;
  creditLimit: number;
  accountAge: number;
  createdAt: string;
};

interface ScenarioComparisonProps {
  savedScenarios?: ScenarioItem[]; // <- optional
  onLoadScenario: (scenario: ScenarioItem) => void;
  onDeleteScenario: (id: string | number) => void;
}

interface ComparisonData extends ScenarioItem {
  projectedScore: number;
  timeToTarget: number;
  totalCost: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

/* USD formatter */
const fmtUSD = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-US');

export default function ScenarioComparison({
  savedScenarios = [], // <- default []
  onLoadScenario,
  onDeleteScenario,
}: ScenarioComparisonProps) {
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'score'>('date');
  const [showComparison, setShowComparison] = useState(false);

  // ✅ Guard tuyệt đối: nếu prop không là mảng -> ép về []
  const baseList: ScenarioItem[] = Array.isArray(savedScenarios) ? savedScenarios : [];

  const handleToggle = (id: string | number) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length < 4 ? [...s, id] : s));
  };

  const sorted = useMemo(() => {
    const arr = [...baseList]; // <- dùng baseList đã guard
    if (sortBy === 'name') {
      arr.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'score') {
      const est = (s: ScenarioItem) => 720 + s.paymentAmount / 50 + Math.abs(s.utilizationChange) - s.newAccounts * 5;
      arr.sort((a, b) => est(b) - est(a));
    } else {
      arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return arr;
  }, [baseList, sortBy]);

  const genComparison = (scs: ScenarioItem[]): ComparisonData[] =>
    scs.map((s) => ({
      ...s,
      projectedScore: Math.round(720 + s.paymentAmount / 50 + Math.abs(s.utilizationChange) - s.newAccounts * 5),
      timeToTarget: Math.max(3, 12 - Math.floor(s.paymentAmount / 100)),
      totalCost: s.paymentAmount * 12,
      riskLevel: s.newAccounts > 2 ? 'High' : s.utilizationChange > 0 ? 'Medium' : 'Low',
    }));

  const compData = genComparison(sorted.filter((s) => selected.includes(s.id)));

  const riskBadge = (r: ComparisonData['riskLevel']) =>
    r === 'Low'
      ? 'text-success bg-success/10'
      : r === 'Medium'
      ? 'text-warning bg-warning/10'
      : 'text-destructive bg-destructive/10';

  if (baseList.length === 0) {
    return (
      <section className="rounded-xl border bg-card p-10 text-center">
        <Icon name="Bookmark" size={22} className="mx-auto mb-2 text-muted-foreground" />
        <h3 className="text-base font-semibold">No Saved Scenarios</h3>
        <p className="text-sm text-muted-foreground">Create and save scenarios to compare.</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border bg-card shadow-elevation-1">
      {/* Header */}
      <div className="px-5 py-4 border-b">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Icon name="GitCompare" size={18} className="text-primary" />
            </span>
            <div>
              <h3 className="text-base font-semibold">Scenario Comparison</h3>
              <p className="text-xs text-muted-foreground">Compare up to 4 saved scenarios side by side</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                aria-label="Sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-full border px-4 py-2 text-sm hover:border-foreground/40"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="score">Sort by Score</option>
              </select>
            </div>

            {selected.length >= 2 && !showComparison && (
              <Button variant="default" size="sm" iconName="BarChart3" onClick={() => setShowComparison(true)}>
                Compare ({selected.length})
              </Button>
            )}
          </div>
        </div>

        {selected.length > 0 && !showComparison && (
          <p className="mt-2 text-xs text-muted-foreground">{selected.length} of 4 selected</p>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        {!showComparison ? (
          <div className="space-y-3">
            {sorted.map((s) => {
              const isSelected = selected.includes(s.id);
              const utilTone =
                s.utilizationChange < 0 ? 'text-success' : s.utilizationChange > 0 ? 'text-destructive' : 'text-foreground';

              return (
                <div
                  key={s.id}
                  className={[
                    'relative',
                    'group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-xl border px-4 py-3 transition',
                    isSelected ? 'border-primary bg-primary/5' : 'hover:border-primary/40',
                  ].join(' ')}
                >
                  {/* Checkbox */}
                  <div className="pt-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggle(s.id)}
                      className="h-[18px] w-[18px] rounded border-border text-primary"
                      aria-label={`Select ${s.name}`}
                    />
                  </div>

                  {/* Name + created */}
                  <div className="min-w-0">
                    <div className="truncate font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">Created {fmtDate(s.createdAt)}</div>
                  </div>

                  {/* Right metrics + actions */}
                  <div className="flex flex-wrap items-center justify-end gap-5">
                    <div className="text-right leading-tight">
                      <div className="text-[15px] font-semibold">{fmtUSD(s.paymentAmount)}/mo</div>
                      <div className="text-[11px] text-muted-foreground">Payment</div>
                    </div>

                    <div className="text-right leading-tight">
                      <div className={`text-[15px] font-semibold ${utilTone}`}>
                        {s.utilizationChange > 0 ? '+' : ''}
                        {s.utilizationChange}%
                      </div>
                      <div className="text-[11px] text-muted-foreground">Utilization</div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Play"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLoadScenario(s);
                      }}
                    >
                      Load
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      className="text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        const ok = window.confirm(`Delete scenario "${s.name}"?`);
                        if (ok) onDeleteScenario(s.id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>

                  {/* Row overlay click */}
                  <button
                    aria-hidden
                    onClick={() => handleToggle(s.id)}
                    className="absolute inset-0 cursor-pointer rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40"
                    tabIndex={-1}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Comparison</h4>
              <Button variant="outline" size="sm" iconName="ArrowLeft" onClick={() => setShowComparison(false)}>
                Back
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-3 text-left font-semibold">Metric</th>
                    {genComparison(sorted.filter((s) => selected.includes(s.id))).map((c) => (
                      <th key={c.id} className="p-3 text-center font-semibold">
                        {c.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 text-muted-foreground">Projected Score</td>
                    {genComparison(sorted.filter((s) => selected.includes(s.id))).map((c) => (
                      <td key={c.id} className="p-3 text-center text-success font-semibold">
                        {c.projectedScore}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 text-muted-foreground">Time to Target</td>
                    {genComparison(sorted.filter((s) => selected.includes(s.id))).map((c) => (
                      <td key={c.id} className="p-3 text-center text-warning font-semibold">
                        {c.timeToTarget} mo
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 text-muted-foreground">Total Cost (12 mo)</td>
                    {genComparison(sorted.filter((s) => selected.includes(s.id))).map((c) => (
                      <td key={c.id} className="p-3 text-center font-semibold">
                        {fmtUSD(c.totalCost)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-muted-foreground">Risk Level</td>
                    {genComparison(sorted.filter((s) => selected.includes(s.id))).map((c) => (
                      <td key={c.id} className="p-3 text-center">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${riskBadge(c.riskLevel)}`}>
                          {c.riskLevel}
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {genComparison(sorted.filter((s) => selected.includes(s.id))).length > 0 && (
              <div className="rounded-lg border border-success/20 bg-success/5 p-3 text-sm">
                <Icon name="Award" size={18} className="mr-2 inline text-success" />
                Best scenario:{' '}
                <strong>{genComparison(sorted.filter((s) => selected.includes(s.id)))[0].name}</strong>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
