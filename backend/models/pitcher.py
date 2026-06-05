from pydantic import BaseModel


class PitcherTraditionalStats(BaseModel):
    era: float
    wins: int
    strikeouts: int
    whip: float
    inningsPitched: float
    bb9: float


class PitcherAdvancedStats(BaseModel):
    fip: float
    xFIP: float
    # siera: float
    kPct: float
    bbPct: float
    kBB: float
    eraPlus: int


class PitcherStatcastStats(BaseModel):
    fastballVelo: float
    spinRat: int
    exitVeloAgainst: float
    whiffPct: float
    chasePct: float


class PitcherPercentiles(BaseModel):
    xwOBA: int
    xBA: int
    xSLG: int
    xISO: int
    xOBP: int
    brl: int
    brlPct: int
    exitVelocity: int
    maxEv: int
    hardHitPct: int
    bbPct: int
    whiffPct: int
    chasePct: int
    xera: int


class Pitcher(BaseModel):
    id: int
    name: str
    team: str
    positions: str
    traditional: PitcherTraditionalStats
    advanced: PitcherAdvancedStats
    statcast: PitcherStatcastStats
    percentiles: PitcherPercentiles
