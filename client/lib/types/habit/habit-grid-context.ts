import type { MergedHabit } from "./merged-habit";

export interface HabitGridContextState {
  loading: boolean;
  habits: MergedHabit[];
  range: { from: string; to: string };

  refresh: () => void;

  complete: (
    habitId: string,
    date: string,
    progressValue?: number,
    notes?: string
  ) => Promise<void>;

  skip: (habitId: string, date: string, notes?: string) => Promise<void>;
  fail: (habitId: string, date: string) => Promise<void>;
  reset: (habitId: string, date: string) => Promise<void>;

  selectedCell: { habitId: string | null; date: string | null } | null;
  selectCell: (habitId: string, date: string) => void;
  clearSelection: () => void;

  executeAction: (
    type: "complete" | "skip" | "fail" | "reset",
    payload?: { progressValue?: number; notes?: string }
  ) => Promise<void>;
}
