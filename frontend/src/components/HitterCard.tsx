import { Card, Divider, Stack, Typography } from "@mui/material";
import type { Hitter, HitterPercentiles } from "../types/hitter";
import { colors } from "../theme/theme";

interface HitterCardProps {
  hitter: Hitter;
}

function HitterCard({ hitter }: HitterCardProps) {
  const handleColor = (percentile: number): string => {
    if (percentile >= 90) return colors.percentile.elite;
    if (percentile >= 70) return colors.percentile.great;
    if (percentile >= 50) return colors.percentile.aboveAvg;
    if (percentile >= 30) return colors.percentile.belowAvg;
    return colors.percentile.poor;
  };

  const percentiles = hitter.percentiles;

  const statLabels: Record<string, string> = {
    hits: "H",
    DOUBLES: "2B",
    TRIPLES: "3B",
    kPct: "K%",
    bbPct: "BB%",
    exitVelo: "EV",
    launchAngle: "LA",
    barrelPct: "Barrel %",
    whiffPct: "Whiff %",
    chasePct: "Chase %",
    hardHitPct: "Hard-Hit %",
    sweetSpotPct: "Sweet-Spot %",
    wRCPlus: "wRC+",
    opsPlus: "OPS+",
    batSpeed: "Bat Speed",
  };

  return (
    <Card
      sx={{
        p: 1,
        flexShrink: 0,
        width: "550px",
        height: "250px",
      }}
    >
      {/* Player info (name, number, position, ...) */}
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">{hitter.name}</Typography>
        <Stack
          direction="row"
          divider={
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ alignSelf: "center", height: "12px" }}
            />
          }
          spacing={0.5}
          sx={{ alignItems: "center" }}
        >
          <Typography variant="body1">#{hitter.number}</Typography>

          <Typography variant="body1">{hitter.position}</Typography>

          <Typography variant="body1">
            {hitter.bat}/{hitter.throw}
          </Typography>
        </Stack>
      </Stack>

      {/* Player Traditional Stats */}
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        {Object.entries(hitter.traditional).map(([key, value]) => (
          <Stack
            direction="column"
            spacing={0.5}
            sx={{ display: "flex", width: "auto", alignItems: "center" }}
          >
            <Typography variant="body2" sx={{}}>
              {statLabels[key] ?? key}
            </Typography>
            <Typography variant="body2">{value}</Typography>
          </Stack>
        ))}
      </Stack>

      {/* Player Advanced Stats */}
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        {Object.entries(hitter.advanced).map(([key, value]) => (
          <Stack
            direction="column"
            spacing={0.5}
            sx={{ width: "auto", alignItems: "center" }}
          >
            <Typography variant="body2">{statLabels[key] ?? key}</Typography>
            <Typography
              variant="body2"
              sx={{
                color: percentiles[key as keyof HitterPercentiles]
                  ? handleColor(percentiles[key as keyof HitterPercentiles])
                  : "",
              }}
            >
              {value}
            </Typography>
          </Stack>
        ))}
      </Stack>

      {/* Player Statcast Advanced Stats */}
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        {Object.entries(hitter.statcastAdv).map(([key, value]) => (
          <Stack
            direction="column"
            spacing={0.5}
            sx={{ width: "auto", alignItems: "center" }}
          >
            <Typography variant="body2" sx={{}}>
              {statLabels[key] ?? key}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: percentiles[key as keyof HitterPercentiles]
                  ? handleColor(percentiles[key as keyof HitterPercentiles])
                  : "",
              }}
            >
              {value}
            </Typography>
          </Stack>
        ))}
      </Stack>

      {/* Player Percentile Ranks */}
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        {Object.entries(hitter.percentiles).map(([key, value]) => (
          <Stack
            direction="column"
            spacing={0.5}
            sx={{ display: "flex", width: "auto", alignItems: "center" }}
          >
            <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
              {statLabels[key] ?? key}
            </Typography>
            <Typography variant="body2">{value}</Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}

export default HitterCard;
