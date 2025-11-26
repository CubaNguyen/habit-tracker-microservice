export type RepeatType = "DAILY" | "WEEKLY" | "MONTHLY" | "CUSTOM";

export interface RepeatRule {
  repeatType: RepeatType;
  repeatValue: string | null;
}
