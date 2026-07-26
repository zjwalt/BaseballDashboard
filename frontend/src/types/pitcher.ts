export interface PitcherTraditionalStats {
  ERA: number;
  IP: number;
  H: number;
  R: number;
  ER: number;
  HR: number;
  BB: number;
  K: number;
  W: number;
  L: number;
  SV: number;
}

export interface PitcherAdvancedStats {
  BA: number;
  OBP: number;
  SLG: number;
  OPS: number;
  BAbip: number;
  WHIP: number;
  FIP: number;
  xFip: number;
  ERAPlus: number;
  H9: number;
  HR9: number;
  BB9: number;
  SO9: number;
  kBB: number;
}

export interface PitcherStatcastAdvanced {
  exitVelo: number;
  launchAngle: number;
  hardHitPct: number;
  barrelPct: number;
  sweetSpotPct: number;
}

export interface PitcherPercentiles {
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
}

export interface Pitcher {
  id: number;
  player_id: number;
  name: string;
  team: string;
  number: number;
  position: string;
  throw: string;
  bat: string;
  traditional: PitcherTraditionalStats;
  advanced: PitcherAdvancedStats;
  statcastAdv: PitcherStatcastAdvanced;
  percentiles: PitcherPercentiles;
}
