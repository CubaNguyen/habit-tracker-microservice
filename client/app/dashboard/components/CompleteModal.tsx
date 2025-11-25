// "use client";

// import { useState } from "react";
// import { useHabitGrid } from "../context/HabitGridContext";

// export default function CompleteModal({ isOpen, onClose }: any) {
//   const { selectedCell, habits, executeAction } = useHabitGrid();
//   const [value, setValue] = useState("");
//   const [notes, setNotes] = useState("");

//   if (!isOpen || !selectedCell) return null;

//   const habit = habits.find((h) => h.habitId === selectedCell.habitId);

//   const handleConfirm = () => {
//     executeAction("complete", {
//       progressValue: Number(value) || 0,
//       notes: notes || undefined,
//     });
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
//       <div
//         className="
//         w-[420px]
//         bg-base-200
//         rounded-xl
//         border border-base-300
//         shadow-2xl
//         p-6
//         animate-fadeIn
//       "
//       >
//         {/* Title */}
//         <h2 className="text-lg font-semibold mb-1">Hoàn thành mục tiêu</h2>

//         {/* Habit name + date */}
//         <p className="text-sm opacity-80 mb-5">
//           <span className="font-medium">{habit?.name}</span>
//           <span className="mx-1">•</span>
//           <span className="opacity-70">{selectedCell.date}</span>
//         </p>

//         {/* Input: progress value */}
//         <label className="text-sm font-medium">Nhập số lượng hoàn thành</label>
//         <input
//           type="number"
//           value={value}
//           onChange={(e) => setValue(e.target.value)}
//           placeholder={`e.g. ${habit?.targetAmount}`}
//           className="
//     w-full mt-1 mb-4 px-3 py-2
//     rounded-lg border border-base-300
//     bg-base-100 text-base-content
//     focus:outline-none focus:ring-2 focus:ring-blue-500
//   "
//         />

//         {/* Input: notes */}
//         <label className="text-sm font-medium flex justify-between">
//           Ghi chú
//           <span className="opacity-50 text-xs">(tuỳ chọn)</span>
//         </label>
//         <textarea
//           value={notes}
//           onChange={(e) => setNotes(e.target.value)}
//           placeholder="Nhập ghi chú…"
//           className="
//     w-full mt-1 h-24 px-3 py-2
//     rounded-lg border border-base-300
//     bg-base-100 text-base-content
//     resize-none
//     focus:outline-none focus:ring-2 focus:ring-blue-500
//   "
//         />

//         {/* Buttons */}
//         <div className="flex justify-end gap-3 mt-6">
//           <button
//             onClick={onClose}
//             className="
//             px-4 py-2 rounded-lg text-sm
//             bg-base-300 hover:bg-base-300/80
//             transition
//           "
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleConfirm}
//             className="
//             px-4 py-2 rounded-lg
//             bg-blue-600 text-white
//             text-sm font-medium
//             hover:bg-blue-700
//             transition shadow
//           "
//           >
//             Confirm
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useHabitGrid } from "../context/HabitGridContext";
import ActionButton from "@/components/common/ActionButton";

export default function CompleteModal({ isOpen, onClose }: any) {
  const { selectedCell, habits, executeAction } = useHabitGrid();
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !selectedCell) return null;

  const habit = habits?.find((h) => h.habitId === selectedCell.habitId);

  // ⬇️ Close + reset state
  const handleClose = () => {
    setValue("");
    setNotes("");
    setLoading(false);
    onClose();
  };

  const handleConfirm = async () => {
    if (!value) return;

    setLoading(true);

    await executeAction("complete", {
      progressValue: Number(value),
      notes: notes || undefined,
    });

    setLoading(false);
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div
        className="
        w-[420px]
        bg-base-200 
        rounded-xl 
        border border-base-300 
        shadow-2xl 
        p-6
        animate-fadeIn
      "
      >
        {/* Title */}
        <h2 className="text-lg font-semibold mb-1">Hoàn thành mục tiêu</h2>

        {/* Habit name + date */}
        <p className="text-sm opacity-80 mb-5">
          <span className="font-medium">{habit?.name}</span>
          <span className="mx-1">•</span>
          <span className="opacity-70">{selectedCell.date}</span>
        </p>

        {/* Input: progress */}
        <label className="text-sm font-medium">Nhập số lượng hoàn thành</label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`e.g. ${habit?.targetAmount}`}
          className="
            w-full mt-1 mb-4 px-3 py-2
            rounded-lg border border-base-300
            bg-base-100 text-base-content
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        />

        {/* Notes */}
        <label className="text-sm font-medium flex justify-between">
          Ghi chú
          <span className="opacity-50 text-xs">(tuỳ chọn)</span>
        </label>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Nhập ghi chú…"
          className="
            w-full mt-1 h-24 px-3 py-2
            rounded-lg border border-base-300
            bg-base-100 text-base-content
            resize-none
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleClose}
            className="
              px-4 py-2 rounded-lg text-sm
              bg-base-300 hover:bg-base-300/80
              transition
            "
          >
            Cancel
          </button>

          {/* ⭐ ActionButton dùng ở đây */}
          <ActionButton
            text="Confirm"
            loading={loading}
            disabled={!value} // ⬅️ Disable khi value rỗng
            onClick={handleConfirm}
            className="w-auto px-5"
          />
        </div>
      </div>
    </div>
  );
}
