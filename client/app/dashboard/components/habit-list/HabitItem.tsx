"use client";
import type { HabitListItemProps } from "./types";

export default function HabitItem({
  habit,
  dateKey,
  isSelected,
  dayStatus,
  onSelect,
  onOpenDetail,
}: HabitListItemProps) {
  const handleClick = () => {
    if (isSelected) onOpenDetail();
    else onSelect();
  };

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl cursor-pointer bg-[#1f1f1f] border transition
        ${
          isSelected
            ? "border-blue-500 shadow-[0_0_0_2px_#2563eb80]"
            : "border-gray-700"
        }`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">🗝️</span>

        <div>
          <p
            className={`font-semibold ${
              dayStatus === "COMPLETE" ? "line-through opacity-50" : ""
            }`}
          >
            {habit.name}
          </p>

          <p className="text-xs opacity-60">
            {dayStatus === "COMPLETE" && "Completed"}
            {dayStatus === "SKIP" && "Skipped"}
            {dayStatus === "FAIL" && "Failed"}
            {dayStatus === "NONE" && "Not done"}
          </p>
        </div>
      </div>

      <div
        className={`w-3 h-3 rounded-full ${
          isSelected
            ? "bg-blue-400"
            : dayStatus === "COMPLETE"
            ? "bg-green-500"
            : dayStatus === "SKIP"
            ? "bg-yellow-500"
            : dayStatus === "FAIL"
            ? "bg-red-500"
            : "bg-transparent"
        }`}
      />
    </div>
  );
}
