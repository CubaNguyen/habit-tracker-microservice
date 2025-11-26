export interface HabitProgressDay {
  date: string;
  status: string;
  progressValue: number | null;
}

export interface HabitProgress {
  habitId: string;
  streak: number;
  totalProgress: number;
  days: HabitProgressDay[];
}
