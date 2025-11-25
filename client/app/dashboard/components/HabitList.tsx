// "use client";

// import { useState } from "react";
// import { ChevronDown } from "lucide-react";

// export default function HabitList() {
//   const [habits] = useState([
//     { id: 1, icon: "🏃‍♂️", name: "Running", progress: "1 / 1 kg" },
//     { id: 2, icon: "🗝️", name: "Set a To-do List", progress: "1 / 1 times" },
//   ]);

//   return (
//     <div className="flex flex-col h-full bg-base-100 text-base-content">
//       {/* 🧭 Header */}
//       <div className="flex items-center justify-between px-6 py-3 border-b">
//         <button className="flex items-center gap-1 text-sm font-medium hover:opacity-80 transition">
//           <span>Today</span>
//           <ChevronDown size={16} className="opacity-60" />
//         </button>

//         <button className="opacity-70 hover:opacity-100 transition">
//           <span className="text-sm">☰</span>
//         </button>
//       </div>

//       {/* 🧩 Section Title */}
//       <div className="px-6 py-2 border-b">
//         <h3 className="text-sm font-semibold opacity-80">2 Success</h3>
//       </div>

//       {/* 📋 Habit Items */}
//       <div className="flex-1 overflow-y-auto">
//         {habits.map((habit, i) => (
//           <div
//             key={habit.id}
//             className={`flex items-center justify-between px-6 py-3 ${
//               i < habits.length - 1 ? "border-b" : ""
//             }`}
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-6 h-6 flex items-center justify-center text-lg opacity-80">
//                 {habit.icon}
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-sm font-medium">{habit.name}</span>
//                 <span className="text-xs opacity-60">{habit.progress}</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useHabitList } from "../context/HabitListContext";

export default function HabitList() {
  const { habits, loading } = useHabitList(); // 👈 dailyHabits → habits
  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-6">
      {/* TODAY */}
      <Section title="Today" items={habits.today} />

      {/* COMPLETED */}
      {habits.completed.length > 0 && (
        <Section title="Completed" items={habits.completed} />
      )}

      {/* FAILED */}
      {habits.failed.length > 0 && (
        <Section title="Failed" items={habits.failed} />
      )}

      {/* SKIPPED */}
      {habits.skipped.length > 0 && (
        <Section title="Skipped" items={habits.skipped} />
      )}
    </div>
  );
}

// ===============================
// SECTION COMPONENT
// ===============================

interface SectionProps {
  title: string;
  items: any[];
}

function Section({ title, items }: SectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <div>
      <div className="font-semibold text-neutral-200 mb-2">{title}</div>

      <div className="space-y-2">
        {items.map((h) => (
          <HabitItem key={h.habitId} habit={h} />
        ))}
      </div>
    </div>
  );
}

// ===============================
// HABIT ITEM COMPONENT
// ===============================

function HabitItem({ habit }: { habit: any }) {
  return (
    <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 flex justify-between items-center">
      <div className="flex flex-col">
        <div className="font-semibold">{habit.name}</div>

        {habit.unit && (
          <div className="text-neutral-400 text-sm">
            {habit.targetAmount
              ? `${habit.targetAmount} ${habit.unit}`
              : habit.unit}
          </div>
        )}
      </div>

      <button className="px-3 py-1 bg-blue-600 rounded-lg text-sm hover:bg-blue-700 transition">
        Log
      </button>
    </div>
  );
}
