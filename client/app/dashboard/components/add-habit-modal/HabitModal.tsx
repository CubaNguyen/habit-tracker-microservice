"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import ActionButton from "@/components/common/ActionButton";
import CategorySelector from "./CategorySelector";
import TagSelector from "./TagSelector";
import RepeatRuleSelector from "./RepeatRuleSelector";
import MilestoneInput, { Milestone } from "./MilestoneInput";
import UnitSelector from "./UnitSelector";
import DatePicker from "./DatePicker";
import dayjs from "dayjs";
import { useHabit } from "../../context/HabitContext";
import { milestoneApi, repeatRuleApi } from "@/lib/api/habit";

type RepeatType = "DAILY" | "WEEKLY" | "MONTHLY" | "CUSTOM";

export default function HabitModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    createHabit,
    refreshHabits,
    habits,
    loading: habitLoading,
  } = useHabit();
  const [habitData, setHabitData] = useState({
    name: "",
    unit: "",
    targetAmount: 1,
    startDate: "",
    endDate: "",
    categoryId: null as string | null,
    tagIds: [] as string[],
    repeatRule: {
      repeatType: "DAILY" as RepeatType,
      repeatValue: null as string | null,
    },
    milestones: [] as Milestone[],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // ✅ Reset form mỗi khi modal đóng
  useEffect(() => {
    if (!open) {
      setHabitData({
        name: "",
        unit: "",
        targetAmount: 1,
        startDate: "",
        endDate: "",
        categoryId: "",
        tagIds: [],
        repeatRule: { repeatType: "DAILY", repeatValue: null },
        milestones: [],
      });
      setErrors({});
    }
  }, [open]);

  // ✅ Validate đơn giản
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!habitData.name.trim()) newErrors.name = "Habit name is required";
    if (!habitData.unit.trim()) newErrors.unit = "Unit is required";
    if (habitData.targetAmount <= 0)
      newErrors.targetAmount = "Target must be greater than 0";
    if (!habitData.startDate) newErrors.startDate = "Start date is required";
    if (
      habitData.startDate &&
      habitData.endDate &&
      dayjs(habitData.endDate).isBefore(dayjs(habitData.startDate))
    ) {
      newErrors.endDate = "End date cannot be before start date";
    }
    return newErrors;
  };

  const handleSaveHabit = async () => {
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;
    try {
      setLoading(true);
      const habitRes = await createHabit({
        name: habitData.name,
        unit: habitData.unit,
        targetAmount: habitData.targetAmount,
        startDate: habitData.startDate,
        endDate: habitData.endDate || "",
        categoryId: habitData.categoryId || null,
        tagIds: habitData.tagIds || [],
        repeatRule: {
          repeatType: habitData?.repeatRule?.repeatType,
          repeatValue: habitData?.repeatRule?.repeatValue,
        },
        milestones: habitData.milestones || [],
      });
      if (
        habitData.repeatRule &&
        habitData.repeatRule?.repeatType &&
        habitRes?.habitId
      ) {
        const habitId = habitRes?.habitId;

        try {
          await repeatRuleApi.create(habitId, habitData.repeatRule);
        } catch (err) {
          console.error("❌ Failed to create repeat rule:", err);
        }
      }
      if (habitRes) {
        const habitId = habitRes?.habitId;
        console.log("✅ Habit created:", habitId);

        // 🟦 2. Nếu có milestone thì gọi API milestone theo habitId
        if (habitData.milestones?.length > 0) {
          console.log("🚀 Creating all milestones:", habitData.milestones);

          const milestonePromises = habitData.milestones.map((m) => {
            const milestonePayload = {
              name: m.name,
              targetAmount: m.target_amount || null,
            };
            return milestoneApi.create(habitId, milestonePayload);
          });

          try {
            await Promise.all(milestonePromises);
            console.log("✅ All milestones created successfully!");
          } catch (error) {
            console.error("❌ Some milestones failed:", error);
          }
        }
      }

      await refreshHabits();
      setOpen(false);
    } catch (err) {
      console.error("❌ Error creating habit:", err);
    } finally {
      setLoading(false);
    }
  };

  const hasErrors = Object.keys(validate()).length > 0;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-blue-500 hover:underline text-sm"
      >
        ＋ Add habit
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1e1e1e] text-gray-100 w-[540px] rounded-2xl border border-[#2e2e2e] shadow-2xl overflow-hidden animate-fadeIn"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2e2e2e]">
              <h2 className="font-semibold text-lg">🧩 New Habit</h2>
              <X
                onClick={() => setOpen(false)}
                className="w-5 h-5 cursor-pointer text-gray-400 hover:text-gray-200"
              />
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5 text-sm max-h-[70vh] overflow-y-auto">
              {/* Habit Name */}
              <div>
                <label className="block text-gray-400 mb-1">Habit name</label>
                <input
                  type="text"
                  placeholder='e.g. "Read 30 minutes"'
                  value={habitData.name}
                  onChange={(e) =>
                    setHabitData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={`w-full px-3 py-2 bg-[#121212] border rounded-md focus:outline-none ${
                    errors.name
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#333] focus:border-blue-500"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Categories & Tags */}
              <div className="space-y-4">
                <CategorySelector
                  onChange={(id) =>
                    setHabitData((prev) => ({ ...prev, categoryId: id || "" }))
                  }
                />
                <TagSelector
                  onChange={(ids) =>
                    setHabitData((prev) => ({ ...prev, tagIds: ids }))
                  }
                />
              </div>

              {/* Unit & Target */}
              <div className="grid grid-cols-2 gap-4">
                <UnitSelector
                  value={habitData.unit}
                  onChange={(unit) =>
                    setHabitData((prev) => ({ ...prev, unit }))
                  }
                />
                <div>
                  <label className="block text-gray-400 mb-1">Target</label>
                  <input
                    type="number"
                    value={habitData.targetAmount}
                    onChange={(e) =>
                      setHabitData((prev) => ({
                        ...prev,
                        targetAmount: Number(e.target.value),
                      }))
                    }
                    className={`w-full px-3 py-2 text-center bg-[#121212] border rounded-md focus:outline-none ${
                      errors.targetAmount
                        ? "border-red-500 focus:border-red-500"
                        : "border-[#333] focus:border-blue-500"
                    }`}
                  />
                  {errors.targetAmount && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.targetAmount}
                    </p>
                  )}
                </div>
              </div>

              {/* Repeat rule */}
              <RepeatRuleSelector
                onChange={(rule) =>
                  setHabitData((prev) => ({
                    ...prev,
                    repeatRule: {
                      repeatType: rule?.repeatType,
                      repeatValue: rule.repeatValue,
                    },
                  }))
                }
              />

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <DatePicker
                  label="Start Date"
                  value={habitData.startDate}
                  onChange={(date) =>
                    setHabitData((p) => ({ ...p, startDate: date }))
                  }
                  minToday
                  zIndex={10001}
                  align="left"
                />

                <DatePicker
                  label="End Date"
                  value={habitData.endDate}
                  onChange={(date) =>
                    setHabitData((p) => ({ ...p, endDate: date }))
                  }
                  minToday
                  zIndex={10000}
                  align="right"
                  fromDate={
                    habitData.startDate
                      ? dayjs(habitData.startDate).toDate()
                      : undefined
                  }
                />
                {errors.endDate && (
                  <p className="text-red-500 text-xs mt-1 col-span-2">
                    {errors.endDate}
                  </p>
                )}
              </div>

              {/* Milestones */}
              {/* <MilestoneInput
                onChange={(list) =>
                  setHabitData((prev) => ({ ...prev, milestones: list }))
                }
              /> */}
              <MilestoneInput
                showTarget={habitData.targetAmount > 0} // 👈 nếu habit có target thì hiện cột Target
                onChange={(list) =>
                  setHabitData((prev) => ({ ...prev, milestones: list }))
                }
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#2e2e2e]">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-md hover:bg-[#2a2a2a] text-gray-300"
              >
                Cancel
              </button>

              <ActionButton
                text="Save Habit"
                loading={habitLoading || loading}
                onClick={handleSaveHabit}
                disabled={hasErrors || loading}
                className={`!bg-blue-600 hover:!bg-blue-700 ${
                  hasErrors ? "opacity-50 cursor-not-allowed" : ""
                }`}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
