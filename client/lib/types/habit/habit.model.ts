import { RepeatRule } from "./repeat-rule";
import type { Milestone } from "./milestone";

export interface Habit {
  habitId: string;
  userId: number;
  name: string;
  unit: string;
  targetAmount: number;
  startDate: string;
  endDate?: string;
  categoryId?: string | null;
  categoryName?: string | null;
  tagNames?: string[];
  repeatRule: RepeatRule;
  milestones?: Milestone[];
}
