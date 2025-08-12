// src/pages/dashboard/what-if-scenario-simulator-dashboard/components/ScenarioControlPanel.tsx
'use client';

import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useCurrency } from '@/features/simulator/CurrencyContext';

export interface Scenario {
  paymentAmount: number;
  utilizationChange: number;
  newAccounts: number;
  payoffTimeline: number;
  creditLimit: number;
  accountAge: number;
  name?: string;
  id?: number;
  createdAt?: string;
}

interface ScenarioControlPanelProps {
  currentScenario?: Scenario | null;
  savedScenarios: Scenario[];
  onScenarioChange: (scenario: Scenario) => void;
  onSaveScenario: (scenario: Scenario) => void;
}

/* ===== Palette cục bộ ===== */
const C = {
  fg: 'var(--color-foreground, #0F172A)',
  muted: 'var(--color-muted-foreground, #6B7280)',
  border: 'var(--color-border, #E5E7EB)',
  card: 'var(--color-card, #FFFFFF)',
  shadow: '0 6px 24px rgba(15,23,42,0.06)',
  neon: 'var(--color-neon, #12F7A0)',
  neonSoft: 'rgba(18,247,160,0.12)',
  track: 'var(--slider-track, #E5E7EB)',
  thumb: 'var(--slider-thumb, #E9D5FF)',
};

