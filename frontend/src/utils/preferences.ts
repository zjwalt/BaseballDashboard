import type { Hitter } from '../types/hitter';
import type { Pitcher } from '../types/pitcher';

export const applyPreferences = <T extends Hitter | Pitcher>(
  players: T[],
  storageKey: string,
): T[] => {
  const stored = localStorage.getItem(storageKey);
  if (!stored) return players;

  const prefs = JSON.parse(stored);

  const ordered = prefs.order.map((id: number) => players.find(p => p.player_id === id)).filter(Boolean) as T[];

  const newPlayers = players.filter(p => !prefs.order.includes(p.player_id));
  return [...ordered, ...newPlayers].filter(p => !prefs.hidden.includes(p.player_id));
};


export const loadPreferences = <T extends Hitter | Pitcher>(
  players: T[],
  storageKey: string,
): { orderedPlayers: T[]; hiddenIds: number[] } => {
  const stored = localStorage.getItem(storageKey);
  if (!stored) return { orderedPlayers: players, hiddenIds: [] };

  const prefs = JSON.parse(stored);
  const ordered = prefs.order
    .map((id: number) => players.find(p => p.player_id === id))
    .filter(Boolean) as T[];

  const newPlayers = players.filter(p => !prefs.order.includes(p.player_id));

  return {
    orderedPlayers: [...ordered, ...newPlayers],
    hiddenIds: prefs.hidden.filter((id: number) => players.some(p => p.player_id === id))
  };
};
