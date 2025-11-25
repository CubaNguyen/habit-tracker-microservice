"use client";

import { useState } from "react";
import { Check, ArrowRight, X, RotateCcw } from "lucide-react";
import HabitModal from "./add-habit-modal/HabitModal";
import { useHabitGrid } from "../context/HabitGridContext";
import CompleteModal from "./CompleteModal";

export default function HabitFooter() {
  const { selectedCell, habits, executeAction } = useHabitGrid();
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // Không chọn ô → ẩn footer
  if (!selectedCell) return null;

  const { habitId, date } = selectedCell;
  const habit = habits.find((h) => h.habitId === habitId);

  return (
    <>
      {/* ====== FOOTER ====== */}
      <div
        className="h-[44px] bg-base-200 border-t border-base-300
                   flex items-center justify-between text-sm px-4
                   z-20 shadow-[0_-2px_6px_rgba(0,0,0,0.2)]"
      >
        {/* Left: Add Habit */}
        <div className="flex items-center gap-2">
          <HabitModal />
        </div>

        {/* Center: Selected Info */}
        <div className="opacity-80">
          {habit ? (
            <>
              <span className="font-medium">{habit.name}</span>
              <span className="mx-1">·</span>
              <span>{date}</span>
            </>
          ) : (
            <>Selected: {date}</>
          )}
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center divide-x divide-base-300 border-l border-base-300">
          {/* RESET */}
          <button
            onClick={() => executeAction("reset")}
            className="flex items-center gap-1 px-3 hover:text-yellow-400 transition-all"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>

          {/* COMPLETE → mở modal */}
          <button
            onClick={() => setShowCompleteModal(true)}
            className="flex items-center gap-1 px-3 hover:text-blue-500 transition-all"
          >
            <Check size={16} />
            <span>Complete</span>
          </button>

          {/* SKIP */}
          <button
            onClick={() => executeAction("skip")}
            className="flex items-center gap-1 px-3 hover:text-blue-500 transition-all"
          >
            <ArrowRight size={16} />
            <span>Skip</span>
          </button>

          {/* FAIL */}
          <button
            onClick={() => executeAction("fail")}
            className="flex items-center gap-1 px-3 hover:text-red-400 transition-all"
          >
            <X size={16} />
            <span>Fail</span>
          </button>
        </div>
      </div>

      {/* ====== COMPLETE MODAL ====== */}
      <CompleteModal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
      />
    </>
  );
}
