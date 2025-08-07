// src/pages/dashboard/what-if-scenario-simulator-dashboard/components/ResultsPanel.tsx
'use client';

import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

interface FactorImpact {
  factor: string;
  current: number;
  projected: number;
  change: number;
}

interface ScoreRange {
  min: number;
  max: number;
  target: number;
}

interface ProjectedResults {
  scoreRange: ScoreRange;
  confidenceLevel: number;
  timeToTarget: number;
  factorImpacts: FactorImpact[];
  monthlyProgress?: { month: number; score: number; confidence: number }[];
}

interface ResultsPanelProps {
  currentScenario?: any;
  projectedResults?: ProjectedResults;
  onExportResults?: (data: any) => void;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({
  currentScenario,
  projectedResults,
  onExportResults,
}) => {
  const [showDetails, setShowDetails] = useState(true);

  const results: ProjectedResults = projectedResults ?? {
    scoreRange: { min: 725, max: 775, target: 750 },
    confidenceLevel: 85,
    timeToTarget: 10,
    factorImpacts: [
      { factor: 'Payment History', current: 35, projected: 38, change: 3 },
      { factor: 'Credit Utilization', current: 25, projected: 30, change: 5 },
      { factor: 'Length of History', current: 15, projected: 16, change: 1 },
      { factor: 'Credit Mix', current: 10, projected: 10, change: 0 },
      { factor: 'New Credit', current: 10, projected: 8, change: -2 },
    ],
    monthlyProgress: [
      { month: 1, score: 730, confidence: 90 },
      { month: 3, score: 740, confidence: 88 },
      { month: 6, score: 755, confidence: 86 },
      { month: 12, score: 750, confidence: 85 },
    ],
  };

  const getScoreColor = (score: number) =>
    score >= 750 ? 'text-success' : score >= 700 ? 'text-warning' : 'text-destructive';

  const getChangeIcon = (change: number) =>
    change > 0 ? 'TrendingUp' : change < 0 ? 'TrendingDown' : 'Minus';

  const getChangeColor = (change: number) =>
    change > 0 ? 'text-success' : change < 0 ? 'text-destructive' : 'text-muted-foreground';

  const handleExport = () => {
    const exportData = {
      scenario: currentScenario,
      results,
      exportedAt: new Date().toISOString(),
    };
    onExportResults?.(exportData);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="BarChart3" size={20} className="text-success" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Projection Results</h3>
              <p className="text-sm text-muted-foreground">Expected outcomes and timeline</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Download" onClick={handleExport}>
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName={showDetails ? 'ChevronUp' : 'ChevronDown'}
              onClick={() => setShowDetails((s) => !s)}
            >
              {showDetails ? 'Less' : 'More'}
            </Button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        {/* Score Summary */}
        <div className="bg-gradient-to-r from-success/5 to-primary/5 rounded-lg p-6 text-center space-y-4">
          <div className={`text-4xl font-bold ${getScoreColor(results.scoreRange.target)}`}>
            {results.scoreRange.target}
          </div>
          <div className="text-sm text-muted-foreground">Projected Score</div>
          <div className="flex items-center justify-center space-x-6">
            <div>
              <div className="text-lg font-semibold text-foreground">
                {results.scoreRange.min} - {results.scoreRange.max}
              </div>
              <div className="text-xs text-muted-foreground">Score Range</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <div className="text-lg font-semibold text-primary">{results.confidenceLevel}%</div>
              <div className="text-xs text-muted-foreground">Confidence</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <div className="text-lg font-semibold text-warning">{results.timeToTarget} mo</div>
              <div className="text-xs text-muted-foreground">To Target</div>
            </div>
          </div>
        </div>

        {/* Factor Impact */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-semibold text-foreground">Factor Impact Analysis</h4>
            <div className="text-sm text-muted-foreground">Current vs Projected</div>
          </div>
          <div className="space-y-3">
            {results.factorImpacts.map((f, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name={getChangeIcon(f.change)} size={16} className={getChangeColor(f.change)} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{f.factor}</div>
                    <div className="text-xs text-muted-foreground">
                      {f.current}% → {f.projected}%
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${getChangeColor(f.change)}`}>
                    {f.change > 0 ? '+' : ''}{f.change}%
                  </div>
                  <div className="text-xs text-muted-foreground">Impact</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Progress */}
        {showDetails && results.monthlyProgress && (
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-foreground">Progress Timeline</h4>
            <div className="space-y-3">
              {results.monthlyProgress.map((m) => (
                <div key={m.month} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-semibold">
                      {m.month}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">Month {m.month}</div>
                      <div className="text-xs text-muted-foreground">{m.confidence}% confidence</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getScoreColor(m.score)}`}>{m.score}</div>
                    <div className="text-xs text-muted-foreground">+{m.score - 720} pts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Insights */}
        <div className="bg-primary/5 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Lightbulb" size={20} className="text-primary mt-0.5" />
            <div>
              <h5 className="text-sm font-semibold text-foreground mb-2">Key Insights</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Reducing utilization by 15% has highest impact</li>
                <li>• Additional $250/month payment accelerates improvement</li>
                <li>• Target score of 750+ achievable in {results.timeToTarget} months</li>
                <li>• Avoid opening new accounts during this period</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <h4 className="text-base font-semibold text-foreground">Recommended Actions</h4>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center space-x-3 p-3 bg-success/5 border border-success/20 rounded-lg">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm text-foreground">Pay down high-utilization cards first</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-warning/5 border border-warning/20 rounded-lg">
              <Icon name="AlertTriangle" size={16} className="text-warning" />
              <span className="text-sm text-foreground">Set up automatic payments to avoid late fees</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <Icon name="Info" size={16} className="text-primary" />
              <span className="text-sm text-foreground">Monitor progress monthly for best results</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;
