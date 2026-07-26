import { Card, Divider, Stack, Typography } from "@mui/material";
import type { Pitcher, PitcherPercentiles } from "../types/pitcher";
import { colors } from "../theme/theme";
import { useDashboard } from "../context/DashboardContext";
import { formatStat } from "../utils/format.ts";

interface PitcherCardProps {
  pitcher: Pitcher;
}

function PitcherCard({ pitcher }: PitcherCardProps) {
  const { isMobile } = useDashboard();

  const handleColor = (percentile: number): string => {
    if (percentile >= 90) return colors.percentile.elite;
    if (percentile >= 70) return colors.percentile.great;
    if (percentile >= 50) return colors.percentile.aboveAvg;
    if (percentile >= 30) return colors.percentile.belowAvg;
    return colors.percentile.poor;
  };

  const percentiles = pitcher.percentiles;

  const statLabels: Record<string, string> = {
    ERAPlus: "ERA+",
    BAbip: "BABIP",
    kBB: "K/BB",
  };

  const renderStatGroup = (
    entries: [string, unknown][],
    statGroup: string,
    withPercentileColor = false,
  ) => (
    <Stack
      direction="row"
      sx={{
        flexWrap: "wrap",
        mt: isMobile ? 0.75 : 1,
        columnGap: isMobile ? 1.25 : 1,
        rowGap: isMobile ? 0.5 : 1.25,
      }}
    >
      {entries.map(([key, value]) => (
        <Stack
          key={key}
          direction="column"
          spacing={isMobile ? 0 : 0.5}
          sx={{ width: "auto", flex: "0 0 auto", alignItems: "center" }}
        >
          <Typography
            variant={isMobile ? "caption" : "body2"}
            sx={{
              whiteSpace: "nowrap",
              lineHeight: isMobile ? 1.1 : "normal",
              fontSize: isMobile ? 10 : undefined,
              color: "#5c4f70",
            }}
          >
            {statLabels[key] ?? key}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "nowrap",
              lineHeight: isMobile ? 1.2 : "normal",
              fontSize: isMobile ? 12.5 : undefined,
              color:
                withPercentileColor &&
                percentiles[key as keyof PitcherPercentiles]
                  ? handleColor(percentiles[key as keyof PitcherPercentiles])
                  : "",
            }}
          >
            {statGroup === "percentiles"
              ? String(value)
              : formatStat(key, value)}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );

  return (
    <Card
      sx={{
        p: 1.25,
        flexShrink: 0,
        width: isMobile ? "100%" : "550px",
        height: "auto",
        boxSizing: "border-box",
      }}
    >
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h6">{pitcher.name}</Typography>
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
          <Typography variant="body1">#{pitcher.number}</Typography>
          <Typography variant="body1">{pitcher.position}</Typography>
          <Typography variant="body1">
            {pitcher.bat}/{pitcher.throw}
          </Typography>
        </Stack>
      </Stack>

      {renderStatGroup(Object.entries(pitcher.traditional), "traditional")}
      {renderStatGroup(Object.entries(pitcher.advanced), "advanced", true)}
      {renderStatGroup(
        Object.entries(pitcher.statcastAdv),
        "statcastAdv",
        true,
      )}
      {renderStatGroup(Object.entries(pitcher.percentiles), "percentiles")}
    </Card>
  );
}

export default PitcherCard;
