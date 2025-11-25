"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import dayjs from "dayjs";
import { habitApi } from "@/lib/api/habit";
import { progressApi } from "@/lib/api/progress";

// =======================
// TYPES
// =======================
interface HabitInfo {
  habitId: string;
  name: string;
  unit: string;
  targetAmount: number;
  startDate: string;
  endDate: string | null;

  categoryName: string | null;
  tagNames: string[];
  repeatRule: any;
  milestones: any[];
}

interface HabitProgressDay {
  date: string;
  status: string;
  progressValue: number | null;
}

interface HabitProgress {
  habitId: string;
  streak: number;
  totalProgress: number;
  days: HabitProgressDay[];
}

export interface MergedHabit {
  habitId: string;
  name: string;
  unit: string;
  targetAmount: number;
  categoryName: string | null;
  tagNames: string[];
  repeatRule: any;
  milestones: any[];
  startDate: string;

  streak: number;
  totalProgress: number;
  days: HabitProgressDay[];
}

// =======================
// CONTEXT STATE
// =======================
interface HabitGridContextState {
  loading: boolean;
  habits: MergedHabit[];
  range: { from: string; to: string };

  refresh: () => void;

  // actions
  complete: (
    habitId: string,
    date: string,
    progressValue?: number,
    notes?: string
  ) => Promise<void>;
  skip: (habitId: string, date: string, notes?: string) => Promise<void>;
  fail: (habitId: string, date: string) => Promise<void>;
  reset: (habitId: string, date: string) => Promise<void>;

  // selection
  selectedCell: { habitId: string | null; date: string | null } | null;
  selectCell: (habitId: string, date: string) => void;
  clearSelection: () => void;

  executeAction: (
    type: "complete" | "skip" | "fail" | "reset",
    payload?: { progressValue?: number; notes?: string }
  ) => Promise<void>;
}

const HabitGridContext = createContext<HabitGridContextState | undefined>(
  undefined
);

// =======================
// PROVIDER
// =======================
export function HabitGridProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState<MergedHabit[]>([]);
  const [range, setRange] = useState({ from: "", to: "" });

  // selected cell (single select)
  const [selectedCell, setSelectedCell] = useState<{
    habitId: string | null;
    date: string | null;
  } | null>(null);

  const today = dayjs();
  const from = today.subtract(13, "day").format("YYYY-MM-DD");
  const to = today.format("YYYY-MM-DD");

  // Load BOTH Habit Info + Progress Grid
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const habitRes = await habitApi.getAllHabit();
      const habitList: HabitInfo[] = habitRes.data || [];

      const gridRes = await progressApi.getOverview(from, to);
      const progressList: HabitProgress[] = gridRes.data.habits || [];

      setRange({
        from: gridRes.data.from,
        to: gridRes.data.to,
      });

      const merged: MergedHabit[] = habitList.map((h) => {
        const p = progressList.find((x) => x.habitId === h.habitId);

        return {
          ...h,
          streak: p?.streak ?? 0,
          totalProgress: p?.totalProgress ?? 0,
          days: p?.days ?? [],
        };
      });

      setHabits(merged);
    } catch (err) {
      console.error("❌ HabitGrid load error:", err);
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // =======================
  // ACTIONS
  // =======================

  const complete = useCallback(
    async (
      habitId: string,
      date: string,
      progressValue = 1,
      notes?: string
    ) => {
      await progressApi.complete({ habitId, date, progressValue, notes });
      await loadData();
    },
    [loadData]
  );

  const skip = useCallback(
    async (habitId: string, date: string, notes?: string) => {
      await progressApi.skip({ habitId, date, notes });
      await loadData();
    },
    [loadData]
  );

  const fail = useCallback(
    async (habitId: string, date: string) => {
      await progressApi.fail({ habitId, date });
      await loadData();
    },
    [loadData]
  );

  const reset = useCallback(
    async (habitId: string, date: string) => {
      await progressApi.reset({ habitId, date });
      await loadData();
    },
    [loadData]
  );

  // =======================
  // SELECTION
  // =======================
  const selectCell = useCallback((habitId: string, date: string) => {
    setSelectedCell({ habitId, date });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedCell(null);
  }, []);

  // Footer actions call this
  const executeAction = async (
    type: "complete" | "skip" | "fail" | "reset",
    payload?: { progressValue?: number; notes?: string | null }
  ) => {
    if (!selectedCell) return;

    const { habitId, date } = selectedCell as {
      habitId: string;
      date: string;
    };

    if (type === "complete") {
      await complete(
        habitId,
        date,
        payload?.progressValue ?? 1,
        payload?.notes ?? undefined
      );
    }

    if (type === "skip") {
      await skip(habitId, date, payload?.notes ?? undefined);
    }

    if (type === "fail") {
      await fail(habitId, date);
    }

    if (type === "reset") {
      await reset(habitId, date);
    }
  };

  return (
    <HabitGridContext.Provider
      value={{
        loading,
        habits,
        range,
        refresh: loadData,

        complete,
        skip,
        fail,
        reset,

        selectedCell,
        selectCell,
        clearSelection,
        executeAction,
      }}
    >
      {children}
    </HabitGridContext.Provider>
  );
}

export function useHabitGrid() {
  const ctx = useContext(HabitGridContext);
  if (!ctx)
    throw new Error("useHabitGrid must be used inside HabitGridProvider");
  return ctx;
}
