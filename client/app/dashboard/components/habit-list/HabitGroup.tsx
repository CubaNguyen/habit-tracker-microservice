"use client";

import { ChevronRight } from "lucide-react";
import type { HabitListGroupProps } from "./types";

export default function HabitGroup({
  title,
  color,
  list,
  open,
  groupKey,
  toggle,
  renderItem,
}: HabitListGroupProps) {
  if (list.length === 0) return null;

  return (
    <div className="space-y-2">
      <button
        onClick={() => toggle(groupKey)}
        className="flex items-center gap-2 text-sm font-medium mb-1 opacity-80"
      >
        <ChevronRight
          size={16}
          className={`transition-transform ${open ? "rotate-90" : ""}`}
        />
        <span className={color}>
          {list.length} {title}
        </span>
      </button>

      {open && <div className="space-y-3">{list.map(renderItem)}</div>}
    </div>
  );
}
