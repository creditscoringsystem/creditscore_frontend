'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import Select from '@/components/ui/Select';

interface PreferenceItem {
  id: string;
  name: string;
  enabled: boolean;
  score_change?: number;    // now optional
  description?: string;
}

interface NotificationPreferencesProps {
  preferences: PreferenceItem[];
  onSave: (prefs: PreferenceItem[]) => void;
}

export default function NotificationPreferences({
  preferences: initialPrefs = [],
  onSave,
}: NotificationPreferencesProps) {
  const [prefs, setPrefs] = useState<PreferenceItem[]>(
    initialPrefs.map(p => ({
      ...p,
      enabled: !!p.enabled,
      score_change: p.score_change ?? 0,    // default to 0
      description: p.description ?? '',
    }))
  );
  const [frequency, setFrequency] = useState<string>('daily');

  const handleToggle = (id: string, checked: boolean) => {
    setPrefs(ps =>
      ps.map(p => (p.id === id ? { ...p, enabled: checked } : p))
    );
  };

  const handleFrequencyChange = (val: string) => {
    setFrequency(val);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(prefs);
  };

  const freqOptions = [
    { value: 'instant', label: 'Instant' },
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Notification Preferences
      </h3>

      <div className="space-y-4">
        {prefs.map(pref => (
          <div key={pref.id} className="flex items-center justify-between">
            <div>
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={pref.enabled}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleToggle(pref.id, e.target.checked)
                  }
                />
                <span className="font-medium text-foreground">{pref.name}</span>
              </label>
              {pref.description && (
                <p className="text-sm text-muted-foreground ml-6">
                  {pref.description}
                </p>
              )}
            </div>
            <span 
              className="text-sm font-semibold"
              title={`Expected score change: ${pref.score_change ?? 0} pts`}
            >
              {`${pref.score_change ?? 0} pts`}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-sm text-muted-foreground">Send me:</span>
        <Select
          options={freqOptions}
          value={frequency}
          onChange={handleFrequencyChange}
          className="w-40"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Save Preferences
        </Button>
      </div>
    </form>
  );
}
