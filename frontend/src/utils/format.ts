const threeDecimal = new Set([
  "AVG",
  "OBP",
  "SLG",
  "OPS",
  "wOBA",
  "xBA",
  "xSLG",
  "xwOBA",
  "babip",
  "BAbip",
  "BA",
  "FIP",
  "xFIP",
  "WHIP",
]);

const twoDecimal = new Set([
  "ERA",
  "exitVelo",
  "launchAngle",
  "H9",
  "HR9",
  "BB9",
  "SO9",
  "kBB",
]);

const oneDecimal = new Set([
  "kPct",
  "bbPct",
  "hardHitPct",
  "barrelPct",
  "sweetSpotPct",
  "whiffPct",
  "chasePct",
]);

export function formatStat(key: string, value: unknown): string {
  if (typeof value !== "number") return String(value);

  if (threeDecimal.has(key)) return value.toFixed(3);
  if (twoDecimal.has(key)) return value.toFixed(2);
  if (oneDecimal.has(key)) return `${value.toFixed(1)}`;

  return String(value); // counting stats (H, HR, RBI, etc.) stay as integers
}
