import React from 'react';
import './TimeProgressCard.css';

interface TimeProgressCardProps {
  title: string;
  percentage: number;
  colorStart?: string;
  colorEnd?: string;
  compact?: boolean;
}

export const TimeProgressCard: React.FC<TimeProgressCardProps> = ({
  title,
  percentage,
  colorStart = '#3b82f6',
  colorEnd = '#8b5cf6',
  compact = false
}) => {
  const wholeProgress = Math.floor(percentage * 100) / 100;
  const remainder = percentage - wholeProgress;
  const microProgress = Math.min(100, Math.max(0, (remainder / 0.01) * 100));

  return (
    <div className={`card ${compact ? 'compact' : ''}`}>
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <div className="card-right">
          <span className="card-percentage">{wholeProgress.toFixed(2)}%</span>
          <div 
            className="micro-indicator"
            style={{ 
              '--micro': `${microProgress}%`,
              '--indicator-color': colorStart
            } as React.CSSProperties}
          />
        </div>
      </div>
      <div className="progress-container">
        <div 
          className="progress-bar-bg"
          role="progressbar"
          aria-valuenow={Math.round(percentage * 100) / 100}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div 
            className="progress-bar-fill" 
            style={{ 
              width: `${percentage}%`,
              background: `linear-gradient(90deg, ${colorStart}, ${colorEnd})`,
              boxShadow: `0 0 10px ${colorStart}80`
            }}
          />
        </div>
      </div>
    </div>
  );
};
