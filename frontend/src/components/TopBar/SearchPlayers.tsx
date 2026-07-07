import { useState } from "react";
import { useDashboard } from "../../context/DashboardContext";
import { Autocomplete, Stack, TextField, Typography } from "@mui/material";
import { Player } from "../../types/player";

function SearchPlayers() {
  const { currentPlayers } = useDashboard();
  return (
    <Autocomplete
      options={currentPlayers}
      groupBy={(option: Player) => option.playertype}
      getOptionLabel={(option: Player) => `${option.name}`}
      renderOption={(params, option) => (
        <li {...params} key={option.player_id}>
          <Stack direction="column" sx={{}}>
            <Typography variant="body1">{option.name}</Typography>
            <Typography variant="caption">
              {`${option.team} | ${option.position} | #${option.number}`}
            </Typography>
          </Stack>
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label="Search..." variant="outlined" />
      )}
      sx={{ width: 320 }}
    />
  );
}

export default SearchPlayers;
