import StatCard from "./StatCard";

type HabitStatsProps = {
  summary: any;
};

export default function HabitStats({ summary }: HabitStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <StatCard
        label="Completed"
        value={summary.completedDays ?? 0}
        color="text-green-400"
      />
      <StatCard
        label="Skipped"
        value={summary.skippedDays ?? 0}
        color="text-yellow-400"
      />
      <StatCard
        label="Failed"
        value={summary.failedDays ?? 0}
        color="text-red-400"
      />
      <StatCard
        label="Active Days"
        value={summary.activeDays ?? 0}
        color="text-blue-400"
      />
    </div>
  );
}
