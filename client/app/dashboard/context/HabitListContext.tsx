"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import dayjs, { Dayjs } from "dayjs";
import { habitApi } from "@/lib/api/habit";
import type { HabitListItem, HabitListContextState } from "@/lib/types/habit";

// =============================
// 🔥 TYPES
// =============================

const HabitListContext = createContext<HabitListContextState | undefined>(
  undefined
);

// =============================
// 🔥 PROVIDER (CLEAN VERSION)
// =============================
export function HabitListProvider({ children }: { children: ReactNode }) {
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [loading, setLoading] = useState<boolean>(true);
  const [habits, setHabits] = useState<HabitListItem[]>([]);
  // Load habits for selected day
  const loadHabits = async (d: Dayjs = date) => {
    try {
      setLoading(true);

      const ds = d.format("YYYY-MM-DD");
      const res = await habitApi.getByDate(ds);

      const rawList = res?.data?.data ?? res?.data ?? [];

      const formatted: HabitListItem[] = rawList.map((h: any) => ({
        habitId: h.habitId,
        name: h.name,
        status: h.status ?? "ACTIVE",
        unit: h.unit,
        targetAmount: h.targetAmount,
        icon: h.icon ?? "📌",
      }));

      setHabits(formatted);
    } catch (err) {
      console.error("❌ Load habits error:", err);
      setHabits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, [date]);

  return (
    <HabitListContext.Provider
      value={{
        date,
        setDate,
        habits,
        loading,
        reload: () => loadHabits(date),
      }}
    >
      {children}
    </HabitListContext.Provider>
  );
}

// =============================
// 🔥 Custom Hook
// =============================
export function useHabitList() {
  const ctx = useContext(HabitListContext);
  if (!ctx) {
    throw new Error("useHabitList must be used inside <HabitListProvider>");
  }
  return ctx;
}
