import { Card, Divider, Stack, Typography } from '@mui/material';
import type { Pitcher } from "../types/pitcher";
import { colors } from "../theme/theme";

interface PitcherCardProps {
  pitcher: Pitcher;
}


function PitcherCard({ pitcher }: PitcherCardProps) {
  const statLabels: Record<string, string> = {
    ERAPlus: 'ERA+',
    BAbip: "BABIP"
  }

  return (
    <Card sx={{ p: 1, flexShrink: 0, width: '550px', height: '250px', }}>
      {/* Player info (name, number, position, ...) */}
      <Stack direction='row' sx={{ justifyContent: "space-between" }}>
        <Typography variant='h6'>{pitcher.name}</Typography>
        <Stack direction='row' divider={<Divider orientation='vertical' variant='middle' flexItem sx={{ alignSelf: 'center', height: '12px' }} />} spacing={0.5} sx={{ alignItems: 'center' }} >
          <Typography variant='body1'>#{pitcher.number}</Typography>

          <Typography variant='body1'>{pitcher.position}</Typography>

          <Typography variant='body1'>
            {pitcher.bat}/{pitcher.throw}
          </Typography>
        </Stack>
      </Stack>

      {/* Traditional Pitcher Statistics */}
      <Stack direction='row' spacing={1} sx={{ mt: 1 }}>
        {Object.entries(pitcher.traditional).map(([key, value]) => (
          <Stack direction='column' spacing={0.5} sx={{ display: 'flex', width: 'auto', alignItems: 'center' }}>
            <Typography variant='body2'>
              {statLabels[key] ?? key}
            </Typography>
            <Typography variant='body2'>{value}</Typography>
          </Stack>
        ))}
      </Stack>

      {/* Advanced Pitcher Metrics */}
      <Stack direction='row' spacing={1} sx={{ mt: 1 }}>
        {Object.entries(pitcher.advanced).map(([key, value]) => (
          <Stack direction='column' spacing={0.5} sx={{ display: 'flex', width: 'auto', alignItems: 'center' }}>
            <Typography variant='body2'>
              {statLabels[key] ?? key}
            </Typography>
            <Typography variant='body2'>{value}</Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}

export default PitcherCard;
