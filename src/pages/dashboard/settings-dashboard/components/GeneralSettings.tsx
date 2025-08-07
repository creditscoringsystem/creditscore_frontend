import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Icon from '@/components/AppIcon'


type ThemeOption = 'neon-dark' | 'neon-blue' | 'neon-purple'
type LayoutOption = 'grid' | 'list' | 'compact'
type TimeRangeOption = '3months' | '6months' | '1year' | '2years'
type DataVisOption = 'enhanced' | 'standard' | 'minimal'

interface SettingsState {
  theme: ThemeOption
  dashboardLayout: LayoutOption
  defaultTimeRange: TimeRangeOption
  autoRefresh: boolean
  animationsEnabled: boolean
  dataVisualization: DataVisOption
}

const GeneralSettings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
    theme: 'neon-dark',
    dashboardLayout: 'grid',
    defaultTimeRange: '6months',
    autoRefresh: true,
    animationsEnabled: true,
    dataVisualization: 'enhanced',
  })

  const handleSettingChange = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    console.log('Saving settings:', settings)
    // sau này call API save ở đây
  }

  return (
    <div className="p-6 space-y-8">
      {/* Theme Customization */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground mb-4 neon-text-glow">
          Theme Customization
        </h3>
        <div className="bg-muted/50 rounded-lg p-4 neon-border-glow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Color Theme</label>
              <Select
                value={settings.theme}
                onValueChange={(v: ThemeOption) => handleSettingChange('theme', v)}
                options={[
                  { value: 'neon-dark', label: 'Neon Dark (Current)' },
                  { value: 'neon-blue', label: 'Neon Blue' },
                  { value: 'neon-purple', label: 'Neon Purple' },
                ]}
                className="neon-border-glow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Animations</label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="animations"
                  checked={settings.animationsEnabled}
                  onChange={e => handleSettingChange('animationsEnabled', e.target.checked)}
                  className="w-4 h-4 text-primary focus:ring-primary border-border rounded"
                />
                <label htmlFor="animations" className="text-sm text-foreground">
                  Enable visual effects and animations
                </label>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dashboard Layout */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground mb-4 neon-text-glow">
          Dashboard Layout
        </h3>
        <div className="bg-muted/50 rounded-lg p-4 neon-border-glow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Layout Style</label>
              <Select
                value={settings.dashboardLayout}
                onValueChange={(v: LayoutOption) => handleSettingChange('dashboardLayout', v)}
                options={[
                  { value: 'grid', label: 'Grid Layout' },
                  { value: 'list', label: 'List Layout' },
                  { value: 'compact', label: 'Compact Layout' },
                ]}
                className="neon-border-glow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Data Visualization</label>
              <Select
                value={settings.dataVisualization}
                onValueChange={(v: DataVisOption) => handleSettingChange('dataVisualization', v)}
                options={[
                  { value: 'enhanced', label: 'Enhanced (with effects)' },
                  { value: 'standard', label: 'Standard' },
                  { value: 'minimal', label: 'Minimal' },
                ]}
                className="neon-border-glow"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Default Preferences */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground mb-4 neon-text-glow">
          Default Preferences
        </h3>
        <div className="bg-muted/50 rounded-lg p-4 neon-border-glow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Default Time Range</label>
              <Select
                value={settings.defaultTimeRange}
                onValueChange={(v: TimeRangeOption) => handleSettingChange('defaultTimeRange', v)}
                options={[
                  { value: '3months', label: '3 Months' },
                  { value: '6months', label: '6 Months' },
                  { value: '1year', label: '1 Year' },
                  { value: '2years', label: '2 Years' },
                ]}
                className="neon-border-glow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Auto Refresh</label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoRefresh"
                  checked={settings.autoRefresh}
                  onChange={e => handleSettingChange('autoRefresh', e.target.checked)}
                  className="w-4 h-4 text-primary focus:ring-primary border-border rounded"
                />
                <label htmlFor="autoRefresh" className="text-sm text-foreground">
                  Automatically refresh data every 5 minutes
                </label>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex justify-end pt-4 border-t border-border">
        <Button onClick={handleSave} className="px-6 py-3 neon-glow hover:scale-105 transition-all duration-200">
          <Icon name="Save" size={16} className="mr-2" />
          Save Preferences
        </Button>
      </motion.div>
    </div>
  )
}

export default GeneralSettings
