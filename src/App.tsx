import { useState, useEffect, useRef, useMemo } from 'react';
import './App.css';
import { TimeProgressCard } from './components/TimeProgressCard';
import { MilestoneList } from './components/MilestoneCard';
import { getNextMilestones } from './data/milestones';
import { getDailyQuote } from './data/dailyQuotes';
import {
  getWorkdayProgress,
  getDayProgress,
  getWeekProgress,
  getMonthProgress,
  getYearProgress,
  getLifeProgress
} from './utils/timeProgress';
//hello
function App() {
  const [now, setNow] = useState(new Date());
  const [isMiniMode, setIsMiniMode] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const prevWorkProgress = useRef<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    // Return HH:MM:SS with ms subtlely if needed, but let's just do HH:MM:SS
    return date.toLocaleTimeString('vi-VN', { hour12: false });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getGreeting = (date: Date) => {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return "Chào buổi sáng";
    if (hour >= 12 && hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  const workday = getWorkdayProgress(now);
  const day = getDayProgress(now);
  const week = getWeekProgress(now);
  const month = getMonthProgress(now);
  const year = getYearProgress(now);
  const life = getLifeProgress(now);

  const upcomingMilestones = getNextMilestones(now);
  const dailyQuote = getDailyQuote(now);

  useEffect(() => {
    if (prevWorkProgress.current !== null) {
      if (prevWorkProgress.current < 100 && workday.percentage === 100) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 4000);
      }
    }
    prevWorkProgress.current = workday.percentage;
  }, [workday.percentage]);

  const celebrationParticles = useMemo(() => {
    if (!showCelebration) return null;
    return Array.from({ length: 50 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 250;
      const tx = `${Math.cos(angle) * distance}px`;
      const ty = `${Math.sin(angle) * distance}px`;
      const colors = ['#f472b6', '#60a5fa', '#34d399', '#fbbf24', '#c084fc', '#e11d48'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      return (
        <div 
          key={i} 
          className="burst-particle"
          style={{
            '--tx': tx,
            '--ty': ty,
            backgroundColor: color,
            animationDelay: `${Math.random() * 0.2}s`
          } as React.CSSProperties}
        />
      );
    });
  }, [showCelebration]);

  return (
    <div className={`app-container ${isMiniMode ? 'mini-mode' : ''}`}>
      {showCelebration && (
        <div className="celebration-overlay">
          {celebrationParticles}
        </div>
      )}
      <header className="header">
        {!isMiniMode && <div className="greeting fade-in">{getGreeting(now)}</div>}
        <div className="clock-container">
          <div className="clock">{formatTime(now)}</div>
        </div>
        <div className="date-info">
          {!isMiniMode && formatDate(now)}
          <button 
            className="mode-toggle"
            onClick={() => setIsMiniMode(!isMiniMode)}
            title="Toggle Mini Mode"
          >
            {isMiniMode ? '⤢ Normal' : '⤡ Mini'}
          </button>
        </div>
      </header>

      {!isMiniMode && (
        <section className="quote-section fade-in">
          <h4 className="quote-title">💭 THÔNG ĐIỆP HÔM NAY</h4>
          <p className="quote-content">"{dailyQuote}"</p>
        </section>
      )}

      <main className="dashboard-grid">
        <div className="time-cards">
        <TimeProgressCard
          title="WORK"
          percentage={workday.percentage}
          colorStart="#10b981"
          colorEnd="#34d399"
          compact={isMiniMode}
        />
        
        <TimeProgressCard
          title="DAY"
          percentage={day.percentage}
          colorStart="#3b82f6"
          colorEnd="#60a5fa"
          compact={isMiniMode}
        />
        
        <TimeProgressCard
          title="WEEK"
          percentage={week.percentage}
          colorStart="#8b5cf6"
          colorEnd="#c084fc"
          compact={isMiniMode}
        />
        
        <TimeProgressCard
          title="MONTH"
          percentage={month.percentage}
          colorStart="#ec4899"
          colorEnd="#f472b6"
          compact={isMiniMode}
        />
        
        <TimeProgressCard
          title="YEAR"
          percentage={year.percentage}
          colorStart="#f59e0b"
          colorEnd="#fbbf24"
          compact={isMiniMode}
        />
        
        <TimeProgressCard
          title="LIFE"
          percentage={life.percentage}
          colorStart="#e11d48"
          colorEnd="#fb7185"
          compact={isMiniMode}
        />
        </div>
        {!isMiniMode && (
          <div className="side-panel">
            <MilestoneList milestones={upcomingMilestones} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
