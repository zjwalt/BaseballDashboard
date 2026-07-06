import { useState, type SetStateAction } from "react";
import { useDashboard } from "../context/DashboardContext";
import { Link } from "react-router-dom";
import { Autocomplete, Box, Button, Stack, Tab, Tabs } from "@mui/material";

import AddPlayers from "./AddPlayers";

function HeaderBar() {
  const { hitters, tab, setTab } = useDashboard();

  const handleTabChange = (
    event: React.SyntheticEvent,
    newTab: SetStateAction<number>,
  ) => {
    setTab(newTab);
  };

  return (
    <Stack
      direction="row"
      sx={{ display: "flex", justifyContent: "space-between" }}
    >
      <Box>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 1,
            padding: 0.5,
            height: 6,
            width: "fit-content",
            "& .MuiTab-root": {
              minHeight: 36,
              borderRadius: 1,
              textTransform: "none",
              fontWeight: 600,
              fontSize: 13,
              color: "text.disabled",
              transition: "all 0.15s",
            },
            "& .Mui-selected": {
              backgroundColor: "background.default",
              color: "primary.main",
            },
          }}
        >
          <Tab
            label="Hitters"
            component={Link}
            to="/hitters"
            sx={{ minHeight: 6 }}
          />
          <Tab
            label="Pitchers"
            component={Link}
            to="/pitchers"
            sx={{ minHeight: 6 }}
          />
        </Tabs>
      </Box>

      <Box>
        <AddPlayers />
      </Box>
    </Stack>
  );
}

export default HeaderBar;
