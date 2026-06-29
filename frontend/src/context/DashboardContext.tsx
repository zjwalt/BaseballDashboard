import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

import type { Hitter } from "../types/hitter";

interface DashboardContextProps {
  hitters: Hitter[];
  setHitters: React.Dispatch<React.SetStateAction<Hitter[]>>;
}

const DashboardContext = createContext<DashboardContextProps | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [hitters, setHitters] = useState<Hitter[]>([]);

  const value = {
    hitters,
    setHitters,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextProps {
  const ctx = useContext(DashboardContext);
  if (!ctx)
    throw new Error("useDashboard must be used within a DashboardProvider");
  return ctx;
}
