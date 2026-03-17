export type TaskStatus = 'pending' | 'completed' | 'exam' | 'high-priority';

export interface SchoolTask {
  id: string;
  title: string;
  dueDate: string;
  status: TaskStatus;
  progress?: number;
  icon: string;
}

export interface LifeEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  category: 'social' | 'medical' | 'important' | 'fitness';
  attendees?: string[];
  note?: string;
  duration?: number; // in minutes
  completed?: boolean;
}

export interface Badge {
  id: string;
  title: string;
  icon: string;
  unlocked: boolean;
}

export interface UserStats {
  level: number;
  xp: number;
  streak: number;
  timeSpent: string;
}
