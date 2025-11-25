import dayjs from "dayjs";
import StatusPill from "./StatusPill";

type HabitHistoryProps = {
  history: any[];
};

export default function HabitHistory({ history }: HabitHistoryProps) {
  return (
    <div>
      <div className="text-lg font-semibold mb-3">History</div>

      <div className="flex flex-col gap-2">
        {history.length === 0 && (
          <div className="text-neutral-500 text-sm">No history yet.</div>
        )}

        {history.map((h: any, i: number) => (
          <div
            key={i}
            className="flex flex-col px-3 py-2 rounded-lg bg-neutral-900/40 hover:bg-neutral-800/40 border border-neutral-800"
          >
            <div className="flex items-center justify-between">
              <div className="text-neutral-300 text-sm">
                {dayjs(h.date).format("ddd, MMM DD")}
              </div>

              <StatusPill status={h.status} />

              {h.progressValue !== null && (
                <span className="text-xs text-neutral-400 ml-2">
                  ({h.progressValue})
                </span>
              )}
            </div>

            {h.notes && (
              <div className="mt-2 text-neutral-400 text-xs border-l border-neutral-700 pl-2">
                📝 {h.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
