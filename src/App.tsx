import { useState, useEffect } from 'react';
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
  getYearProgress
} from './utils/timeProgress';

function App() {
  const [now, setNow] = useState(new Date());

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

  const upcomingMilestones = getNextMilestones(now);
  const dailyQuote = getDailyQuote(now);

  return (
    <div className="app-container">
      <header className="header">
        <div className="greeting fade-in">{getGreeting(now)}</div>
        <div className="clock-container">
          <div className="clock">{formatTime(now)}</div>
        </div>
        <div className="date-info">{formatDate(now)}</div>
      </header>

      <section className="quote-section fade-in">
        <h4 className="quote-title">💭 THÔNG ĐIỆP HÔM NAY</h4>
        <p className="quote-content">"{dailyQuote}"</p>
      </section>

      <main className="dashboard-grid">
        <div className="time-cards">
        <TimeProgressCard
          title="Thời gian làm việc"
          percentage={workday.percentage}
          startTime={workday.startTimeLabel}
          endTime={workday.endTimeLabel}
          colorStart="#10b981"
          colorEnd="#34d399"
        />
        
        <TimeProgressCard
          title="Một ngày"
          percentage={day.percentage}
          startTime={day.startTimeLabel}
          endTime={day.endTimeLabel}
          colorStart="#3b82f6"
          colorEnd="#60a5fa"
        />
        
        <TimeProgressCard
          title="Một tuần"
          percentage={week.percentage}
          startTime={week.startTimeLabel}
          endTime={week.endTimeLabel}
          colorStart="#8b5cf6"
          colorEnd="#c084fc"
        />
        
        <TimeProgressCard
          title="Một tháng"
          percentage={month.percentage}
          startTime={month.startTimeLabel}
          endTime={month.endTimeLabel}
          colorStart="#ec4899"
          colorEnd="#f472b6"
        />
        
        <TimeProgressCard
          title="Một năm"
          percentage={year.percentage}
          startTime={year.startTimeLabel}
          endTime={year.endTimeLabel}
          colorStart="#f59e0b"
          colorEnd="#fbbf24"
        />
        </div>
        <div className="side-panel">
          <MilestoneList milestones={upcomingMilestones} />
        </div>
      </main>
    </div>
  );
}

export default App;
