"use client";

import clsx from "clsx";
import dayjs, { Dayjs } from "dayjs";
import { useHabitGrid } from "../../context/HabitGridContext";

interface HabitRowProps {
  habit: any;
  days: Dayjs[];
  onOpenDetail: (habit: any) => void;
}

export default function HabitRow({ habit, days, onOpenDetail }: HabitRowProps) {
  const { selectedCell, selectCell } = useHabitGrid();

  const repeatType = habit.repeatRule?.repeatType ?? "DAILY";
  const repeatValue = habit.repeatRule?.repeatValue
    ? JSON.parse(habit.repeatRule.repeatValue)
    : null;

  const hasMilestone = habit.milestones?.length > 0;

  // ICON MAP
  const iconMap: Record<string, string> = {
    fitness: "🏃‍♂️",
    run: "🏃‍♂️",
    health: "💧",
    read: "📚",
    study: "📖",
    music: "🎵",
    skill: "🛠️",
    default: "🗝️",
  };
  const icon = iconMap[habit.categoryName] || iconMap.default;

  // CHECK SCHEDULE
  const getScheduleStatus = (day: Dayjs) => {
    if (repeatType === "WEEKLY") {
      const allowed = repeatValue?.days || [];
      const weekday = day.format("ddd");
      return allowed.includes(weekday) ? "none" : "off";
    }

    if (repeatType === "MONTHLY") {
      const allowed = repeatValue?.dates || [];
      const d = Number(day.format("D"));
      return allowed.includes(d) ? "none" : "off";
    }
    if (repeatType === "CUSTOM") {
      try {
        // 1) Lấy cycle từ repeatRule
        const cycle = repeatValue?.cycle ?? [];
        if (!cycle.length) return "none";

        // 2) Lấy ngày bắt đầu habit
        const startDate = dayjs(habit.startDate).startOf("day");
        const currentDate = day.startOf("day");

        // 3) Tính số ngày giữa startDate và ngày đang xét
        const diff = currentDate.diff(startDate, "day");

        if (diff < 0) return "off"; // Chưa bắt đầu → off

        // 4) Index theo modulo đúng như backend
        const index = diff % cycle.length;

        // 5) 1 = active, 0 = inactive
        return cycle[index] === 1 ? "none" : "off";
      } catch (e) {
        return "none";
      }
    }

    return "none"; // DAILY + CUSTOM
  };

  const customPattern = (() => {
    if (!repeatValue?.cycle) return "";
    const on = repeatValue.cycle.filter((v: number) => v === 1).length;
    const off = repeatValue.cycle.length - on;
    return `${on} on ${off} off`;
  })();

  return (
    <div className="grid grid-cols-[220px_repeat(14,1fr)_60px] border-b border-base-300 hover:bg-base-200 transition-all">
      {/* LEFT INFO */}
      <div
        className="flex flex-col gap-1 pl-4 py-2 border-r border-base-300"
        onClick={() => onOpenDetail(habit)}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="font-semibold">{habit.name}</span>
        </div>

        <span className="text-xs opacity-70">
          {repeatType === "DAILY" &&
            `Mỗi ngày · ${habit.targetAmount} ${habit.unit}`}
          {repeatType === "WEEKLY" &&
            `Mỗi tuần · ${habit.targetAmount} ${habit.unit}`}
          {repeatType === "MONTHLY" && `Ngày ${repeatValue?.dates?.join(", ")}`}
          {repeatType === "CUSTOM" && `Chu kỳ · ${customPattern}`}
        </span>

        <span className="text-[11px] opacity-60">
          {habit.categoryName && `Category: ${habit.categoryName}`}
          {habit.tagNames?.length > 0 &&
            ` • Tags: ${habit.tagNames.join(", ")}`}
        </span>

        {hasMilestone && (
          <span className="text-[10px] px-2 py-[1px] w-fit rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400">
            {habit.milestones.length} milestones
          </span>
        )}
      </div>

      {/* CELLS */}
      {days.map((day) => {
        const schedule = getScheduleStatus(day);
        const isBeforeStart = day.isBefore(dayjs(habit.startDate), "day");
        const isToday = day.isSame(dayjs(), "day");

        const dateStr = day.format("YYYY-MM-DD");
        const isSelected =
          selectedCell?.habitId === habit.habitId &&
          selectedCell?.date === dateStr;
        // Lấy data từ progress grid
        const dayData = habit.days.find((d: any) => d.date === dateStr);
        const status = dayData?.status;
        const value = dayData?.progressValue;

        // Style khi COMPLETE / SKIP / FAIL
        const statusClass = clsx({
          "bg-blue-500 text-white": status === "COMPLETE",
          "bg-yellow-500/70 text-white": status === "SKIP",
          "bg-red-500/70 text-white": status === "FAIL",
        });

        const cellClass = clsx(
          "relative h-7 mx-[1px] rounded-sm transition-all duration-150 border border-transparent",

          // Nếu đã COMPLETE / SKIPPED / FAILED → style theo status, KHÔNG override
          status && statusClass,

          // BEFORE START
          isBeforeStart && "opacity-20 border-base-300/20 pointer-events-none",

          // OFF DAYS
          !isBeforeStart &&
            schedule === "off" &&
            "bg-[repeating-linear-gradient(45deg,#1f1f1f_0_3px,#262626_3px_6px)] opacity-45 pointer-events-none",

          // NORMAL DAY (chỉ áp nếu chưa có status và không selected)
          !status &&
            !isBeforeStart &&
            schedule === "none" &&
            !isSelected &&
            "bg-base-300/40 hover:bg-base-300/70",

          // SELECTED
          isSelected && "ring-2 ring-blue-400 bg-blue-500/20",

          // TODAY (chỉ bo viền khi không selected và không có status)
          !isSelected && !status && isToday && "border-blue-400/70"
        );

        return (
          <div
            key={dateStr}
            className={cellClass}
            onClick={() => {
              if (!isBeforeStart && schedule !== "off") {
                // alert(JSON.stringify(habit));
                selectCell(habit.habitId, dateStr);
              }
            }}
          >
            {/* Status icons */}
            {status && (
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                {status === "COMPLETE" && "✓"}
                {status === "SKIP" && "→"}
                {status === "FAIL" && "✕"}
              </div>
            )}

            {isSelected && (
              <div className="absolute top-[2px] right-[2px] w-2 h-2 rounded-full bg-blue-400"></div>
            )}
          </div>
        );
      })}

      {/* STREAK */}
      <div className="flex items-center justify-end pr-3 text-orange-400 border-l border-base-300">
        {habit.streak ?? 0}🔥
      </div>
    </div>
  );
}
