import type { HabitProgressDay } from "./habit-progress";
import { Milestone } from "./milestone";
import { RepeatRule } from "./repeat-rule";

export interface MergedHabit {
  habitId: string;
  name: string;
  unit: string;
  targetAmount: number;
  categoryName: string | null;
  tagNames: string[];
  repeatRule: RepeatRule;
  milestones: Milestone;
  startDate: string;

  streak: number;
  totalProgress: number;
  days: HabitProgressDay[];
}
