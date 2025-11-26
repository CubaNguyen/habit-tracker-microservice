import { Milestone } from "./milestone";
import { RepeatRule } from "./repeat-rule";

export interface HabitInfo {
  habitId: string;
  name: string;
  unit: string;
  targetAmount: number;
  startDate: string;
  endDate: string | null;

  categoryName: string | null;
  tagNames: string[];
  repeatRule: RepeatRule; // TODO: Replace with RepeatRule
  milestones: Milestone; // TODO: Replace with Milestone[]
}
