import type { Dayjs } from "dayjs";
import type { HabitListItem } from "./habit-list-item";

export interface HabitListContextState {
  date: Dayjs;
  setDate: (d: Dayjs) => void;

  habits: HabitListItem[];
  loading: boolean;

  reload: () => void;
}
