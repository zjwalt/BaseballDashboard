import { Box, Paper, Stack } from "@mui/material";
import type { Hitter } from "../types/hitter";
import type { Pitcher } from '../types/pitcher';

import { HitterCard } from "./";
import { PitcherCard } from "./index.ts";

interface PlayerContainerProps {
  hitters?: Hitter[];
  pitchers?: Pitcher[];
}

function PlayerContainer({ hitters, pitchers }: PlayerContainerProps) {
  return (
    <Paper
      sx={{
        p: 2,
        width: "100%",
        overflowX: "auto",
        scrollBarWidth: "none",
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{ width: "100%", overflowX: "auto", flexWrap: "nowrap" }}
      >
        {hitters?.map((hitter: Hitter) => (
          <HitterCard hitter={hitter} />
        ))}

        {pitchers?.map((pitcher: Pitcher) => (
          <PitcherCard pitcher={pitcher} />
        ))}

      </Stack>
    </Paper>
  );
}

export default PlayerContainer;
