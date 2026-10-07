export interface TimeProgressInfo {
  percentage: number;
  startTimeLabel: string;
  endTimeLabel: string;
}

export function getWorkdayProgress(now: Date): TimeProgressInfo {
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  
  const startWork1 = new Date(startOfDay);
  startWork1.setHours(8, 30, 0, 0);
  
  const endWork1 = new Date(startOfDay);
  endWork1.setHours(12, 30, 0, 0);
  
  const startWork2 = new Date(startOfDay);
  startWork2.setHours(13, 30, 0, 0);
  
  const endWork2 = new Date(startOfDay);
  endWork2.setHours(17, 30, 0, 0);

  const tNow = now.getTime();
  const tStart1 = startWork1.getTime();
  const tEnd1 = endWork1.getTime();
  const tStart2 = startWork2.getTime();
  const tEnd2 = endWork2.getTime();

  let percentage = 0;

  if (tNow <= tStart1) {
    percentage = 0;
  } else if (tNow > tStart1 && tNow <= tEnd1) {
    percentage = ((tNow - tStart1) / (tEnd1 - tStart1)) * 50;
  } else if (tNow > tEnd1 && tNow <= tStart2) {
    percentage = 50;
  } else if (tNow > tStart2 && tNow <= tEnd2) {
    percentage = 50 + ((tNow - tStart2) / (tEnd2 - tStart2)) * 50;
  } else {
    percentage = 100;
  }

  return {
    percentage: Math.max(0, Math.min(100, percentage)),
    startTimeLabel: '08:30',
    endTimeLabel: '17:30'
  };
}

export function getDayProgress(now: Date): TimeProgressInfo {
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(startOfDay.getDate() + 1);

  const tNow = now.getTime();
  const tStart = startOfDay.getTime();
  const tEnd = endOfDay.getTime();

  const percentage = ((tNow - tStart) / (tEnd - tStart)) * 100;

  return {
    percentage: Math.max(0, Math.min(100, percentage)),
    startTimeLabel: '00:00',
    endTimeLabel: '24:00'
  };
}

export function getWeekProgress(now: Date): TimeProgressInfo {
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const dayOfWeek = startOfDay.getDay(); // 0 is Sunday, 1 is Monday, ...
  
  // Calculate days to subtract to get to Monday (if Sunday (0), subtract 6 days, else subtract dayOfWeek - 1)
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - diffToMonday);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const tNow = now.getTime();
  const tStart = startOfWeek.getTime();
  const tEnd = endOfWeek.getTime();

  const percentage = ((tNow - tStart) / (tEnd - tStart)) * 100;

  return {
    percentage: Math.max(0, Math.min(100, percentage)),
    startTimeLabel: 'Thứ Hai',
    endTimeLabel: 'Thứ Hai (tuần sau)'
  };
}

export function getMonthProgress(now: Date): TimeProgressInfo {
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);

  const tNow = now.getTime();
  const tStart = startOfMonth.getTime();
  const tEnd = endOfMonth.getTime();

  const percentage = ((tNow - tStart) / (tEnd - tStart)) * 100;

  return {
    percentage: Math.max(0, Math.min(100, percentage)),
    startTimeLabel: `01/${(now.getMonth() + 1).toString().padStart(2, '0')}`,
    endTimeLabel: `01/${(endOfMonth.getMonth() + 1).toString().padStart(2, '0')}`
  };
}

export function getYearProgress(now: Date): TimeProgressInfo {
  const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
  const endOfYear = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0, 0);

  const tNow = now.getTime();
  const tStart = startOfYear.getTime();
  const tEnd = endOfYear.getTime();

  const percentage = ((tNow - tStart) / (tEnd - tStart)) * 100;

  return {
    percentage: Math.max(0, Math.min(100, percentage)),
    startTimeLabel: `01/01/${now.getFullYear()}`,
    endTimeLabel: `01/01/${now.getFullYear() + 1}`
  };
}

const LIFE_TARGET_AGE = 60;

export function getLifeProgress(now: Date): TimeProgressInfo {
  const birthDate = new Date(2004, 11, 19, 0, 0, 0, 0); // 19/12/2004
  const targetDate = new Date(
    birthDate.getFullYear() + LIFE_TARGET_AGE,
    birthDate.getMonth(),
    birthDate.getDate(),
    0, 0, 0, 0
  );
  
  const tNow = now.getTime();
  const tStart = birthDate.getTime();
  const tEnd = targetDate.getTime();
  
  const percentage = ((tNow - tStart) / (tEnd - tStart)) * 100;

  return {
    percentage: Math.max(0, Math.min(100, percentage)),
    startTimeLabel: '19/12/2004',
    endTimeLabel: `19/12/${2004 + LIFE_TARGET_AGE}`
  };
}
