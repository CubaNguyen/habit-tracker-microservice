import type { MergedHabit } from "@/lib/types/habit";
import type { HabitProgressDay } from "@/lib/types/habit";
import { ReactNode } from "react";

export type GroupKey = "success" | "skip" | "fail" | "none";

export interface HabitListGroupProps {
  title: string;
  color: string;
  list: MergedHabit[];
  open: boolean;
  groupKey: GroupKey;
  toggle: (g: GroupKey) => void;
  renderItem: (habit: MergedHabit) => ReactNode;
}

export interface HabitListItemProps {
  habit: MergedHabit;
  dateKey: string;
  isSelected: boolean;
  dayStatus: string;
  onSelect: () => void;
  onOpenDetail: () => void;
}
