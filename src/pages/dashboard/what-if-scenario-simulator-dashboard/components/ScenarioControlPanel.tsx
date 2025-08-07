'use client';

import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

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

export default function ScenarioControlPanel({
  currentScenario,
  savedScenarios,
  onScenarioChange,
  onSaveScenario
}: ScenarioControlPanelProps) {
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
  const changeTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (currentScenario) {
      setScenario(currentScenario);
    }
  }, [currentScenario]);

  useEffect(() => {
    return () => {
      if (changeTimeout.current) clearTimeout(changeTimeout.current);
    };
  }, []);

  const handleParameterChange = (parameter: keyof Scenario, value: string) => {
    const numeric = parseFloat(value) || 0;
    const updated = { ...scenario, [parameter]: numeric };
    setScenario(updated);
    if (changeTimeout.current) clearTimeout(changeTimeout.current);
    changeTimeout.current = setTimeout(() => {
      onScenarioChange(updated);
    }, 300);
  };

  const handleSaveScenario = () => {
    if (scenarioName.trim()) {
      const toSave: Scenario = {
        ...scenario,
        name: scenarioName.trim(),
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      onSaveScenario(toSave);
      setScenarioName('');
    }
  };

  const resetToDefaults = () => {
    setScenario(defaultScenario);
    onScenarioChange(defaultScenario);
  };

  const parameterConfigs = [
    { key: 'paymentAmount',    label: 'Monthly Payment',        min: 0,    max: 2000, step: 25,  unit: '$', description: 'Additional monthly payment towards debt' },
    { key: 'utilizationChange', label: 'Utilization Change',      min: -50,  max: 50,   step: 5,   unit: '%', description: 'Change in credit utilization ratio' },
    { key: 'newAccounts',      label: 'New Accounts',            min: 0,    max: 5,    step: 1,   unit: '',  description: 'Number of new credit accounts to open' },
    { key: 'payoffTimeline',   label: 'Payoff Timeline',         min: 3,    max: 60,   step: 3,   unit: ' months', description: 'Timeline to pay off existing debt' },
    { key: 'creditLimit',      label: 'Credit Limit Increase',   min: 0,    max: 20000, step: 500, unit: '$', description: 'Requested credit limit increase' },
    { key: 'accountAge',       label: 'Account Age',             min: 6,    max: 120,  step: 6,   unit: ' months', description: 'Average age of credit accounts' }
  ] as const;

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Settings" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Scenario Controls</h3>
              <p className="text-sm text-muted-foreground">Adjust parameters to simulate changes</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Parameter Controls */}
          <div className="space-y-6">
            {parameterConfigs.map(config => (
              <div key={config.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">{config.label}</label>
                  <span className="text-sm font-semibold text-primary">
                    {config.unit === '$' ? '$' : ''}{scenario[config.key]}{config.unit !== '$' ? config.unit : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min={config.min}
                  max={config.max}
                  step={config.step}
                  value={scenario[config.key]}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleParameterChange(config.key, e.target.value)}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${((scenario[config.key] - config.min) / (config.max - config.min)) * 100}%, var(--color-muted) ${( (scenario[config.key] - config.min) / (config.max - config.min)) * 100}% , var(--color-muted) 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{config.unit === '$' ? '$' : ''}{config.min}{config.unit !== '$' ? config.unit : ''}</span>
                  <span>{config.unit === '$' ? '$' : ''}{config.max}{config.unit !== '$' ? config.unit : ''}</span>
                </div>
                <p className="text-xs text-muted-foreground">{config.description}</p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-border space-y-4">
            <div className="flex space-x-3">
              <Button variant="outline" size="sm" iconName="RotateCcw" onClick={resetToDefaults} className="flex-1">
                Reset
              </Button>
              <Button variant="secondary" size="sm" iconName="Play" onClick={() => onScenarioChange(scenario)} className="flex-1">
                Run Simulation
              </Button>
            </div>
            {/* Save Scenario */}
            <div className="space-y-3">
              <Input
                type="text"
                placeholder="Enter scenario name"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                className="text-sm"
              />
              <Button
                variant="default"
                size="sm"
                iconName="Save"
                onClick={handleSaveScenario}
                disabled={!scenarioName.trim()}
                className="w-full"
              >
                Save Scenario
              </Button>
            </div>
            {/* Saved Scenarios Count */}
            {savedScenarios.length > 0 && (
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Bookmark" size={16} />
                <span>{savedScenarios.length} saved scenario{savedScenarios.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
