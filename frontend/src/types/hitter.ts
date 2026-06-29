export interface HitterTraditionalStats {
  pa: number;
  ab: number;
  avg: number;
  obp: number;
  slg: number;
  ops: number;
  hits: number;
  doubles: number;
  triples: number;
  hr: number;
  rbi: number;
  k: number;
  bb: number;
  sb: number;
}

export interface HitterStatcastAdvanced {
  exitVelo: number;
  launchAngle: number;
  hardHitPct: number;
  barrelPct: number;
  sweetSpotPct: number;
}

export interface HitterPercentiles {
  xBA: number;
  xSLG: number;
  xwOBA: number;
  barrelPct: number;
  kPct: number;
  bbPct: number;
  whiffPct: number;
  chasePct: number;
  exitVelo: number;
  hardHitPct: number;
  batSpeed: number;
}

export interface Hitter {
  id: number;
  player_id: number;
  name: string;
  team: string;
  number: number;
  position: string;
  throw: string;
  bat: string;
  traditional: HitterTraditionalStats;
  statcastAdv: HitterStatcastAdvanced;
  percentiles: HitterPercentiles;
}
