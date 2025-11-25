"use client";
import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import dayjs from "dayjs";

interface Props {
  label: string;
  value: string;
  onChange: (date: string) => void;
  minToday?: boolean;
  zIndex?: number;
  align?: "left" | "right"; // 🆕 thêm dòng này
  fromDate?: Date; // ✅ thêm
  toDate?: Date;
}

export default function DatePicker({
  label,
  value,
  onChange,
  minToday = false,
  zIndex = 10000,
  align = "right",
  fromDate, // ✅ nhận vào
  toDate,
}: Props) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const today = dayjs().startOf("day").toDate();
  const selected = value ? dayjs(value).toDate() : undefined;
  const lowerBound =
    (minToday ? today : undefined) && fromDate
      ? (minToday ? today : undefined)! > fromDate
        ? (minToday ? today : undefined)!
        : fromDate
      : minToday
      ? today
      : fromDate;

  const upperBound = toDate;
  // 👉 Đóng popup khi click ra ngoài
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={pickerRef}>
      <label className="block text-gray-400 mb-1">{label}</label>

      {/* 🔹 Nút mở lịch */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between px-3 py-2 bg-[#121212] border border-[#333] rounded-md cursor-pointer hover:border-blue-500 transition"
      >
        <span
          className={`text-sm ${value ? "text-gray-100" : "text-gray-500"}`}
        >
          {value ? dayjs(value).format("DD/MM/YYYY") : "Select date..."}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-4 h-4 text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>

      {/* 🔹 Calendar popup */}
      {open && (
        <div
          className="absolute bg-[#1c1c1c] border border-[#333] rounded-xl shadow-2xl p-3 animate-fadeIn"
          style={{
            zIndex,
            top: "calc(100% + 4px)", // ✅ nằm ngay dưới input
            left: align === "left" ? 0 : undefined,
            right: align === "right" ? 0 : undefined,
            minWidth: "260px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (date) {
                onChange(dayjs(date).format("YYYY-MM-DD"));
                setOpen(false);
              }
            }}
            fromDate={lowerBound}
            toDate={upperBound}
            disabled={[
              ...(lowerBound ? [{ before: lowerBound }] : []),
              ...(upperBound ? [{ after: upperBound }] : []),
            ]}
            pagedNavigation
            showOutsideDays={false}
            captionLayout="dropdown"
            styles={{
              caption_label: { color: "#e5e5e5", fontWeight: 600 },
              head_cell: { color: "#999" },
              day: {
                color: "#ccc",
                borderRadius: "6px",
                padding: "7px",
                margin: "1px",
              },
              day_selected: { backgroundColor: "#2563eb", color: "#fff" },
              day_disabled: { color: "#555", cursor: "not-allowed" },
              nav_button: { color: "#ccc" },
              table: { margin: "0 auto" },
            }}
          />
        </div>
      )}
    </div>
  );
}
