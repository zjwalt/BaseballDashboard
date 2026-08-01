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

export interface PitcherStatsAgainst {
  BA: number;
  OBP: number;
  SLG: number;
  OPS: number;
  BAbip: number;
  WHIP: number;
  FIP: number;
  ERAPlus: number;
}

export interface PitcherExpectedRate {
  xBA: number;
  xSLG: number;
  xwOBA: number;
  xFIP: number;
  H9: number;
  HR9: number;
  BB9: number;
  kBB: number;
  K9: number;
  HRPct: number;
  KPct: number;
  BBPct: number;
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

export interface PitchUsage {
  FB: number | null;
  SL: number | null;
  CB: number | null;
  CH: number | null;
  SI: number | null;
  FC: number | null;
  ST: number | null;
  SLV: number | null;
  KN: number | null;
  FS: number | null;
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
  statsAgainst: PitcherStatsAgainst;
  expectedRate: PitcherExpectedRate;
  statcastAdv: PitcherStatcastAdvanced;
  percentiles: PitcherPercentiles;
  usage: PitchUsage;
}
