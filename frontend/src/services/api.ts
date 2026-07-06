import type { Hitter } from "../types/hitter";
import type { Player } from "../types/player";

const BASE_URL = "http://localhost:8000";

export async function fetchHitters(): Promise<Hitter[]> {
  const response = await fetch(`${BASE_URL}/api/v1/hitters/`);
  if (!response.ok)
    throw new Error(`Failed to fetch hitters: ${response.status}`);
  return response.json();
}

export async function fetchHitterById(id: number): Promise<Hitter[]> {
  const response = await fetch(`${BASE_URL}/api/v1/hitters/${id}`);
  if (!response.ok)
    throw new Error(`Failed to fetch hitter ${id}: ${response.status}`);
  return response.json();
}

export async function fetchPlayersList(): Promise<Player[]> {
  const response = await fetch("${BASE_URL}/api/v1/players/list");
  if (!response.ok)
    throw new Error(`Failed to fetch list of players: ${response.status}`);
  return response.json();
}
