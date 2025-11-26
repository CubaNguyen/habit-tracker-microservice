"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { habitApi } from "@/lib/api/habit";
import type { Habit, HabitRequest, HabitContextType } from "@/lib/types/habit";

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
