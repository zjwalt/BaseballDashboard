import { Paper, Stack } from "@mui/material";
import type { Hitter } from "../types/hitter.ts";
import type { Pitcher } from '../types/pitcher.ts';
import { useDashboard } from "../context/DashboardContext.tsx";

import HitterCard from "./HitterCard.tsx";
import PitcherCard from "./PitcherCard.tsx";

interface PlayerContainerProps {
  hitters?: Hitter[];
  pitchers?: Pitcher[];
}

function PlayerContainer({ hitters, pitchers }: PlayerContainerProps) {
  const { isMobile } = useDashboard();

  return (
    <Paper
      sx={{
        width: "100%",
        overflowX: isMobile ? "visible" : "auto",
        // Cap each section's height on mobile so the page itself doesn't
        // grow forever with every player stacked - scroll within the section instead.
        maxHeight: isMobile ? "40vh" : "none",
        overflowY: isMobile ? "auto" : "visible",
        scrollBarWidth: "none",
      }}
    >
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={isMobile ? 1.5 : 2}
        sx={{
          py: isMobile ? 1 : 1,
          px: isMobile ? 1 : 1,
          width: "100%",
          overflowX: isMobile ? "visible" : "auto",
          flexWrap: "nowrap",
        }}
      >
        {hitters?.map((hitter: Hitter) => (
          <HitterCard key={hitter.player_id} hitter={hitter} />
        ))}

        {pitchers?.map((pitcher: Pitcher) => (
          <PitcherCard key={pitcher.player_id} pitcher={pitcher} />
        ))}
      </Stack>
    </Paper>
  );
}

export default PlayerContainer;
