import { useDashboard } from "../context/DashboardContext";
import { useEffect } from "react";
import { fetchHitters } from "../services/api";
import { Box, Button, IconButton, Stack, Tooltip, Typography } from "@mui/material";

import type { Hitter } from "../types/hitter";
import { PlayerContainer, EditPlayerOrderDialog } from "../components";

import EditIcon from '@mui/icons-material/Edit';

function HittersPage() {
  const { hitters, currentPlayers, openOrderDialog, setHitters, setOpenOrderDialog } = useDashboard();

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
          <Stack direction='row' spacing={2} sx={{ alignItems: 'center' }}>
            <Typography variant="h5">Pittsburgh Pirates</Typography>
            <Tooltip title='Edit Player Order'>
              <IconButton size='small' onClick={() => setOpenOrderDialog(true)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <PlayerContainer hitters={piratesHitters} />
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

      <EditPlayerOrderDialog open={openOrderDialog} onClose={() => setOpenOrderDialog(false)} players={piratesHitters} type='hitter' />
    </Box>
  );
}

export default HittersPage;
