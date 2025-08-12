// src/pages/dashboard/settings-dashboard/components/DataExportSettings.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';

interface ExportOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  size: string;
  lastExported: string;
}

type ProgressMap = Record<string, number | null>;

export default function DataExportSettings() {
  const [exportProgress, setExportProgress] = useState<ProgressMap>({});
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'csv' | 'json' | 'xlsx'>('pdf');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'3months' | '6months' | '1year' | 'all'>('1year');

  const exportOptions: ExportOption[] = [
    { id: 'credit-report',    title: 'Credit Report',     description: 'Complete credit report with scores and factors',    icon: 'FileText',   size: '2.4 MB', lastExported: '2 weeks ago' },
    { id: 'score-history',    title: 'Score History',     description: 'Historical credit score data and trends',           icon: 'TrendingUp', size: '856 KB', lastExported: '1 month ago' },
    { id: 'analytics-data',   title: 'Analytics Data',    description: 'Detailed analytics and performance metrics',        icon: 'BarChart',   size: '3.1 MB', lastExported: 'Never' },
    { id: 'account-activity', title: 'Account Activity',  description: 'Login history and account changes',                icon: 'Activity',   size: '245 KB', lastExported: '3 days ago' },
  ];

  const handleExport = (exportId: string) => {
    setExportProgress(prev => ({ ...prev, [exportId]: 0 }));
    const interval = setInterval(() => {
      setExportProgress(prev => {
        const current = prev[exportId] ?? 0;
        if (current >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setExportProgress(prev => ({ ...prev, [exportId]: null }));
          }, 2000);
          return prev;
        }
        return { ...prev, [exportId]: current + 10 };
      });
    }, 300);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Export Configuration */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground mb-4 neon-text-glow">
          Export Configuration
        </h3>
        <div className="bg-muted/50 rounded-lg p-4 neon-border-glow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Export Format
              </label>
              <Select
                value={selectedFormat}
                onChange={(v) => setSelectedFormat(v as 'pdf' | 'csv' | 'json' | 'xlsx')}
                options={[
                  { value: 'pdf',  label: 'PDF Document' },
                  { value: 'csv',  label: 'CSV Spreadsheet' },
                  { value: 'json', label: 'JSON Data' },
                  { value: 'xlsx', label: 'Excel Workbook' },
                ]}
                className="neon-border-glow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Time Range
              </label>
              <Select
                value={selectedTimeRange}
                onChange={(v) => setSelectedTimeRange(v as '3months' | '6months' | '1year' | 'all')}
                options={[
                  { value: '3months', label: 'Last 3 Months' },
                  { value: '6months', label: 'Last 6 Months' },
                  { value: '1year',   label: 'Last Year' },
                  { value: 'all',     label: 'All Time' },
                ]}
                className="neon-border-glow"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Data Export Options */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground mb-4 neon-text-glow">
          Available Data Exports
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {exportOptions.map((opt, idx) => (
            <motion.div
              key={opt.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-muted/50 rounded-lg p-4 neon-border-glow hover-lift"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center neon-border-glow">
                    <Icon name={opt.icon} size={24} className="text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{opt.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{opt.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>Size: {opt.size}</span>
                    <span>Last: {opt.lastExported}</span>
                  </div>
                  {exportProgress[opt.id] !== undefined ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-primary">Exporting...</span>
                        <span className="text-primary">{exportProgress[opt.id]}%</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-2">
                        <motion.div
                          className="bg-primary h-2 rounded-full neon-glow"
                          initial={{ width: 0 }}
                          animate={{ width: `${exportProgress[opt.id]}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      {exportProgress[opt.id] === 100 && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center space-x-2 text-sm text-success">
                          <Icon name="CheckCircle" size={16} />
                          <span>Export completed successfully!</span>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport(opt.id)}
                      className="w-full neon-border-glow hover:neon-glow"
                    >
                      <Icon name="Download" size={16} className="mr-2" />
                      Export Data
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scheduled Exports */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground mb-4 neon-text-glow">
          Scheduled Exports
        </h3>
        <div className="bg-muted/50 rounded-lg p-4 neon-border-glow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-medium text-foreground">Monthly Credit Report</div>
              <div className="text-sm text-muted-foreground">
                Automatically export your credit report on the 1st of each month
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-muted peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer-checked:bg-primary peer-checked:neon-glow after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            </label>
          </div>
          <Button variant="outline" size="sm" className="neon-border-glow">
            <Icon name="Plus" size={16} className="mr-2" />
            Schedule New Export
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
