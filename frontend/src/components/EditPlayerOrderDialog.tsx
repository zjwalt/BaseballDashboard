import { useEffect, useState } from 'react';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Stack, Typography } from '@mui/material'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities';
import type { Hitter } from '../types/hitter';
import type { Pitcher } from '../types/pitcher';
import CloseIcon from '@mui/icons-material/Close';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { loadPreferences } from '../utils/preferences';

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
    <Box ref={setNodeRef} style={style}>
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
    </Box>
  );
}

interface EditPlayersDialogProps {
  open: boolean;
  onClose: () => void;
  players: Hitter[] | Pitcher[];
  type: "hitter" | "pitcher";
  storageKey: string;
}

function EditPlayersDialog({ open, onClose, players, type, storageKey }: EditPlayersDialogProps) {
  const [orderedPlayers, setOrderedPlayers] = useState<Hitter[] | Pitcher[]>([]);
  const [hiddenIds, setHiddenIds] = useState<number[]>([]);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (open) {
      const { orderedPlayers, hiddenIds } = loadPreferences(players, storageKey);
      setOrderedPlayers(orderedPlayers);
      setHiddenIds(hiddenIds);
    }
  }, [open, players, storageKey]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = orderedPlayers.findIndex(p => p.player_id === active.id);
    const newIndex = orderedPlayers.findIndex(p => p.player_id === over.id);
    setOrderedPlayers(arrayMove(orderedPlayers as Hitter[], oldIndex, newIndex));
  };

  const handleToggle = (id: number) => {
    setHiddenIds(prev =>
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    localStorage.setItem(storageKey, JSON.stringify({
      order: orderedPlayers.map(p => p.player_id),
      hidden: hiddenIds,
    }));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='h6'>Edit Players</Typography>
          <IconButton size='small' onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ maxHeight: '400px', px: 1, border: '1px solid', borderColor: 'primary.main', borderRadius: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={orderedPlayers.map(p => p.player_id)}
              strategy={verticalListSortingStrategy}
            >
              <Stack direction='column' divider={<Divider flexItem />}>
                {orderedPlayers.map(player => (
                  <SortablePlayerRow
                    key={player.player_id}
                    player={player}
                    hidden={hiddenIds.includes(player.player_id)}
                    onToggle={handleToggle}
                  />
                ))}
              </Stack>
            </SortableContext>
          </DndContext>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditPlayersDialog;
