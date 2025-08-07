'use client';
import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';

// Define the filter state type
export type AlertItem = {
  id: string | number;
  title: string;
  description: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'new' | 'acknowledged' | 'investigating' | 'resolved';
  timestamp: string | number | Date;
  affectedAccount: string;
  scoreImpact?: number;
  recommendedActions?: string[];
};

interface AlertCardProps {
  alert: AlertItem;
  onAcknowledge: (id: AlertItem['id']) => void;
  onInvestigate: (id: AlertItem['id']) => void;
  onResolve: (id: AlertItem['id']) => void;
}

const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onAcknowledge,
  onInvestigate,
  onResolve,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const severityConfig = {
    critical: { bgColor: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-red-800', iconColor: 'text-red-600', icon: 'AlertTriangle' },
    high:     { bgColor: 'bg-orange-50', borderColor: 'border-orange-200', textColor: 'text-orange-800', iconColor: 'text-orange-600', icon: 'AlertCircle' },
    medium:   { bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', textColor: 'text-yellow-800', iconColor: 'text-yellow-600', icon: 'Info' },
    low:      { bgColor: 'bg-blue-50',   borderColor: 'border-blue-200',   textColor: 'text-blue-800',   iconColor: 'text-blue-600',   icon: 'Bell' },
  }[alert.severity];

  const statusConfig = {
    new:           { color: 'text-blue-600',      bg: 'bg-blue-100',      label: 'New' },
    acknowledged:  { color: 'text-yellow-600',    bg: 'bg-yellow-100',    label: 'Acknowledged' },
    investigating: { color: 'text-orange-600',    bg: 'bg-orange-100',    label: 'Investigating' },
    resolved:      { color: 'text-green-600',     bg: 'bg-green-100',     label: 'Resolved' },
  }[alert.status];

  const formatTimestamp = (ts: AlertItem['timestamp']) => {
    const now = Date.now();
    const t = new Date(ts).getTime();
    const min = Math.floor((now - t) / 60000);
    return min < 60 ? `${min} min ago` : min < 1440 ? `${Math.floor(min/60)} hours ago` : `${Math.floor(min/1440)} days ago`;
  };

  return (
    <div className={`bg-card border ${severityConfig.borderColor} rounded-lg shadow-elevation-1 transition-smooth hover:shadow-elevation-2`}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className={`${severityConfig.bgColor} p-2 rounded-lg`}>
              <Icon name={severityConfig.icon} size={20} className={severityConfig.iconColor} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-sm font-semibold text-foreground truncate">{alert.title}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.color}`}>{statusConfig.label}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{alert.description}</p>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span className="flex items-center space-x-1"><Icon name="Clock" size={12} /><span>{formatTimestamp(alert.timestamp)}</span></span>
                <span className="flex items-center space-x-1"><Icon name="CreditCard" size={12} /><span>{alert.affectedAccount}</span></span>
                {alert.scoreImpact != null && <span className="flex items-center space-x-1"><Icon name="TrendingDown" size={12} /><span>{alert.scoreImpact} points</span></span>}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'} onClick={() => setIsExpanded(p=>!p)} className="text-muted-foreground hover:text-foreground ml-4" />
        </div>
      </div>
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border">
          <div className="pt-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Alert Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Type:</span><span className="ml-2 text-foreground">{alert.type}</span></div>
                <div><span className="text-muted-foreground">Severity:</span><span className={`ml-2 font-medium ${severityConfig.textColor}`}>{alert.severity.charAt(0).toUpperCase()+alert.severity.slice(1)}</span></div>
                <div><span className="text-muted-foreground">Account:</span><span className="ml-2 text-foreground">{alert.affectedAccount}</span></div>
                <div><span className="text-muted-foreground">Detection Time:</span><span className="ml-2 text-foreground">{new Date(alert.timestamp).toLocaleString()}</span></div>
              </div>
            </div>
            {alert.recommendedActions?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Recommended Actions</h4>
                <ul className="space-y-1">
                  {alert.recommendedActions.map((act,i)=>(
                    <li key={i} className="flex items-start space-x-2 text-sm text-muted-foreground"><Icon name="ArrowRight" size={14} className="mt-0.5 text-primary"/><span>{act}</span></li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex items-center space-x-2 pt-2">
              {alert.status==='new' && <Button variant="outline" size="sm" iconName="Check" onClick={()=>onAcknowledge(alert.id)}>Acknowledge</Button>}
              {(alert.status==='new' || alert.status==='acknowledged') && <Button variant="secondary" size="sm" iconName="Search" onClick={()=>onInvestigate(alert.id)}>Investigate</Button>}
              {alert.status!=='resolved'&&<Button variant="success" size="sm" iconName="CheckCircle" onClick={()=>onResolve(alert.id)}>Mark Resolved</Button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertCard;
