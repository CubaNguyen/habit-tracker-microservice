type HabitMilestonesProps = {
  milestones: any[];
  summary: any;
};

export default function HabitMilestones({
  milestones,
  summary,
}: HabitMilestonesProps) {
  if (!milestones || milestones.length === 0) return null;

  return (
    <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 mb-6">
      <div className="text-lg font-semibold mb-2 flex items-center gap-2">
        🏆 Milestones
      </div>

      <div className="flex flex-col gap-2">
        {milestones.map((m: any, idx: number) => {
          const current = summary.totalProgress ?? 0;
          const target = m.targetAmount ?? 0;
          const shown = Math.min(current, target);
          const achieved = current >= target;

          return (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg bg-neutral-900 border border-neutral-800"
            >
              <div className="flex flex-col">
                <span className="text-neutral-300 text-sm">{m.name}</span>
                <span className="text-xs text-neutral-500 mt-1">
                  {shown} / {target}
                </span>
              </div>

              {achieved ? (
                <span className="text-green-400 text-xs px-2 py-1 rounded bg-green-500/20 border border-green-500/40">
                  Achieved
                </span>
              ) : (
                <span className="text-neutral-500 text-xs px-2 py-1 rounded bg-neutral-800 border border-neutral-700">
                  In progress
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
