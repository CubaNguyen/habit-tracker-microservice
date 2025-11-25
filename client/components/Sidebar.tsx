"use client";
import UserMenu from "@/app/dashboard/components/UserMenu";
import { useState } from "react";

const menu = [
  { title: "All Habits", icon: "📘" },
  { title: "Morning", icon: "🌅" },
  { title: "Afternoon", icon: "🌞" },
  { title: "Evening", icon: "🌙" },
  { title: "New Area", icon: "➕" },
];

export default function Sidebar() {
  const [active, setActive] = useState("All Habits");

  return (
    <div className="p-4 flex flex-col gap-2 text-sm">
      <div className="font-bold text-lg mb-4 rounded">
        <UserMenu />
      </div>
      {menu.map((item) => (
        <button
          key={item.title}
          onClick={() => setActive(item.title)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all duration-150 ${
            active === item.title
              ? "bg-blue-600 text-white"
              : "hover:bg-base-300 text-gray-300"
          }`}
        >
          <span>{item.icon}</span>
          {item.title}
        </button>
      ))}

      <div className="mt-auto pt-6 border-t border-base-300 text-xs text-gray-400">
        Preferences
        <div className="flex flex-col gap-1 mt-2">
          <button className="hover:text-white text-gray-400">
            ⚙ App Settings
          </button>
          <button className="hover:text-white text-gray-400">💳 Payment</button>
          <button className="hover:text-white text-gray-400">
            📤 Resources
          </button>
        </div>
      </div>
    </div>
  );
}
