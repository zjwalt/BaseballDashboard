import type { Hitter } from "../types/hitter";
import type { Player } from "../types/player";

const BASE_URL = "http://localhost:8000/api/v1";

export async function fetchHitters(): Promise<Hitter[]> {
  const response = await fetch(`${BASE_URL}/hitters/`);
  if (!response.ok)
    throw new Error(`Failed to fetch hitters: ${response.status}`);
  return response.json();
}

export async function fetchHitterById(id: number): Promise<Hitter[]> {
  const response = await fetch(`${BASE_URL}/hitters/${id}`);
  if (!response.ok)
    throw new Error(`Failed to fetch hitter ${id}: ${response.status}`);
  return response.json();
}

export async function fetchNewPlayersList(): Promise<Player[]> {
  const response = await fetch(`${BASE_URL}/players/list_new`);
  if (!response.ok)
    throw new Error(`Failed to fetch list of new players: ${response.status}`);
  return response.json();
}

export async function fetchCurrentPlayersList(): Promise<Player[]> {
  const response = await fetch(`${BASE_URL}/players/list_current`);
  if (!response.ok)
    throw new Error(
      `Failed to fetch list of current players: ${response.status}`,
    );
  return response.json();
}
