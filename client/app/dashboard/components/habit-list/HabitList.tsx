"use client";

import dayjs from "dayjs";
import { useState } from "react";
import CalendarPopup from "./CalendarPopup";
import HabitDetailDrawer from "../habit-detail/HabitDetailDrawer";
import HabitItem from "./HabitItem";
import HabitGroup from "./HabitGroup";

import { useHabitGrid } from "../../context/HabitGridContext";
import { useHabitList } from "../../context/HabitListContext";
import { progressApi } from "@/lib/api";
import type { GroupKey } from "./types";

export default function HabitList() {
  const { selectedCell, selectCell, habits: gridHabits } = useHabitGrid();
  const { date, setDate, habits } = useHabitList();

  const dateKey = dayjs(date).format("YYYY-MM-DD");

  const [detailHabit, setDetailHabit] = useState<any>(null);
  const [summary, setSummary] = useState<any>({});
  const [history, setHistory] = useState<any[]>([]);

  const openDetail = async (habit: any) => {
    setDetailHabit(habit);
    const summaryRes = await progressApi.getSummary(habit.habitId);
    setSummary(summaryRes.data);

    const historyRes = await progressApi.getHistory(habit.habitId, {
      limit: 30,
    });

    setHistory(historyRes?.data?.history ?? []);
  };

  // GROUP TYPES
  const groups: Record<GroupKey, any[]> = {
    success: [],
    skip: [],
    fail: [],
    none: [],
  };

  habits.forEach((habit) => {
    const gridHabit = gridHabits.find((h) => h.habitId === habit.habitId);
    const status =
      gridHabit?.days?.find((d) => d.date === dateKey)?.status || "NONE";

    if (status === "COMPLETE") groups.success.push(habit);
    else if (status === "SKIP") groups.skip.push(habit);
    else if (status === "FAIL") groups.fail.push(habit);
    else groups.none.push(habit);
  });

  // ACCORDION STATE
  const [openGroup, setOpenGroup] = useState({
    none: true,
    success: false,
    skip: false,
    fail: false,
  });

  const toggle = (g: GroupKey) =>
    setOpenGroup((prev) => ({ ...prev, [g]: !prev[g] }));

  // RENDER ITEM
  const renderItem = (habit: any) => {
    const habitId = habit.habitId;
    const gridHabit = gridHabits.find((h) => h.habitId === habitId);

    const dayStatus =
      gridHabit?.days?.find((d) => d.date === dateKey)?.status || "NONE";

    const isSelected =
      selectedCell?.habitId === habitId && selectedCell?.date === dateKey;

    return (
      <HabitItem
        key={habitId}
        habit={habit}
        dateKey={dateKey}
        dayStatus={dayStatus}
        isSelected={isSelected}
        onSelect={() => selectCell(habitId, dateKey)}
        onOpenDetail={() => openDetail(habit)}
      />
    );
  };

  return (
    <div className="w-full h-[87vh] overflow-auto px-4 py-6 pb-40 text-white">
      <CalendarPopup
        value={date.toDate()}
        onChange={(d) => setDate(dayjs(d))}
      />

      <div className="mt-6 space-y-8">
        <HabitGroup
          title="Today"
          groupKey="none"
          color="text-gray-300"
          open={openGroup.none}
          toggle={toggle}
          list={groups.none}
          renderItem={renderItem}
        />

        <HabitGroup
          title="Success"
          groupKey="success"
          color="text-green-400"
          open={openGroup.success}
          toggle={toggle}
          list={groups.success}
          renderItem={renderItem}
        />

        <HabitGroup
          title="Skipped"
          groupKey="skip"
          color="text-yellow-400"
          open={openGroup.skip}
          toggle={toggle}
          list={groups.skip}
          renderItem={renderItem}
        />

        <HabitGroup
          title="Failed"
          groupKey="fail"
          color="text-red-400"
          open={openGroup.fail}
          toggle={toggle}
          list={groups.fail}
          renderItem={renderItem}
        />
      </div>

      <HabitDetailDrawer
        open={!!detailHabit}
        habit={detailHabit}
        onClose={() => setDetailHabit(null)}
        summary={summary}
        history={history}
      />
    </div>
  );
}
