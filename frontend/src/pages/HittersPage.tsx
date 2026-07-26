import { useDashboard } from "../context/DashboardContext";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import type { Hitter } from "../types/hitter";
import { PlayerContainer, EditPlayerOrderDialog } from "../components";
import { applyPreferences } from "../utils/preferences";
import { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';

function HittersPage() {
  const { hitters, openOrderDialog, setOpenOrderDialog } = useDashboard();
  const [activeStorageKey, setActiveStorageKey] = useState<string>('');

  const piratesHitters = applyPreferences(
    hitters.filter((h: Hitter) => h.team === "PIT"),
    "pirates_hitters_preferences"
  );

  const otherHitters = applyPreferences(
    hitters.filter((h: Hitter) => h.team !== "PIT"),
    "other_hitters_preferences"
  );

  const handleEdit = (storageKey: string) => {
    setActiveStorageKey(storageKey);
    setOpenOrderDialog(true);
  };

  const activePlayers = activeStorageKey === "pirates_hitters_preferences"
    ? hitters.filter((h: Hitter) => h.team === "PIT")
    : hitters.filter((h: Hitter) => h.team !== "PIT");

  return (
    <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
      <Stack direction="column" spacing={3} sx={{ width: "100%" }}>
        <Stack direction="column" spacing={0.5} sx={{ width: "100%" }}>
          <Stack direction='row' spacing={2} sx={{ alignItems: 'center' }}>
            <Typography variant="h5">Pittsburgh Pirates</Typography>
            <Tooltip
              title='Edit Player Order'
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [0, -6]
                      }
                    }
                  ]
                }
              }}
            >
              <IconButton size='small' onClick={() => handleEdit("pirates_hitters_preferences")}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <PlayerContainer hitters={piratesHitters} />
        </Stack>
        <Stack direction="column" spacing={0.5} sx={{ width: "100%" }}>
          <Stack direction='row' spacing={2} sx={{ alignItems: 'center' }}>
            <Typography variant="h5">Other Players</Typography>
            <Tooltip
              title='Edit Player Order'
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [0, -6]
                      }
                    }
                  ]
                }
              }}
            >
              <IconButton size='small' onClick={() => handleEdit("other_hitters_preferences")}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <PlayerContainer hitters={otherHitters} />
        </Stack>
      </Stack>
      <EditPlayerOrderDialog
        open={openOrderDialog}
        onClose={() => setOpenOrderDialog(false)}
        players={activePlayers}
        type="hitter"
        storageKey={activeStorageKey}
      />
    </Box >
  );
}

export default HittersPage;
