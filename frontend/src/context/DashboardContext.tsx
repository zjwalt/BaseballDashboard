import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

import type { Hitter } from "../types/hitter";
import type { Player } from "../types/player";
import type { Pitcher } from "../types/pitcher";

interface DashboardContextProps {
  currentPlayers: Player[];
  setCurrentPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  newPlayers: Player[];
  setNewPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  hitters: Hitter[];
  setHitters: React.Dispatch<React.SetStateAction<Hitter[]>>;
  pitchers: Pitcher[];
  setPitchers: React.Dispatch<React.SetStateAction<Pitcher[]>>;
  tab: number;
  setTab: React.Dispatch<React.SetStateAction<number>>;
  openOrderDialog: boolean;
  setOpenOrderDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardContext = createContext<DashboardContextProps | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [hitters, setHitters] = useState<Hitter[]>([]);
  const [pitchers, setPitchers] = useState<Pitcher[]>([]);
  const [newPlayers, setNewPlayers] = useState<Player[]>([]);
  const [currentPlayers, setCurrentPlayers] = useState<Player[]>([]);
  const [openOrderDialog, setOpenOrderDialog] = useState<boolean>(false);

  const getActiveTab = () => {
    if (location.pathname.startsWith("/pitchers")) return 1;
    return 0;
  };

  const [tab, setTab] = useState(getActiveTab());

  const value = {
    currentPlayers,
    setCurrentPlayers,
    newPlayers,
    setNewPlayers,
    hitters,
    setHitters,
    pitchers,
    setPitchers,
    tab,
    setTab,
    openOrderDialog,
    setOpenOrderDialog
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
