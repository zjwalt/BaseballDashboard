import { useDashboard } from '../context/DashboardContext.tsx';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import type { Pitcher } from '../types/pitcher';
import { PlayerContainer, EditPlayerOrderDialog } from '../components';
import { applyPreferences } from '../utils/preferences';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';


function PitchersPage() {
  const { pitchers, openOrderDialog, isMobile, setOpenOrderDialog } = useDashboard();
  const [activeStorageKey, setActiveStorageKey] = useState<string>('');

  const piratesPitchers = applyPreferences(
    pitchers.filter((p: Pitcher) => p.team === 'PIT'),
    "pirates_pitchers_preferences"
  );

  const otherPitchers = applyPreferences(
    pitchers.filter((p: Pitcher) => p.team !== 'PIT'),
    "other_pitchers_preferences"
  );

  const handleEdit = (storageKey: string) => {
    setActiveStorageKey(storageKey);
    setOpenOrderDialog(true);
  };

  const activePlayers = activeStorageKey === "pirates_pitchers_preferences"
    ? pitchers.filter((p: Pitcher) => p.team === 'PIT')
    : pitchers.filter((p: Pitcher) => p.team !== 'PIT');

  return (
    <Box sx={{ pt: 2, pb: 100, px: isMobile ? 0 : 2, display: 'flex', height: '100%', width: '100%' }}>
      <Stack direction='column' spacing={3} sx={{ width: '100%' }}>
        <Stack direction='column' spacing={0.5} sx={{ width: '100%' }}>
          <Stack direction='row' spacing={2} sx={{ alignItems: 'center' }}>
            <Typography variant='h5'>Pittsburgh Pirates</Typography>
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
              <IconButton size='small' onClick={() => handleEdit("pirates_pitchers_preferences")}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <PlayerContainer pitchers={piratesPitchers} />
        </Stack>
        <Stack direction='column' spacing={0.5} sx={{ width: '100%' }}>
          <Stack direction='row' spacing={2} sx={{ alignItems: 'center' }}>
            <Typography variant='h5'>Other Pitchers</Typography>
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
              <IconButton size='small' onClick={() => handleEdit("other_pitchers_preferences")}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <PlayerContainer pitchers={otherPitchers} />
        </Stack>
      </Stack>
      <EditPlayerOrderDialog
        open={openOrderDialog}
        onClose={() => setOpenOrderDialog(false)}
        players={activePlayers}
        type="pitcher"
        storageKey={activeStorageKey}
      />
    </Box>
  );
}

export default PitchersPage;
