"use client";
import TopBar from "@/components/TopBar";
import HabitGrid from "@/app/dashboard/components/HabitGrid";
import { useView } from "./context/ViewContext";
import HabitList from "@/app/dashboard/components/HabitList";

export default function DashboardPage() {
  const { view } = useView();
  return (
    <div className="flex flex-col h-[90vh] min-h-0">
      <div className="flex-1 ">
        {view === "grid" ? <HabitGrid /> : <HabitList />}
      </div>
    </div>
  );
}
