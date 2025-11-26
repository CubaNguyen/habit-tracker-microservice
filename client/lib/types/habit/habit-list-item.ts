export interface HabitListItem {
  habitId: string;
  name: string;
  status: "ACTIVE";
  unit?: string;
  targetAmount?: number;
  icon?: string;
}
