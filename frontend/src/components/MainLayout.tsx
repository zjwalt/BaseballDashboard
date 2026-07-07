import { useEffect, useState, type SetStateAction } from "react";
import { useDashboard } from "../context/DashboardContext";
import { Link, Outlet } from "react-router-dom";
import { Box, Tab, Tabs } from "@mui/material";
import HeaderBar from "./HeaderBar";

import { fetchNewPlayersList, fetchCurrentPlayersList } from "../services/api";
import type { Player } from "../types/player";

function MainLayout() {
  const { currentPlayers, newPlayers, setCurrentPlayers, setNewPlayers } =
    useDashboard();

  useEffect(() => {
    fetchCurrentPlayersList()
      .then((currentPlayers: Player[]) => {
        setCurrentPlayers(currentPlayers);
      })
      .catch((err: Error) => console.error(err.message));

    fetchNewPlayersList()
      .then((players: Player[]) => {
        setNewPlayers(players);
      })
      .catch((err: Error) => console.error(err.message));
  }, []);

  const getActiveTab = () => {
    if (location.pathname.startsWith("/pitchers")) return 1;
    return 0;
  };

  const [tab, setTab] = useState(getActiveTab());

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
      }}
    >
      <HeaderBar />

      <Box
        sx={{
          height: `calc(100vh - 48px)`,
          width: "100%",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default MainLayout;
