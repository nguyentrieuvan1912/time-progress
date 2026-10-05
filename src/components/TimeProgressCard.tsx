import React from 'react';
import './TimeProgressCard.css';

interface TimeProgressCardProps {
  title: string;
  percentage: number;
  startTime: string;
  endTime: string;
  colorStart?: string;
  colorEnd?: string;
}

export const TimeProgressCard: React.FC<TimeProgressCardProps> = ({
  title,
  percentage,
  startTime,
  endTime,
  colorStart = '#3b82f6',
  colorEnd = '#8b5cf6'
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <span className="card-percentage">{percentage.toFixed(2)}%</span>
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
      
      <div className="card-footer">
        <span>{startTime}</span>
        <span>{endTime}</span>
      </div>
    </div>
  );
};
