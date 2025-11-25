"use client";

import dayjs from "dayjs";
import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import { X } from "lucide-react";

import HabitStats from "./HabitStats";
import HabitMilestones from "./HabitMilestones";
import HabitHistory from "./HabitHistory";
import HabitPerformanceChart from "./HabitPerformanceChart";

export default function HabitDetailDrawer({
  open,
  onClose,
  habit,
  summary,
  history,
}: {
  open: boolean;
  onClose: () => void;
  habit: any;
  summary: any;
  history: any[];
}) {
  if (!habit) return null;

  return (
    <Transition show={open} as={Fragment}>
      <div className="fixed inset-0 z-50 flex">
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="transition-opacity duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-40"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-40"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 bg-black" onClick={onClose} />
        </Transition.Child>

        {/* Drawer */}
        <Transition.Child
          as={Fragment}
          enter="transform transition-all duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition-all duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="relative ml-auto h-full w-[420px] bg-neutral-950 border-l border-neutral-800 p-6 overflow-y-auto shadow-xl">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-2xl font-semibold flex items-center gap-2">
                  {habit.icon || "📌"} {habit?.name}
                </div>
                <div className="text-neutral-400 text-sm mt-1">
                  {habit.repeatRule?.repeatType || "Daily"}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-800 rounded-lg transition"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            {/* Stats */}
            <HabitStats summary={summary} />

            {/* Streak */}
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 mb-6">
              <div className="text-lg font-semibold flex items-center gap-2">
                🔥 Streak
              </div>
              <div className="mt-2 flex flex-col gap-1 text-neutral-300">
                <div>
                  Current streak:{" "}
                  <span className="text-white">{summary?.streak ?? 0}</span>{" "}
                  days
                </div>
                <div>
                  Longest streak:{" "}
                  <span className="text-white">
                    {summary?.longestStreak ?? 0}
                  </span>{" "}
                  days
                </div>
              </div>
            </div>

            {/* Milestones */}
            <HabitMilestones milestones={habit?.milestones} summary={summary} />

            {/* Chart placeholder */}
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 mb-6">
              <div className="text-lg font-semibold">Performance</div>
              <div className="h-32 mt-3 flex items-center justify-center text-neutral-500 text-sm">
                <HabitPerformanceChart history={history} />
              </div>
            </div>

            {/* History */}
            <HabitHistory history={history} />
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
}
