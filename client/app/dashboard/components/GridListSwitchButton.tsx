"use client";

import { useState } from "react";
import { LayoutGrid, List, Search, X } from "lucide-react";
import { useView } from "@/app/dashboard/context/ViewContext";

export default function GridListSwitchButton() {
  const { view, setView } = useView();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleViewChange = (newView: "grid" | "list") => {
    console.log("🚀 ~ handleViewChange ~ newView:", newView);
    setView(newView);
  };

  return (
    <div className="relative">
      {!isSearchOpen && (
        <div className="flex items-center gap-1 bg-[#2a2a2a] rounded-full px-2 py-1 shadow-md transition-all">
          <button
            onClick={() => handleViewChange("grid")}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-all ${
              view === "grid"
                ? "bg-[#171717] text-white shadow-inner"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <LayoutGrid size={16} />
            Grid
          </button>

          <button
            onClick={() => handleViewChange("list")}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-all ${
              view === "list"
                ? "bg-[#171717] text-white shadow-inner"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <List size={16} />
            List
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="px-3 py-1 text-gray-400 hover:text-white rounded-full transition-all"
          >
            <Search size={16} />
          </button>
        </div>
      )}

      {isSearchOpen && (
        <div className="flex items-center gap-2 bg-[#2a2a2a] rounded-full px-4 py-2 shadow-md w-[300px] sm:w-[420px] transition-all">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="bg-transparent flex-1 text-sm text-white outline-none placeholder-gray-500"
          />
          <button
            onClick={() => {
              setIsSearchOpen(false);
              setQuery("");
            }}
            className="text-gray-400 hover:text-white transition-all"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
