import { useState, type SetStateAction } from "react";
import { Link, Outlet } from "react-router-dom";
import { Box, Tab, Tabs } from "@mui/material";

function MainLayout() {
  const getActiveTab = () => {
    if (location.pathname.startsWith("/pitchers")) return 1;
    return 0;
  };

  const [tab, setTab] = useState(getActiveTab());

  const handleTabChange = (
    event: React.SyntheticEvent,
    newTab: SetStateAction<number>,
  ) => {
    setTab(newTab);
  };

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
