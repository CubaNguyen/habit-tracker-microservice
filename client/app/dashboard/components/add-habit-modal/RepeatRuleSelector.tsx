"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type RepeatType = "DAILY" | "WEEKLY" | "MONTHLY" | "CUSTOM";

interface RepeatRule {
  repeatType: RepeatType;
  repeatValue: string | null; // JSON string (BE yêu cầu)
}

interface Props {
  onChange: (rule: RepeatRule) => void;
}

export default function RepeatRuleSelector({ onChange }: Props) {
  const [onDays, setOnDays] = useState(1);
  const [offDays, setOffDays] = useState(0);

  const [type, setType] = useState<RepeatType>("DAILY");
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState<string[]>([]);
  const [dates, setDates] = useState<number[]>([]);
  const [pattern, setPattern] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [datesInput, setDatesInput] = useState("");

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const options: RepeatType[] = ["DAILY", "WEEKLY", "MONTHLY", "CUSTOM"];

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const emit = (rule: RepeatRule) => {
    onChange(rule);
  };
  function parsePatternToCycle(pattern: string): number[] {
    const regex = /(\d+)\s*on\s*(\d+)\s*off/i;
    const match = pattern.match(regex);

    if (!match) return []; // hoặc throw error

    const on = parseInt(match[1], 10);
    const off = parseInt(match[2], 10);

    return [...Array(on).fill(1), ...Array(off).fill(0)];
  }

  const handleTypeChange = (newType: RepeatType) => {
    setType(newType);
    setDays([]);
    setDates([]);
    setPattern("");
    setOpen(false);

    emit({
      repeatType: newType,
      repeatValue: null,
    });
  };

  // WEEKLY
  const toggleDay = (day: string) => {
    const newDays = days.includes(day)
      ? days.filter((d) => d !== day)
      : [...days, day];

    setDays(newDays);

    emit({
      repeatType: "WEEKLY",
      repeatValue: JSON.stringify({ days: newDays }),
    });
  };

  // MONTHLY
  const handleDatesChange = (value: string) => {
    setDatesInput(value); // cho user gõ thoải mái

    // convert thành array số để emit ra ngoài
    const nums = value
      .split(",")
      .map((v) => parseInt(v.trim()))
      .filter((v) => !isNaN(v) && v >= 1 && v <= 31);

    emit({
      repeatType: "MONTHLY",
      repeatValue: JSON.stringify({ dates: nums }),
    });
  };

  // CUSTOM
  const handlePatternChange = (value: string) => {
    setPattern(value);

    const cycle = parsePatternToCycle(value);

    emit({
      repeatType: "CUSTOM",
      repeatValue: JSON.stringify({ cycle }),
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-gray-400 mb-1">Repeat</label>
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between px-3 py-2 bg-[#121212] border border-[#333] rounded-md cursor-pointer hover:border-blue-500"
      >
        <span className="capitalize text-sm text-gray-100">{type}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>
      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 w-full mt-2 bg-[#1c1c1c] border border-[#333] rounded-lg shadow-lg">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => handleTypeChange(opt)}
              className={`px-3 py-2 cursor-pointer text-sm ${
                opt === type
                  ? "bg-blue-600/30 text-blue-300"
                  : "text-gray-200 hover:bg-[#2a2a2a]"
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
      {/* WEEKLY UI */}
      {type === "WEEKLY" && (
        <div className="mt-2 flex flex-wrap gap-2">
          {weekDays.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`px-3 py-1 rounded-md border text-sm ${
                days.includes(day)
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-[#1a1a1a] border-[#333] text-gray-300 hover:bg-[#222]"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      )}
      {/* MONTHLY UI */}
      {type === "MONTHLY" && (
        <div className="mt-2">
          <label className="block text-gray-400 mb-1 text-sm">
            Days (1–31, comma-separated)
          </label>
          <input
            type="text"
            placeholder="e.g. 1, 15, 30"
            value={datesInput}
            onChange={(e) => handleDatesChange(e.target.value)}
            className="w-full px-3 py-2 bg-[#121212] border border-[#333] rounded-md text-gray-100"
          />
        </div>
      )}
      {/* CUSTOM UI */}
      {type === "CUSTOM" && (
        <div className="mt-2 space-y-2">
          <div>
            <label className="block text-gray-400 mb-1 text-sm">On days</label>
            <input
              type="number"
              min={1}
              value={onDays}
              onChange={(e) => {
                const on = Number(e.target.value);
                setOnDays(on);

                const cycle = [...Array(on).fill(1), ...Array(offDays).fill(0)];

                emit({
                  repeatType: "CUSTOM",
                  repeatValue: JSON.stringify({ cycle }),
                });
              }}
              className="w-full px-3 py-2 bg-[#121212] border border-[#333] rounded-md text-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1 text-sm">Off days</label>
            <input
              type="number"
              min={0}
              value={offDays}
              onChange={(e) => {
                const off = Number(e.target.value);
                setOffDays(off);

                const cycle = [...Array(onDays).fill(1), ...Array(off).fill(0)];

                emit({
                  repeatType: "CUSTOM",
                  repeatValue: JSON.stringify({ cycle }),
                });
              }}
              className="w-full px-3 py-2 bg-[#121212] border border-[#333] rounded-md text-gray-100"
            />
          </div>

          <div className="text-xs text-gray-500">
            Preview:{" "}
            {[...Array(onDays).fill("ON"), ...Array(offDays).fill("OFF")].join(
              " · "
            )}
          </div>
        </div>
      )}
    </div>
  );
}
