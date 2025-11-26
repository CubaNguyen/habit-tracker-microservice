"use client";
import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import dayjs from "dayjs";

interface CalendarPopupProps {
  value: Date;
  onChange: (date: Date) => void;
  zIndex?: number;
  align?: "left" | "right";
  fromDate?: Date;
  toDate?: Date;
}

export default function CalendarPopup({
  value,
  onChange,
  zIndex = 10000,
  align = "left",
  fromDate,
  toDate,
}: CalendarPopupProps) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const selected = value ?? undefined;

  // đóng popup khi click ra ngoài
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
    <div className="relative inline-block" ref={pickerRef}>
      {/* Nút mở lịch */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-xl font-semibold flex items-center gap-2"
      >
        <span>
          {dayjs(value).isSame(dayjs(), "day")
            ? "Today"
            : dayjs(value).format("DD/MM/YYYY")}
        </span>
        <span className="text-gray-400 text-sm">▼</span>
      </button>

      {/* Popup calendar */}
      {open && (
        <div
          className="absolute bg-[#1c1c1c] border border-[#333] rounded-xl shadow-2xl p-3 animate-fadeIn"
          style={{
            zIndex,
            top: "calc(100% + 6px)",
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
                onChange(date);
                setOpen(false);
              }
            }}
            fromDate={fromDate}
            toDate={toDate}
            disabled={[
              ...(fromDate ? [{ before: fromDate }] : []),
              ...(toDate ? [{ after: toDate }] : []),
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
