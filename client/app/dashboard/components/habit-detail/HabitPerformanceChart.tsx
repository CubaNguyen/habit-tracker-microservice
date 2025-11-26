"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Rectangle,
} from "recharts";
import dayjs from "dayjs";

export default function HabitPerformanceChart({ history }: { history: any[] }) {
  const chartData = history
    .map((h) => ({
      date: dayjs(h.date).format("MMM DD"),
      complete: h.status === "COMPLETE" ? 1 : 0,
      skip: h.status === "SKIP" ? 1 : 0,
      fail: h.status === "FAIL" ? 1 : 0,
    }))
    .reverse(); // đảo lại để ngày cũ trước, ngày mới sau

  return (
    <div className="w-full h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barGap={6}>
          <XAxis dataKey="date" stroke="#666" fontSize={11} />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: "#111",
              border: "1px solid #333",
              borderRadius: 8,
            }}
          />
          <Legend />

          <Bar
            dataKey="complete"
            name="Complete"
            fill="#4ade80" // green-400
            activeBar={<Rectangle fill="#22c55e" stroke="#22c55e" />}
          />
          <Bar
            dataKey="skip"
            name="Skip"
            fill="#facc15" // yellow-400
            activeBar={<Rectangle fill="#eab308" stroke="#eab308" />}
          />
          <Bar
            dataKey="fail"
            name="Fail"
            fill="#ef4444" // red-400
            activeBar={<Rectangle fill="#dc2626" stroke="#dc2626" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
