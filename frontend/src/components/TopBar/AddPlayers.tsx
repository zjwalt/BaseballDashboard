import { useState } from "react";
import { useDashboard } from "../../context/DashboardContext";
import {
  Autocomplete,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { addPlayers } from "../../services/api";
import { Player } from "../../types/player";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

function AddPlayers() {
  const { newPlayers, currentPlayers, setNewPlayers, setCurrentPlayers } =
    useDashboard();
  const [additionalPlayers, setAdditionalPlayers] = useState<Player[]>([]);
  const [openAddPlayers, setOpenAddPlayers] = useState(false);

  const handleClose = () => {
    setAdditionalPlayers([]);
    setOpenAddPlayers(false);
  };

  const handleSave = async () => {
    try {
      await addPlayers(additionalPlayers);

      setNewPlayers(
        newPlayers.filter(
          (p) =>
            !additionalPlayers.some(
              (added) =>
                added.player_id === p.player_id && added.type === p.type,
            ),
        ),
      );

      setCurrentPlayers([...currentPlayers, ...additionalPlayers]);
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpenAddPlayers(true)}>
        <AddIcon />
      </Button>
      <Dialog open={openAddPlayers}>
        <DialogTitle>
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6">Add New Players</Typography>
            <IconButton color="primary" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{}}>
          <Autocomplete<Player, true>
            options={newPlayers}
            multiple
            groupBy={(option: Player) => option.type}
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
              <TextField {...params} label="Add Player(s)" variant="outlined" />
            )}
            onChange={(_: React.SyntheticEvent, value: Player[]) => {
              setAdditionalPlayers(value);
            }}
            sx={{
              pt: 1,
              width: 320,
              "& .MuiChip-label": {
                mt: 0.5,
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddPlayers;
