import { RepeatRule } from "./repeat-rule";
import type { Milestone } from "./milestone"; // nếu bạn đã tách Milestone như trước

export interface HabitRequest {
  name: string;
  unit: string;
  targetAmount: number;
  startDate: string;
  endDate?: string;
  categoryId?: string | null;
  tagIds?: string[];
  repeatRule: RepeatRule;
  milestones?: Milestone[]; // đừng để any[] nếu có thể
}
