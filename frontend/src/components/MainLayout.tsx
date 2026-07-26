import { useEffect } from "react";
import { useDashboard } from "../context/DashboardContext";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import HeaderBar from "./HeaderBar";

import {
  fetchHitters,
  fetchPitchers,
  fetchNewPlayersList,
  fetchCurrentPlayersList,
} from "../services/api";
import type { Player } from "../types/player";
import type { Hitter } from "../types/hitter";
import type { Pitcher } from "../types/pitcher";

function MainLayout() {
  const {
    currentPlayers,
    setCurrentPlayers,
    setNewPlayers,
    setHitters,
    setPitchers,
    isMobile,
  } = useDashboard();

  useEffect(() => {
    fetchCurrentPlayersList()
      .then((players: Player[]) => setCurrentPlayers(players))
      .catch((err: Error) => console.error(err.message));

    fetchNewPlayersList()
      .then((players: Player[]) => setNewPlayers(players))
      .catch((err: Error) => console.error(err.message));
  }, []);

  useEffect(() => {
    fetchHitters()
      .then((hitterData: Hitter[]) => setHitters(hitterData))
      .catch((err: Error) => console.error(err.message));
    fetchPitchers()
      .then((pitchersData: Pitcher[]) => setPitchers(pitchersData))
      .catch((err: Error) => console.error(err.message));
  }, [currentPlayers]);

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100vw",
        boxSizing: "border-box",
      }}
    >
      <HeaderBar />

      <Box
        sx={{
          mt: isMobile ? 1 : 0,
          pb: 2,
          width: "100%",
          flex: 1,
          overflowY: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default MainLayout;
