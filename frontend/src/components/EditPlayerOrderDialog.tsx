import { useEffect, useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, Stack, Typography } from '@mui/material'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent, } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities';
import type { Hitter } from '../types/hitter';
import type { Pitcher } from '../types/pitcher';
import type { Player } from '../types/player';
import CloseIcon from '@mui/icons-material/Close';
import DragHandleIcon from '@mui/icons-material/DragHandle';


interface SortablePlayerRowProps {
  player: Hitter | Pitcher;
  hidden: boolean;
  onToggle: (id: number) => void;
}

function SortablePlayerRow({ player, hidden, onToggle }: SortablePlayerRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: player.player_id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ListItem ref={setNodeRef} style={style} sx={{ px: 0 }}>
      <Stack direction='row' sx={{ alignItems: 'center', width: '100%' }}>
        <IconButton {...attributes} {...listeners} size='small' sx={{ cursor: 'grab' }}>
          <DragHandleIcon />
        </IconButton>
        <Checkbox
          checked={!hidden}
          onChange={() => onToggle(player.player_id)}
          size='small'
        />
        <Typography variant='body2'>{player.name}</Typography>
        <Typography variant='caption' sx={{ ml: 1 }}>
          {player.team} | {player.position}
        </Typography>
      </Stack>
    </ListItem>
  )
}

interface EditPlayersDialogProps {
  open: boolean;
  onClose: () => void;
  players: Hitter[] | Pitcher[];
  type: "hitter" | "pitcher";
}

function EditPlayersDialog({ open, onClose, players, type }: EditPlayersDialogProps) {
  const [orderedPlayers, setOrderedPlayers] = useState<Hitter[] | Pitcher[]>(players);
  const [hiddenIds, setHiddenIds] = useState<number[]>([]);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (open) {
      setOrderedPlayers(players);
    }
  }, [open, players]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = orderedPlayers.findIndex(p => p.player_id === active.id);
    const newIndex = orderedPlayers.findIndex(p => p.player_id === over.id);
    setOrderedPlayers(arrayMove(orderedPlayers, oldIndex, newIndex));
  };

  const handleToggle = (id: number) => {
    setHiddenIds(prev =>
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    localStorage.setItem(`${type}_preferences`, JSON.stringify({
      order: orderedPlayers.map(p => p.player_id),
      hidden: hiddenIds,
    }));
    onClose();
  };


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Players</DialogTitle>
      <DialogContent>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={orderedPlayers.map(p => p.player_id)}
            strategy={verticalListSortingStrategy}
          >
            <List disablePadding>
              {orderedPlayers.map(player => {
                console.log(player);
                return (
                  <SortablePlayerRow
                    key={player.player_id}
                    player={player}
                    hidden={hiddenIds.includes(player.player_id)}
                    onToggle={handleToggle}
                  />
                )
              })}
            </List>
          </SortableContext>
        </DndContext>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditPlayersDialog;
