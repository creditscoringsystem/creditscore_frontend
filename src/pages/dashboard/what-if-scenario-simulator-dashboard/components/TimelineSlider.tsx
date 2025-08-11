'use client';

import React, {
  useEffect,
  useRef,
  useState,
  ChangeEvent,
  MouseEvent,
  KeyboardEvent,
} from 'react';
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

/* ===== Palette (đồng bộ) ===== */
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

const TIMEFRAMES: TimeframeOption[] = [
  { value: 6, label: '6 Months', description: 'Short-term impact' },
  { value: 12, label: '1 Year', description: 'Standard projection' },
  { value: 18, label: '18 Months', description: 'Medium-term goals' },
  { value: 24, label: '2 Years', description: 'Long-term planning' },
  { value: 36, label: '3 Years', description: 'Extended timeline' },
];

const SPEEDS: SpeedOption[] = [
  { value: 0.5, label: '0.5x', description: 'Slow' },
  { value: 1, label: '1x', description: 'Normal' },
  { value: 2, label: '2x', description: 'Fast' },
  { value: 4, label: '4x', description: 'Very Fast' },
];

export default function TimelineSlider({
  selectedTimeframe,
  onTimeframeChange,
  onPlayAnimation,
}: TimelineSliderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // --- Dropdown state
  const [openTf, setOpenTf] = useState(false);
  const [kbdIndex, setKbdIndex] = useState<number>(() =>
    Math.max(0, TIMEFRAMES.findIndex(t => t.value === selectedTimeframe))
  );
  const tfButtonRef = useRef<HTMLButtonElement | null>(null);
  const tfMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // đóng menu khi click ra ngoài
    const handler = (e: MouseEvent | globalThis.MouseEvent) => {
      if (!openTf) return;
      const target = e.target as Node;
      if (
        tfButtonRef.current &&
        tfMenuRef.current &&
        !tfButtonRef.current.contains(target) &&
        !tfMenuRef.current.contains(target)
      ) {
        setOpenTf(false);
      }
    };
    window.addEventListener('click', handler as any);
    return () => window.removeEventListener('click', handler as any);
  }, [openTf]);

  useEffect(() => {
    // đồng bộ index khi selectedTimeframe đổi từ ngoài
    const idx = TIMEFRAMES.findIndex(t => t.value === selectedTimeframe);
    if (idx >= 0) setKbdIndex(idx);
  }, [selectedTimeframe]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
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
    return () => interval && clearInterval(interval);
  }, [isPlaying, currentMonth, selectedTimeframe, playbackSpeed, onPlayAnimation]);

  const handlePlay = () => {
    let playing = !isPlaying;
    if (currentMonth >= selectedTimeframe) {
      setCurrentMonth(0);
      playing = true;
    }
    setIsPlaying(playing);
    onPlayAnimation?.(playing);
  };

  const handleReset = () => {
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

  const onTfKeyDown = (e: KeyboardEvent<HTMLButtonElement | HTMLDivElement>) => {
    if (!openTf) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        setOpenTf(true);
        e.preventDefault();
      }
      return;
    }
    if (e.key === 'Escape') {
      setOpenTf(false);
      tfButtonRef.current?.focus();
    } else if (e.key === 'ArrowDown') {
      setKbdIndex(i => Math.min(TIMEFRAMES.length - 1, i + 1));
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setKbdIndex(i => Math.max(0, i - 1));
      e.preventDefault();
    } else if (e.key === 'Enter') {
      const tf = TIMEFRAMES[kbdIndex];
      onTimeframeChange(tf.value);
      setOpenTf(false);
      tfButtonRef.current?.focus();
      e.preventDefault();
    }
  };

  const formatMonth = (m: number) => (m === 0 ? 'Now' : `${m} mo`);
  const progressPct = (currentMonth / selectedTimeframe) * 100;

  return (
    <div
      className="rounded-2xl border"
      style={{ background: C.card, borderColor: C.border, boxShadow: C.shadow }}
    >
      {/* Header */}
      <div className="px-6 py-5 border-b" style={{ borderColor: C.border }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: C.neonSoft }}
            >
              <Icon name="Clock" size={20} style={{ color: C.neon }} />
            </div>
            <div>
              <h3 className="text-[18px] font-semibold" style={{ color: C.fg }}>
                Timeline <span className="block md:inline">Explorer</span>
              </h3>
              <p className="text-[12px]" style={{ color: C.muted }}>
                Explore score progression over time
              </p>
            </div>
          </div>

          {/* Timeframe dropdown */}
          <div className="relative">
            <div className="text-[12px] mb-1 text-right" style={{ color: C.muted }}>
              Timeframe:
            </div>
            <button
              ref={tfButtonRef}
              onClick={() => setOpenTf(o => !o)}
              onKeyDown={onTfKeyDown}
              aria-haspopup="listbox"
              aria-expanded={openTf}
              className="flex items-center justify-between w-36 px-3 py-2 rounded-lg border bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-emerald-300"
              style={{ borderColor: C.border, color: C.fg }}
            >
              {TIMEFRAMES.find(t => t.value === selectedTimeframe)?.label ?? 'Select'}
              <Icon name="ChevronDown" size={16} className="ml-2 text-muted-foreground" />
            </button>

            {openTf && (
              <div
                ref={tfMenuRef}
                role="listbox"
                tabIndex={-1}
                onKeyDown={onTfKeyDown}
                className="absolute z-20 mt-2 w-56 rounded-lg border bg-white shadow-xl overflow-hidden"
                style={{ borderColor: C.border }}
              >
                {TIMEFRAMES.map((opt, i) => {
                  const active = selectedTimeframe === opt.value;
                  const focused = kbdIndex === i;
                  return (
                    <div
                      key={opt.value}
                      role="option"
                      aria-selected={active}
                      className={`px-3 py-2.5 text-[14px] cursor-pointer flex items-center justify-between ${
                        focused ? 'bg-emerald-50' : 'bg-white'
                      } ${active ? 'font-medium' : ''} hover:bg-emerald-50`}
                      onMouseEnter={() => setKbdIndex(i)}
                      onClick={() => {
                        onTimeframeChange(opt.value);
                        setOpenTf(false);
                        tfButtonRef.current?.focus();
                      }}
                    >
                      <div className="min-w-0">
                        <div className="truncate" style={{ color: C.fg }}>
                          {opt.label}
                        </div>
                        <div className="text-[11px]" style={{ color: C.muted }}>
                          {opt.description}
                        </div>
                      </div>
                      {active && <Icon name="Check" size={16} className="text-emerald-600 ml-3" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        {/* Current */}
        <div className="text-center space-y-1">
          <div className="font-bold tabular-nums text-emerald-500" style={{ fontSize: 36, lineHeight: '40px' }}>
            {formatMonth(currentMonth)}
          </div>
          <div className="text-[12px]" style={{ color: C.muted }}>
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
            className="w-full h-2 rounded-full appearance-none timeline-slider"
            style={{
              background: `linear-gradient(to right, ${C.neon} 0%, ${C.neon} ${progressPct}%, ${C.track} ${progressPct}%, ${C.track} 100%)`,
            }}
            aria-label="Timeline"
          />
          <div className="flex justify-between text-[12px] tabular-nums" style={{ color: C.muted }}>
            <span>Now</span>
            <span>{Math.floor(selectedTimeframe * 0.25)} mo</span>
            <span>{Math.floor(selectedTimeframe * 0.5)} mo</span>
            <span>{Math.floor((selectedTimeframe * 3) / 4)} mo</span>
            <span>{selectedTimeframe} mo</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${progressPct}%`,
                background: `linear-gradient(90deg, var(--color-primary,#10B981), #34D399)`,
              }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            iconName="SkipBack"
            onClick={handleReset}
            disabled={currentMonth === 0}
          >
            Reset
          </Button>
          <Button
            variant="default"
            size="sm"
            iconName={isPlaying ? 'Pause' : 'Play'}
            onClick={handlePlay}
            disabled={currentMonth >= selectedTimeframe && !isPlaying}
          >
            {isPlaying ? 'Pause' : currentMonth >= selectedTimeframe ? 'Replay' : 'Play'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="SkipForward"
            onClick={() => setCurrentMonth(selectedTimeframe)}
            disabled={currentMonth >= selectedTimeframe}
          >
            End
          </Button>
        </div>

        {/* Speed chips */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-[12px]" style={{ color: C.muted }}>
            Speed:
          </span>
          <div className="flex items-center gap-2">
            {SPEEDS.map(opt => {
              const active = playbackSpeed === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setPlaybackSpeed(opt.value)}
                  className={`px-3 py-1.5 rounded-full text-[12px] border transition-colors ${
                    active
                      ? 'bg-[var(--color-primary,#10B981)] text-white border-[var(--color-primary,#10B981)]'
                      : 'bg-white text-[var(--color-foreground,#0F172A)] border-[color:var(--color-border,#E5E7EB)] hover:bg-slate-50'
                  }`}
                  title={opt.description}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Milestones */}
        <div className="space-y-3">
          <h4 className="text-[13px] font-semibold" style={{ color: C.fg }}>
            Key Milestones
          </h4>
          <div className="space-y-2">
            {[
              { month: Math.floor(selectedTimeframe * 0.25), event: 'First noticeable improvement', icon: 'TrendingUp' },
              { month: Math.floor(selectedTimeframe * 0.5), event: 'Significant score increase', icon: 'Target' },
              { month: Math.floor(selectedTimeframe * 0.75), event: 'Approaching target score', icon: 'Award' },
              { month: selectedTimeframe, event: 'Goal achievement', icon: 'CheckCircle' },
            ].map((ms, idx) => {
              const reached = currentMonth >= ms.month;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${
                    reached ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-[color:var(--color-border,#E5E7EB)]'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${reached ? 'bg-emerald-100' : 'bg-white'}`}>
                    <Icon name={ms.icon} size={16} className={reached ? 'text-emerald-600' : 'text-muted-foreground'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] truncate" style={{ color: C.fg }}>
                      {ms.event}
                    </div>
                    <div className="text-[11px] tabular-nums" style={{ color: C.muted }}>
                      Month {ms.month}
                    </div>
                  </div>
                  {reached && <Icon name="Check" size={16} className="text-emerald-600" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Slider styles */}
      <style jsx global>{`
        .timeline-slider {
          outline: none;
        }
        .timeline-slider::-webkit-slider-runnable-track {
          height: 8px;
          border-radius: 9999px;
          background: ${C.track};
        }
        .timeline-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: ${C.thumb};
          border-radius: 9999px;
          border: 2px solid #fff;
          margin-top: -4px;
          box-shadow: 0 1px 2px rgba(0,0,0,.1);
        }
        .timeline-slider:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 6px ${C.neonSoft};
        }
        /* Firefox */
        .timeline-slider::-moz-range-track {
          height: 8px;
          border-radius: 9999px;
          background: ${C.track};
        }
        .timeline-slider::-moz-range-progress {
          height: 8px;
          border-radius: 9999px;
          background: ${C.neon};
        }
        .timeline-slider::-moz-range-thumb {
          width: 16px; height:16px; border-radius:9999px;
          background: ${C.thumb}; border: 2px solid #fff;
          box-shadow: 0 1px 2px rgba(0,0,0,.1);
        }
      `}</style>
    </div>
  );
}
