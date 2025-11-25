"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Plus } from "lucide-react";

const PRESET_UNITS = [
  "times",
  "minutes",
  "hours",
  "km",
  "pages",
  "cups",
  "steps",
  "calories",
  "liters",
  "sessions",
];

export default function UnitSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (unit: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 👉 Click ra ngoài thì đóng dropdown
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setCustomMode(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-gray-400 mb-1">Unit</label>

      {/* Nút mở dropdown */}
      <div
        className="flex items-center justify-between px-3 py-2 bg-[#121212] border border-[#333] rounded-md cursor-pointer hover:border-blue-500 transition"
        onClick={() => setOpen(!open)}
      >
        <span
          className={`text-sm ${value ? "text-gray-100" : "text-gray-500"}`}
        >
          {value || "Select unit..."}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 w-full mt-2 bg-[#1c1c1c] border border-[#333] rounded-lg shadow-xl animate-fadeIn">
          {!customMode ? (
            <>
              {PRESET_UNITS.map((unit) => (
                <div
                  key={unit}
                  onClick={() => {
                    onChange(unit);
                    setOpen(false);
                  }}
                  className={`px-3 py-2 cursor-pointer text-sm hover:bg-[#2a2a2a] ${
                    value === unit
                      ? "bg-blue-600/30 text-blue-300"
                      : "text-gray-200"
                  }`}
                >
                  {unit}
                </div>
              ))}

              <div
                onClick={() => setCustomMode(true)}
                className="px-3 py-2 text-blue-400 cursor-pointer hover:bg-[#2a2a2a] flex items-center gap-1"
              >
                <Plus size={14} /> Other...
              </div>
            </>
          ) : (
            <div className="p-3 border-t border-[#333]">
              <input
                type="text"
                placeholder="Enter custom unit..."
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && customValue.trim()) {
                    onChange(customValue.trim());
                    setCustomValue("");
                    setCustomMode(false);
                    setOpen(false);
                  }
                  if (e.key === "Escape") {
                    setCustomMode(false);
                  }
                }}
                className="w-full px-3 py-2 bg-[#121212] border border-[#333] rounded-md text-gray-100 focus:border-blue-500 focus:outline-none text-sm"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                Press <span className="text-blue-400">Enter</span> to confirm or{" "}
                <span className="text-blue-400">Esc</span> to cancel
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
