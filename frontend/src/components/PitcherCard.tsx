import { Card, Divider, Stack, Typography } from '@mui/material';
import type { Pitcher } from "../types/pitcher";
import { useDashboard } from "../context/DashboardContext";

interface PitcherCardProps {
  pitcher: Pitcher;
}

function PitcherCard({ pitcher }: PitcherCardProps) {
  const { isMobile } = useDashboard();

  const statLabels: Record<string, string> = {
    ERAPlus: 'ERA+',
    BAbip: "BABIP",
  };

  const renderStatGroup = (entries: [string, unknown][]) => (
    <Stack
      direction="row"
      sx={{ mt: 0.75, columnGap: isMobile ? 1.25 : 1.5, rowGap: 0.5, flexWrap: 'wrap' }}
    >
      {entries.map(([key, value]) => (
        <Stack
          key={key}
          direction="column"
          sx={{ width: "auto", flex: "0 0 auto", alignItems: 'center' }}
        >
          <Typography
            variant="caption"
            sx={{ whiteSpace: "nowrap", lineHeight: 1.1, fontSize: isMobile ? 10 : undefined }}
          >
            {statLabels[key] ?? key}
          </Typography>
          <Typography
            variant="body2"
            sx={{ whiteSpace: "nowrap", lineHeight: 1.2, fontSize: isMobile ? 12.5 : undefined }}
          >
            {String(value)}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );

  return (
    <Card sx={{ p: 1.25, flexShrink: 0, width: isMobile ? '100%' : '550px', height: 'auto', boxSizing: 'border-box' }}>
      <Stack direction='row' sx={{ justifyContent: "space-between", alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant='h6'>{pitcher.name}</Typography>
        <Stack direction='row' divider={<Divider orientation='vertical' variant='middle' flexItem sx={{ alignSelf: 'center', height: '12px' }} />} spacing={0.5} sx={{ alignItems: 'center' }}>
          <Typography variant='body1'>#{pitcher.number}</Typography>
          <Typography variant='body1'>{pitcher.position}</Typography>
          <Typography variant='body1'>
            {pitcher.bat}/{pitcher.throw}
          </Typography>
        </Stack>
      </Stack>

      {renderStatGroup(Object.entries(pitcher.traditional))}
      {renderStatGroup(Object.entries(pitcher.advanced))}
    </Card>
  );
}

export default PitcherCard;
