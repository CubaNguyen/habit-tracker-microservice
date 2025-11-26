"use client";
import { useState } from "react";
import { Plus, Trash } from "lucide-react";
import type { Milestone } from "@/lib/types/habit/milestone";

interface MilestoneInputProps {
  onChange?: (milestones: Milestone[]) => void;
  showTarget?: boolean;
}

export default function MilestoneInput({
  onChange,
  showTarget = true,
}: MilestoneInputProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestone, setNewMilestone] = useState<Milestone>({
    name: "",
    target_amount: undefined,
  });

  // Cập nhật danh sách và báo lên cha
  const updateMilestones = (newList: Milestone[]) => {
    setMilestones(newList);
    onChange?.(newList);
  };

  // Thêm milestone
  const handleAdd = () => {
    if (!newMilestone.name.trim()) return;
    updateMilestones([...milestones, newMilestone]);
    setNewMilestone({ name: "", target_amount: undefined });
  };

  // Xóa milestone
  const handleDelete = (index: number) => {
    const updated = milestones.filter((_, i) => i !== index);
    updateMilestones(updated);
  };

  return (
    <div>
      <label className="block text-gray-400 mb-2">Milestones (optional)</label>

      {/* Danh sách hiện tại */}
      {milestones.length === 0 ? (
        <div className="text-gray-500 text-sm italic mb-2">
          No milestones added
        </div>
      ) : (
        <div className="flex flex-col gap-2 mb-3">
          {milestones.map((m, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-[#2a2a2a] px-3 py-2 rounded-md"
            >
              <div>
                <span className="font-medium">{m.name}</span>
                {showTarget && m.target_amount !== undefined && (
                  <span className="text-gray-400 ml-2">
                    ({m.target_amount})
                  </span>
                )}
              </div>
              <Trash
                size={16}
                className="text-gray-400 cursor-pointer hover:text-red-400"
                onClick={() => handleDelete(i)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Ô nhập mới */}
      <div
        className={`grid ${
          showTarget ? "grid-cols-[1fr_100px_auto]" : "grid-cols-[1fr_auto]"
        } gap-2`}
      >
        {/* Name input */}
        <input
          type="text"
          value={newMilestone.name}
          onChange={(e) =>
            setNewMilestone((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder={
            showTarget ? 'e.g. "Mốc 1 – 25km"' : 'e.g. "Hoàn thành tuần 1"'
          }
          className="px-3 py-2 bg-[#121212] border border-[#333] rounded-md focus:border-blue-500 focus:outline-none text-gray-100 text-sm"
        />

        {/* Target input (ẩn nếu showTarget = false) */}
        {showTarget && (
          <input
            type="number"
            value={newMilestone.target_amount ?? ""}
            onChange={(e) =>
              setNewMilestone((prev) => ({
                ...prev,
                target_amount: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              }))
            }
            placeholder="Target"
            className="px-3 py-2 bg-[#121212] border border-[#333] rounded-md focus:border-blue-500 focus:outline-none text-gray-100 text-sm text-center"
          />
        )}

        {/* Add button */}
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-1 text-blue-500 hover:underline text-sm whitespace-nowrap"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      {/* Gợi ý nhỏ */}
      <p className="text-gray-500 text-xs mt-2">
        {showTarget
          ? "Target is optional — leave blank if this milestone is just a note."
          : "You can add simple milestones without target values."}
      </p>
    </div>
  );
}
