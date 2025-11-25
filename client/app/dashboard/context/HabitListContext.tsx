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

// =============================
// 🔥 TYPES
// =============================
export interface HabitListItem {
  habitId: string;
  name: string;
  status: "ACTIVE" | "COMPLETE" | "FAIL" | "SKIP";
  unit?: string;
  targetAmount?: number;
  icon?: string;
}

export interface HabitListGroups {
  today: HabitListItem[];
  completed: HabitListItem[];
  failed: HabitListItem[];
  skipped: HabitListItem[];
}

interface HabitListContextState {
  date: Dayjs;
  setDate: (d: Dayjs) => void;

  habits: HabitListGroups;
  loading: boolean;

  reload: () => void;
}

// =============================
// 🔥 CONTEXT
// =============================
const HabitListContext = createContext<HabitListContextState | undefined>(
  undefined
);

// =============================
// 🔥 PROVIDER
// =============================
export function HabitListProvider({ children }: { children: ReactNode }) {
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [loading, setLoading] = useState<boolean>(true);

  const [habits, setHabits] = useState<HabitListGroups>({
    today: [],
    completed: [],
    failed: [],
    skipped: [],
  });

  // Load habits for a specific day
  const loadHabits = async (d: Dayjs = date) => {
    try {
      setLoading(true);

      const ds = d.format("YYYY-MM-DD");
      const res = await habitApi.getByDate(ds);

      // ✅ 1) Lấy đúng mảng habits trong ApiResponse
      const rawList = res?.data?.data ?? res?.data ?? [];

      // ✅ 2) Normalize: nếu backend chưa trả status thì coi như ACTIVE
      const list: HabitListItem[] = rawList.map((h: any) => ({
        ...h,
        status: h.status ?? "ACTIVE",
      }));

      setHabits({
        today: list.filter((h) => h.status === "ACTIVE"),
        completed: list.filter((h) => h.status === "COMPLETE"),
        failed: list.filter((h) => h.status === "FAIL"),
        skipped: list.filter((h) => h.status === "SKIP"),
      });
    } catch (err) {
      console.error("❌ Load habits error:", err);
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
// 🔥 CUSTOM HOOK
// =============================
export function useHabitList() {
  const ctx = useContext(HabitListContext);
  if (!ctx) {
    throw new Error("useHabitList must be used inside <HabitListProvider>");
  }
  return ctx;
}
