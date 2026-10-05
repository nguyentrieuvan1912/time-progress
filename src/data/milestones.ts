export type MilestoneType = 'official' | 'cultural' | 'personal';

export interface MilestoneDef {
  id: string;
  name: string;
  icon: string;
  type: MilestoneType;
  // if solar, fixed day/month
  month?: number; // 1-12
  date?: number; // 1-31
  // if lunar, mapped by year
  lunarKey?: 'tet' | 'hungKings' | 'midAutumn';
}

export const lunarDatesByYear: Record<number, Record<string, { month: number, date: number }>> = {
  2024: {
    tet: { month: 2, date: 10 },
    hungKings: { month: 4, date: 18 },
    midAutumn: { month: 9, date: 17 },
  },
  2025: {
    tet: { month: 1, date: 29 },
    hungKings: { month: 4, date: 7 },
    midAutumn: { month: 10, date: 6 },
  },
  2026: {
    tet: { month: 2, date: 17 }, // Tet 2026 is Feb 17
    hungKings: { month: 4, date: 26 }, // 10/3 lunar
    midAutumn: { month: 9, date: 25 }, // 15/8 lunar
  },
  2027: {
    tet: { month: 2, date: 6 },
    hungKings: { month: 4, date: 16 },
    midAutumn: { month: 9, date: 15 },
  },
  2028: {
    tet: { month: 1, date: 26 },
    hungKings: { month: 4, date: 4 },
    midAutumn: { month: 10, date: 3 },
  },
  2029: {
    tet: { month: 2, date: 13 },
    hungKings: { month: 4, date: 23 },
    midAutumn: { month: 9, date: 22 },
  },
  2030: {
    tet: { month: 2, date: 3 },
    hungKings: { month: 4, date: 12 },
    midAutumn: { month: 9, date: 12 },
  }
};

export const MILESTONES: MilestoneDef[] = [
  { id: 'new-year', name: 'Tết Dương lịch', icon: '🎆', type: 'official', month: 1, date: 1 },
  { id: 'tet', name: 'Tết Nguyên đán', icon: '🧧', type: 'official', lunarKey: 'tet' },
  { id: 'hung-kings', name: 'Giỗ Tổ Hùng Vương', icon: '🎉', type: 'official', lunarKey: 'hungKings' },
  { id: 'liberation', name: 'Giải phóng miền Nam', icon: '🇻🇳', type: 'official', month: 4, date: 30 },
  { id: 'labor', name: 'Quốc tế Lao động', icon: '🌏', type: 'official', month: 5, date: 1 },
  { id: 'national-day', name: 'Quốc khánh', icon: '🇻🇳', type: 'official', month: 9, date: 2 },
  { id: 'womens-day', name: 'Quốc tế Phụ nữ', icon: '🌹', type: 'cultural', month: 3, date: 8 },
  { id: 'mens-day', name: 'Quốc tế Nam giới', icon: '👨', type: 'cultural', month: 11, date: 19 },
  { id: 'vn-womens-day', name: 'Phụ nữ Việt Nam', icon: '👩', type: 'cultural', month: 10, date: 20 },
  { id: 'family-day', name: 'Gia đình Việt Nam', icon: '👨‍👩‍👧‍👦', type: 'cultural', month: 6, date: 28 },
  { id: 'mid-autumn', name: 'Tết Trung thu', icon: '👶', type: 'cultural', lunarKey: 'midAutumn' },
  { id: 'birthday', name: 'Sinh nhật', icon: '🎂', type: 'personal', month: 12, date: 19 },
];

export interface ResolvedMilestone {
  id: string;
  name: string;
  icon: string;
  type: MilestoneType;
  date: Date;
  daysRemaining: number;
  timeRemaining: number;
}

export function getNextMilestones(now: Date, limit = 5): ResolvedMilestone[] {
  const currentYear = now.getFullYear();
  const nextYear = currentYear + 1;
  
  const resolved: ResolvedMilestone[] = [];
  
  for (const m of MILESTONES) {
    let mDate: Date | null = null;
    
    // Try current year
    if (m.lunarKey) {
       const l = lunarDatesByYear[currentYear]?.[m.lunarKey];
       if (l) mDate = new Date(currentYear, l.month - 1, l.date);
    } else if (m.month && m.date) {
       mDate = new Date(currentYear, m.month - 1, m.date);
    }
    
    // Check if passed (treat end of that day as threshold)
    let useNextYear = false;
    if (mDate) {
       const endOfEvent = new Date(mDate);
       endOfEvent.setHours(23, 59, 59, 999);
       if (now.getTime() > endOfEvent.getTime()) {
         useNextYear = true;
       }
    } else {
       useNextYear = true; 
    }
    
    if (useNextYear) {
       if (m.lunarKey) {
         const l = lunarDatesByYear[nextYear]?.[m.lunarKey];
         if (l) mDate = new Date(nextYear, l.month - 1, l.date);
       } else if (m.month && m.date) {
         mDate = new Date(nextYear, m.month - 1, m.date);
       }
    }
    
    if (mDate) {
      // Set to start of day for comparison
      mDate.setHours(0, 0, 0, 0);
      
      let msRemaining = mDate.getTime() - now.getTime();
      if (msRemaining < 0) msRemaining = 0; // If today, it's 0 days
      
      resolved.push({
        id: m.id,
        name: m.name,
        icon: m.icon,
        type: m.type,
        date: mDate,
        daysRemaining: Math.ceil(msRemaining / (1000 * 60 * 60 * 24)),
        timeRemaining: msRemaining
      });
    }
  }
  
  // Sorting: Birthday priority if very close, otherwise standard sort
  resolved.sort((a, b) => {
    // If birthday is within 7 days, it gets top priority among things equally close? 
    // The prompt says "Birthday phải có type = "personal" và được ưu tiên hiển thị." and "Milestone gần nhất được làm nổi bật".
    // I will just sort by timeRemaining, and the UI will highlight the first one. 
    // If multiple have same time, personal first.
    if (a.timeRemaining === b.timeRemaining) {
      if (a.type === 'personal') return -1;
      if (b.type === 'personal') return 1;
    }
    return a.timeRemaining - b.timeRemaining;
  });
  
  return resolved.slice(0, limit);
}

export function formatCountdown(ms: number): { days: number, hours: number, mins: number, secs: number } {
  if (ms <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
  const totalSecs = Math.floor(ms / 1000);
  const days = Math.floor(totalSecs / (24 * 3600));
  const hours = Math.floor((totalSecs % (24 * 3600)) / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  return { days, hours, mins, secs };
}
