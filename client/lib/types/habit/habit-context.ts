import type { Habit } from "./habit.model";
import type { HabitRequest } from "./habit.dto";

export interface HabitContextType {
  habits: Habit[];
  loading: boolean;
  refreshHabits: () => Promise<void>;
  createHabit: (data: HabitRequest) => Promise<Habit | null>;
  updateHabit: (id: string, data: Partial<HabitRequest>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
}
