'use client';

import React, { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

interface SpeedOption {
  value: number;
  label: string;
  description: string;
}

interface TimeframeOption {
  value: number;
  label: string;
  description: string;
}

interface TimelineSliderProps {
  selectedTimeframe: number;
  onTimeframeChange: (tf: number) => void;
  onPlayAnimation?: (playing: boolean) => void;
}

export default function TimelineSlider({
  selectedTimeframe,
  onTimeframeChange,
  onPlayAnimation
}: TimelineSliderProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const timeframeOptions: TimeframeOption[] = [
    { value: 6,  label: '6 Months',  description: 'Short-term impact' },
    { value: 12, label: '1 Year',    description: 'Standard projection' },
    { value: 18, label: '18 Months', description: 'Medium-term goals' },
    { value: 24, label: '2 Years',   description: 'Long-term planning' },
    { value: 36, label: '3 Years',   description: 'Extended timeline' }
  ];

  const speedOptions: SpeedOption[] = [
    { value: 0.5, label: '0.5x', description: 'Slow' },
    { value: 1,   label: '1x',   description: 'Normal' },
    { value: 2,   label: '2x',   description: 'Fast' },
    { value: 4,   label: '4x',   description: 'Very Fast' }
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && currentMonth < selectedTimeframe) {
      interval = setInterval(() => {
        setCurrentMonth(prev => {
          const next = prev + 1;
          if (next >= selectedTimeframe) {
            setIsPlaying(false);
            onPlayAnimation?.(false);
            return selectedTimeframe;
          }
          return next;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentMonth, selectedTimeframe, playbackSpeed, onPlayAnimation]);

  const handlePlay = (e: MouseEvent<HTMLButtonElement>) => {
    let playing = !isPlaying;
    if (currentMonth >= selectedTimeframe) {
      setCurrentMonth(0);
      playing = true;
    }
    setIsPlaying(playing);
    onPlayAnimation?.(playing);
  };

  const handleReset = (e: MouseEvent<HTMLButtonElement>) => {
    setIsPlaying(false);
    setCurrentMonth(0);
    onPlayAnimation?.(false);
  };

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setCurrentMonth(val);
    setIsPlaying(false);
    onPlayAnimation?.(false);
  };

  const formatMonth = (month: number) => {
    if (month === 0) return 'Now';
    return `${month} mo`;
  };

  const getProgressPercentage = () =>
    (currentMonth / selectedTimeframe) * 100;

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={20} className="text-warning" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Timeline Explorer</h3>
              <p className="text-sm text-muted-foreground">Explore score progression over time</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Timeframe:</span>
            <select
              value={selectedTimeframe}
              onChange={(e) => onTimeframeChange(parseInt(e.target.value, 10))}
              className="text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground"
            >
              {timeframeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Current Position */}
        <div className="text-center space-y-2">
          <div className="text-3xl font-bold text-primary">{formatMonth(currentMonth)}</div>
          <div className="text-sm text-muted-foreground">
            {currentMonth === 0
              ? 'Starting Point'
              : `${currentMonth} month${currentMonth !== 1 ? 's' : ''} into simulation`}
          </div>
        </div>

        {/* Slider */}
        <div className="space-y-4">
          <input
            type="range"
            min={0}
            max={selectedTimeframe}
            step={1}
            value={currentMonth}
            onChange={handleSliderChange}
            className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer timeline-slider"
            style={{
              background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${getProgressPercentage()}%, var(--color-muted) ${getProgressPercentage()}%, var(--color-muted) 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Now</span>
            <span>{Math.floor(selectedTimeframe * 0.25)} mo</span>
            <span>{Math.floor(selectedTimeframe * 0.5)} mo</span>
            <span>{Math.floor((selectedTimeframe * 3) / 4)} mo</span>
            <span>{selectedTimeframe} mo</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="h-2 bg-gradient-to-r from-primary to-success rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            iconName="SkipBack"
            onClick={handleReset}
            disabled={currentMonth === 0}
          >Reset</Button>
          <Button
            variant="default"
            size="sm"
            iconName={isPlaying ? 'Pause' : 'Play'}
            onClick={handlePlay}
            disabled={currentMonth >= selectedTimeframe && !isPlaying}
          >{isPlaying ? 'Pause' : currentMonth >= selectedTimeframe ? 'Replay' : 'Play'}</Button>
          <Button
            variant="outline"
            size="sm"
            iconName="SkipForward"
            onClick={() => setCurrentMonth(selectedTimeframe)}
            disabled={currentMonth >= selectedTimeframe}
          >End</Button>
        </div>

        {/* Speed */}
        <div className="flex items-center justify-center space-x-4">
          <span className="text-sm text-muted-foreground">Speed:</span>
          <div className="flex items-center space-x-2">
            {speedOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setPlaybackSpeed(opt.value)}
                className={`px-3 py-1 text-xs rounded-lg transition-smooth ${
                  playbackSpeed === opt.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Key Milestones</h4>
          <div className="space-y-2">
            {[
              { month: Math.floor(selectedTimeframe * 0.25), event: 'First noticeable improvement', icon: 'TrendingUp' },
              { month: Math.floor(selectedTimeframe * 0.5),  event: 'Significant score increase', icon: 'Target' },
              { month: Math.floor(selectedTimeframe * 0.75), event: 'Approaching target score', icon: 'Award' },
              { month: selectedTimeframe,                 event: 'Goal achievement', icon: 'CheckCircle' }
            ].map((ms, idx) => (
              <div
                key={idx}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-smooth ${
                  currentMonth >= ms.month ? 'bg-success/10 border border-success/20' : 'bg-muted/30'
                }`}
              >
                <Icon
                  name={ms.icon}
                  size={16}
                  className={currentMonth >= ms.month ? 'text-success' : 'text-muted-foreground'}
                />
                <div className="flex-1">
                  <span className="text-sm text-foreground">{ms.event}</span>
                  <div className="text-xs text-muted-foreground">Month {ms.month}</div>
                </div>
                {currentMonth >= ms.month && <Icon name="Check" size={16} className="text-success" />}
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        {currentMonth > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} className="text-primary mt-0.5" />
              <div>
                <h5 className="text-sm font-semibold text-foreground mb-2">Month {currentMonth} Insights</h5>
                <p className="text-sm text-muted-foreground">
                  {currentMonth <= selectedTimeframe * 0.25 && 'Early improvements from payment history optimization are beginning to show.'}
                  {currentMonth > selectedTimeframe * 0.25 && currentMonth <= selectedTimeframe * 0.5 && 'Credit utilization improvements are significantly impacting your score.'}
                  {currentMonth > selectedTimeframe * 0.5 && currentMonth <= selectedTimeframe * 0.75 && 'Consistent payment patterns are building strong credit momentum.'}
                  {currentMonth > selectedTimeframe * 0.75 && 'You\'re approaching your target score with sustained improvement.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
