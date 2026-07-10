import { useDashboard } from "../context/DashboardContext";
import { useEffect } from "react";
import { fetchHitters } from "../services/api";
import { Box, Stack, Typography } from "@mui/material";

import type { Hitter } from "../types/hitter";
import { PlayerContainer } from "../components";

function HittersPage() {
  const { hitters, currentPlayers, setHitters } = useDashboard();

  useEffect(() => {
    fetchHitters()
      .then((hitterData: Hitter[]) => {
        setHitters(hitterData);
      })
      .catch((err: Error) => console.error(err.message));
  }, [currentPlayers]);

  const piratesHitters = hitters.filter(
    (hitter: Hitter) => hitter.team === "PIT",
  );
  const otherHitters = hitters.filter(
    (hitter: Hitter) => hitter.team !== "PIT",
  );

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        height: "100%",
        width: "100%",
      }}
    >
      <Stack direction="column" spacing={3} sx={{ width: "100%" }}>
        <Stack
          direction="column"
          sx={{
            width: "100%",
            pr: 3,
          }}
        >
          <Typography variant="h5">Pittsburgh Pirates</Typography>
          <PlayerContainer hitters={hitters} />
        </Stack>
        <Stack
          direction="column"
          sx={{
            width: "100%",
            pr: 3,
          }}
        >
          <Typography variant="h5">Other Players</Typography>
          <PlayerContainer hitters={otherHitters} />
        </Stack>
      </Stack>
    </Box>
  );
}

export default HittersPage;