export default function ScenarioControlPanel({
  currentScenario,
  savedScenarios,
  onScenarioChange,
  onSaveScenario
}: ScenarioControlPanelProps) {
  const { formatMoney } = useCurrency();

  const defaultScenario: Scenario = {
    paymentAmount: 250,
    utilizationChange: -15,
    newAccounts: 0,
    payoffTimeline: 12,
    creditLimit: 5000,
    accountAge: 24
  };

  const [scenario, setScenario] = useState<Scenario>(defaultScenario);
  const [scenarioName, setScenarioName] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const changeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { if (currentScenario) setScenario(currentScenario); }, [currentScenario]);
  useEffect(() => () => { if (changeTimeout.current) clearTimeout(changeTimeout.current); }, []);

  const handleParameterChange = (parameter: keyof Scenario, value: string) => {
    const numeric = parseFloat(value) || 0;
    const updated = { ...scenario, [parameter]: numeric };
    setScenario(updated);
    if (changeTimeout.current) clearTimeout(changeTimeout.current);
    changeTimeout.current = setTimeout(() => onScenarioChange(updated), 300);
  };

  const handleSaveScenario = () => {
    if (!scenarioName.trim()) return;
    const toSave: Scenario = {
      ...scenario,
      name: scenarioName.trim(),
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    onSaveScenario(toSave);
    setScenarioName('');
  };

  const resetToDefaults = () => {
    setScenario(defaultScenario);
    onScenarioChange(defaultScenario);
  };

  const parameterConfigs = [
    { key: 'paymentAmount',     label: 'Monthly Payment',      min: 0,   max: 2000,  step: 25,  unit: '$',        description: 'Additional monthly payment towards debt' },
    { key: 'utilizationChange', label: 'Utilization Change',   min: -50, max: 50,    step: 5,   unit: '%',        description: 'Change in credit utilization ratio' },
    { key: 'newAccounts',       label: 'New Accounts',         min: 0,   max: 5,     step: 1,   unit: '',         description: 'Number of new credit accounts to open' },
    { key: 'payoffTimeline',    label: 'Payoff Timeline',      min: 3,   max: 60,    step: 3,   unit: ' months',  description: 'Timeline to pay off existing debt' },
    { key: 'creditLimit',       label: 'Credit Limit Increase',min: 0,   max: 20000, step: 500, unit: '$',        description: 'Requested credit limit increase' },
    { key: 'accountAge',        label: 'Account Age',          min: 6,   max: 120,   step: 6,   unit: ' months',  description: 'Average age of credit accounts' }
  ] as const;

  // ✅ đổi cách format: với '$' -> xài formatMoney (giữ value là USD, chỉ đổi hiển thị)
  const formatValue = (val: number, unit: string) => {
    if (unit === '$') return formatMoney(val);
    return `${val}${unit}`;
  };

  const sliderBg = (val: number, min: number, max: number) => {
    const pct = ((val - min) / (max - min)) * 100;
    return `linear-gradient(to right, ${C.neon} 0%, ${C.neon} ${pct}%, ${C.track} ${pct}%, ${C.track} 100%)`;
  };

  const canSave = !!scenarioName.trim();

  return (
    <div className="rounded-2xl border" style={{ background: C.card, borderColor: C.border, boxShadow: C.shadow }}>
      {/* Header */}
      <div className="px-6 py-5 border-b" style={{ borderColor: C.border }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: C.neonSoft }}>
              <Icon name="Settings" size={18} style={{ color: C.neon }} />
            </div>
            <div>
              <h3 className="text-lg font-semibold" style={{ color: C.fg }}>Scenario Controls</h3>
              <p className="text-sm" style={{ color: C.muted }}>Adjust parameters to simulate changes</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'} onClick={() => setIsExpanded(v => !v)} className="px-3">
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 space-y-7">
          <div className="space-y-7">
            {parameterConfigs.map(cfg => (
              <div key={cfg.key} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium" style={{ color: C.fg }}>{cfg.label}</label>
                  <span className="text-sm font-semibold" style={{ color: C.neon }}>
                    {formatValue(scenario[cfg.key], cfg.unit)}
                  </span>
                </div>

                <input
                  type="range"
                  min={cfg.min}
                  max={cfg.max}
                  step={cfg.step}
                  value={scenario[cfg.key]}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleParameterChange(cfg.key, e.target.value)}
                  className="w-full h-2 rounded-full appearance-none sim-slider"
                  style={{ background: sliderBg(scenario[cfg.key], cfg.min, cfg.max) }}
                />

                <div className="flex justify-between text-xs" style={{ color: C.muted }}>
                  <span>{formatValue(cfg.min, cfg.unit)}</span>
                  <span>{formatValue(cfg.max, cfg.unit)}</span>
                </div>
                <p className="text-xs" style={{ color: C.muted }}>{cfg.description}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="pt-5 border-t space-y-4" style={{ borderColor: C.border }}>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" iconName="RotateCcw" onClick={resetToDefaults} className="flex-1">Reset</Button>
              <Button variant="secondary" size="sm" iconName="Play" onClick={() => onScenarioChange(scenario)} className="flex-1 !bg-emerald-500 !text-white hover:opacity-90">Run Simulation</Button>
            </div>

            <div className="space-y-3">
              <Input
                aria-label="Scenario name"
                type="text"
                placeholder="Enter scenario name"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                className="h-11 rounded-lg transition-colors !bg-white !text-[#0F172A] !placeholder-[#9CA3AF] !border !border-[var(--color-border,#E5E7EB)] focus:!outline-none focus-visible:!outline-none focus:!ring-2 focus:!ring-[var(--color-neon,#12F7A0)] focus:!ring-offset-2 focus:!ring-offset-white"
              />
              <Button
                variant="default"
                size="sm"
                iconName="Save"
                onClick={handleSaveScenario}
                disabled={!canSave}
                className={`w-full ${canSave ? '!bg-[var(--color-neon,#12F7A0)] !text-[#0F172A] hover:opacity-90' : '!bg-[rgba(18,247,160,0.6)] !text-[#0F172A]/60 cursor-not-allowed'} disabled:opacity-100 disabled:hover:opacity-100`}
              >
                Save Scenario
              </Button>
            </div>

            {savedScenarios.length > 0 && (
              <div className="flex items-center justify-center gap-2 text-sm" style={{ color: C.muted }}>
                <Icon name="Bookmark" size={16} />
                <span>{savedScenarios.length} saved scenario{savedScenarios.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* slider CSS */}
      <style jsx global>{`
        .sim-slider { outline: none; }
        .sim-slider::-webkit-slider-runnable-track { height: 8px; border-radius: 9999px; background: ${C.track}; }
        .sim-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none; width: 16px; height: 16px; background: ${C.thumb};
          border-radius: 9999px; border: 2px solid #fff; margin-top: -4px; box-shadow: 0 1px 2px rgba(0,0,0,.1);
        }
        .sim-slider:focus::-webkit-slider-thumb { box-shadow: 0 0 0 6px ${C.neonSoft}; }
        .sim-slider::-moz-range-track { height: 8px; border-radius: 9999px; background: ${C.track}; }
        .sim-slider::-moz-range-progress { height: 8px; border-radius: 9999px; background: var(--color-neon,#12F7A0); }
        .sim-slider::-moz-range-thumb {
          width: 16px; height:16px; border-radius:9999px; background: ${C.thumb}; border: 2px solid #fff; box-shadow: 0 1px 2px rgba(0,0,0,.1);
        }
      `}</style>
    </div>
  );
}
