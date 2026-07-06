import { useState } from "react";
import { useDashboard } from "../context/DashboardContext";
import { Autocomplete, TextField } from "@mui/material";

function AddPlayers() {
  const { players } = useDashboard();
  return (
    <Autocomplete
      options={players}
      getOptionLabel={(option) => `${option.name}`}
      renderInput={(params) => (
        <TextField {...params} label="Add Player" variant="outlined" />
      )}
    />
  );
}

export default AddPlayers;
