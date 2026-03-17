import { subDays, format } from 'date-fns';
import { SchoolTask, LifeEvent } from '../types';

export function calculateStreak(tasks: SchoolTask[], events: LifeEvent[]): number {
  const completedDates = new Set<string>();

  tasks.forEach(t => {
    if (t.status === 'completed' && t.dueDate) {
      completedDates.add(t.dueDate);
    }
  });

  events.forEach(e => {
    if (e.completed && e.date) {
      completedDates.add(e.date);
    }
  });

  let streak = 0;
  let checkDate = new Date();
  let checkDateStr = format(checkDate, 'yyyy-MM-dd');
  
  // Check if today has activity
  if (completedDates.has(checkDateStr)) {
    while (completedDates.has(checkDateStr)) {
      streak++;
      checkDate = subDays(checkDate, 1);
      checkDateStr = format(checkDate, 'yyyy-MM-dd');
    }
  } else {
    // If today has no activity, check if yesterday had activity to maintain the streak
    checkDate = subDays(checkDate, 1);
    checkDateStr = format(checkDate, 'yyyy-MM-dd');
    while (completedDates.has(checkDateStr)) {
      streak++;
      checkDate = subDays(checkDate, 1);
      checkDateStr = format(checkDate, 'yyyy-MM-dd');
    }
  }

  return streak;
}
