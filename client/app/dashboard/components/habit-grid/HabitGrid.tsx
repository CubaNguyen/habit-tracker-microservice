"use client";

import { useMemo, useState } from "react";
import { Menu } from "lucide-react";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

import HabitModal from "../add-habit-modal/HabitModal";
import HabitRow from "./HabitRow";
import { useHabitGrid } from "../../context/HabitGridContext";
import HabitDetailDrawer from "../habit-detail/HabitDetailDrawer";
import { progressApi } from "@/lib/api";

dayjs.extend(isSameOrBefore);

export default function HabitGrid() {
  const { habits, loading, range } = useHabitGrid();
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [summary, setSummary] = useState<any>({});
  const [history, setHistory] = useState<any[]>([]);
  // =============== BUILD DAYS ===============
  const days = useMemo(() => {
    if (!range.from || !range.to) return [];

    const start = dayjs(range.from);
    const end = dayjs(range.to);
    const total = end.diff(start, "day") + 1;

    const list = [];
    for (let i = 0; i < total; i++) {
      list.push(start.add(i, "day"));
    }

    // lấy 11 ngày cuối cho giao diện
    return list.slice(-11);
  }, [range]);
  const openDetail = async (habit: any) => {
    setSelectedHabit(habit);

    // fetch summary
    const summaryRes = await progressApi.getSummary(habit.habitId);
    setSummary(summaryRes.data);

    // fetch history
    const historyRes = await progressApi.getHistory(habit.habitId, {
      limit: 30,
    });

    setHistory(historyRes?.data?.history);
  };
  if (loading) {
    return (
      <div className="flex justify-center p-6 text-base-content/60">
        Loading habits…
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-base-100 text-base-content h-full fixed w-full">
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-base-300">
        <h2 className="font-semibold text-base">Morning</h2>
        <Menu size={16} className="opacity-70" />
      </div>

      {/* GRID */}
      <div className="h-[80vh] flex flex-col">
        <div className="flex-1 p-4 overflow-auto">
          <div className="border border-base-300 rounded-md">
            {/* TABLE HEADER */}
            <div className="grid grid-cols-[220px_repeat(14,1fr)_60px] bg-base-200 text-sm">
              <div className="pl-10 py-2 font-medium border-r border-base-300"></div>

              {days.map((date, idx) => {
                const label = date.format("dd D");
                const isToday = date.isSame(dayjs(), "day");

                return (
                  <div
                    key={idx}
                    className={`text-center py-2 border ${
                      isToday
                        ? "text-blue-400 font-medium border-b-2 border-blue-500"
                        : "opacity-70"
                    }`}
                  >
                    {label}
                    {isToday && (
                      <span className="ml-1 text-blue-400 text-xs">
                        • Today
                      </span>
                    )}
                  </div>
                );
              })}

              <div className="text-right pr-3 py-2 text-sm opacity-70 border-l border-base-300">
                🔥
              </div>
            </div>

            {/* HABIT ROWS */}
            {habits.map((habit) => (
              <HabitRow
                key={habit.habitId}
                habit={habit}
                days={days}
                onOpenDetail={openDetail}
              />
            ))}

            {/* ADD HABIT */}
            <div className="flex items-center gap-2 pl-6 py-3 border-t border-base-300 hover:bg-base-200 transition-colors">
              <HabitModal />
            </div>
            <HabitDetailDrawer
              open={!!selectedHabit}
              habit={selectedHabit}
              onClose={() => setSelectedHabit(null)}
              summary={summary}
              history={history}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
