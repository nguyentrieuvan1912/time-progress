import React from 'react';
import type { ResolvedMilestone } from '../data/milestones';
import { formatCountdown } from '../data/milestones';
import './MilestoneCard.css';

interface MilestoneListProps {
  milestones: ResolvedMilestone[];
}

export const MilestoneList: React.FC<MilestoneListProps> = ({ milestones }) => {
  if (milestones.length === 0) return null;

  const topMilestone = milestones[0];
  const restMilestones = milestones.slice(1);

  const topCd = formatCountdown(topMilestone.timeRemaining);

  return (
    <div className="milestones-container">
      <div className="milestones-header">
        <h2 className="section-title">MỐC SẮP TỚI</h2>
      </div>

      <div className={`top-milestone card ${topMilestone.type === 'personal' ? 'is-personal' : ''}`}>
        <div className="top-milestone-icon">{topMilestone.icon}</div>
        <h3 className="top-milestone-name">{topMilestone.name}</h3>
        <div className="top-milestone-date">
          {topMilestone.date.toLocaleDateString('vi-VN')}
        </div>
        
        <div className="top-milestone-countdown">
          {topMilestone.timeRemaining > 0 ? (
            topCd.days > 0 ? (
              <span className="days-left">Còn {topCd.days} ngày</span>
            ) : (
              <span className="hours-left">
                {String(topCd.hours).padStart(2, '0')} : {String(topCd.mins).padStart(2, '0')} : {String(topCd.secs).padStart(2, '0')}
              </span>
            )
          ) : (
            <span className="days-left highlight">Hôm nay!</span>
          )}
        </div>
        
        <div className="milestone-progress-container">
          <div className="milestone-progress-bar-bg">
            <div 
              className="milestone-progress-bar-fill" 
              style={{ 
                width: topCd.days <= 0 ? '100%' : `${Math.max(5, 100 - (topCd.days / 365) * 100)}%`,
                background: topMilestone.type === 'personal' ? 'linear-gradient(90deg, #f43f5e, #fb923c)' : 'linear-gradient(90deg, #3b82f6, #8b5cf6)'
              }}
            />
          </div>
        </div>
      </div>

      <div className="rest-milestones">
        {restMilestones.map((m) => {
          const cd = formatCountdown(m.timeRemaining);
          return (
            <div key={m.id} className="small-milestone">
              <div className="sm-icon-name">
                <span className="sm-icon">{m.icon}</span>
                <div className="sm-info">
                  <span className="sm-name">{m.name}</span>
                  <span className="sm-date">{m.date.toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
              <div className="sm-countdown">
                {m.timeRemaining > 0 ? (
                  cd.days > 0 ? (
                    `Còn ${cd.days} ngày`
                  ) : (
                    `${String(cd.hours).padStart(2, '0')}:${String(cd.mins).padStart(2, '0')}:${String(cd.secs).padStart(2, '0')}`
                  )
                ) : (
                  <span className="highlight">Hôm nay!</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
