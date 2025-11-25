"use client";

import { createContext, useContext, useState } from "react";

type ViewType = "grid" | "list";

interface ViewContextProps {
  view: ViewType;
  setView: (v: ViewType) => void;
}

const ViewContext = createContext<ViewContextProps | undefined>(undefined);

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<ViewType>("grid");
  return (
    <ViewContext.Provider value={{ view, setView }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  const ctx = useContext(ViewContext);
  if (!ctx) throw new Error("useView must be used inside ViewProvider");
  return ctx;
}
