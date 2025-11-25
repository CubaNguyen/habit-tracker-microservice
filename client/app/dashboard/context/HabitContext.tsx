"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { habitApi } from "@/lib/api/habit";

type RepeatRule = {
  repeatType: "DAILY" | "WEEKLY" | "MONTHLY" | "CUSTOM";
  repeatValue: string | null;
};

// 🟩 Request type: FE gửi đi
export interface HabitRequest {
  name: string;
  unit: string;
  targetAmount: number;
  startDate: string;
  endDate?: string;
  categoryId?: string | null;
  tagIds?: string[];
  repeatRule: RepeatRule;
  milestones?: any[];
}

// 🟩 Response type: BE trả về
export interface Habit {
  habitId: string;
  userId: number;
  name: string;
  unit: string;
  targetAmount: number;
  startDate: string;
  endDate?: string;
  categoryId?: string | null;
  categoryName?: string | null;
  tagNames?: string[];
  repeatRule: {
    repeatType: "DAILY" | "WEEKLY" | "MONTHLY" | "CUSTOM";
    repeatValue: string | null;
  };
  milestones?: any[];
}

interface HabitContextType {
  habits: Habit[];
  loading: boolean;
  refreshHabits: () => Promise<void>;
  createHabit: (data: HabitRequest) => Promise<Habit | null>;
  updateHabit: (id: string, data: Partial<HabitRequest>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
}

const HabitContext = createContext<HabitContextType | null>(null);

export const HabitProvider = ({ children }: { children: React.ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshHabits();
  }, []);

  const refreshHabits = async () => {
    try {
      setLoading(true);
      const res = await habitApi.getAllHabit();
      setHabits(res.data || []);
    } catch (err) {
      console.error("Load habits failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const createHabit = async (data: HabitRequest) => {
    try {
      const body = {
        ...data,
        categoryId: data.categoryId || null,
        tagIds: data.tagIds || [],
        milestones: data.milestones || [],
      };

      const res = await habitApi.createHabit(body);
      const newHabit: Habit = res.data;
      if (newHabit) setHabits((prev) => [...prev, newHabit]);
      return newHabit;
    } catch (err) {
      console.error("Create habit failed:", err);
      return null;
    }
  };

  const updateHabit = async (id: string, data: Partial<HabitRequest>) => {
    try {
      const res = await habitApi.updateHabit(id, data);
      const updated = res.data;
      setHabits((prev) =>
        prev.map((h) => (h.habitId === id ? { ...h, ...updated } : h))
      );
    } catch (err) {
      console.error("Update habit failed:", err);
    }
  };

  const deleteHabit = async (id: string) => {
    try {
      await habitApi.deleteHabit(id);
      setHabits((prev) => prev.filter((h) => h.habitId !== id));
    } catch (err) {
      console.error("Delete habit failed:", err);
    }
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        loading,
        refreshHabits,
        createHabit,
        updateHabit,
        deleteHabit,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabit = () => {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error("useHabit must be used within HabitProvider");
  return ctx;
};
