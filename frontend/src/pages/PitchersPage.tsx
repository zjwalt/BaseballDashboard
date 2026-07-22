import { useDashboard } from '../context/DashboardContext.tsx';
import { useEffect } from 'react';
import { fetchPitchers } from '../services/api';
import { Box, Stack, Typography } from '@mui/material';

import type { Pitcher } from '../types/pitcher';
import { PlayerContainer } from '../components';

function PitchersPage() {
  const { pitchers, currentPlayers, setPitchers } = useDashboard();

  useEffect(() => {
    fetchPitchers()
      .then((pitchersData: Pitcher[]) => {
        setPitchers(pitchersData);
      })
      .catch((err: Error) => console.error(err.message));
  }, [currentPlayers]);

  const piratesPitchers = pitchers.filter(
    (pitcher: Pitcher) => pitcher.team === 'PIT',
  );

  const otherPitchers = pitchers.filter(
    (pitcher: Pitcher) => pitcher.team !== 'PIT',
  );


  return (
    <Box
      sx={{
        p: 3,
        display: 'flex',
        height: '100%',
        width: '100%'
      }}
    >
      <Stack direction='column' spacing={3} sx={{ width: '100%' }}>
        <Stack direction='column' sx={{ width: '100%', pr: 3 }}>
          <Typography variant='h5'>Pittsburgh Pirates</Typography>
          <PlayerContainer pitchers={piratesPitchers} />
        </Stack>

        <Stack direction='column' sx={{ width: '100%', pr: 3 }}>
          <Typography variant='h5'>Other Pitchers</Typography>
          <PlayerContainer pitchers={otherPitchers} />
        </Stack>
      </Stack>
    </Box>
  )

}

export default PitchersPage;
