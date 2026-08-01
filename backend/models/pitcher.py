from pydantic import BaseModel


class PitcherTraditionalStats(BaseModel):
    ERA: float
    IP: float
    H: int
    R: int
    ER: int
    HR: int
    BB: int
    K: int
    W: int
    L: int
    SV: int


class PitcherStatsAgainst(BaseModel):
    BA: float
    OBP: float
    SLG: float
    OPS: float
    BAbip: float
    WHIP: float
    FIP: float
    ERAPlus: int


class PitcherExpectedRate(BaseModel):
    xBA: float
    xSLG: float
    xwOBA: float
    xFIP: float
    H9: float
    HR9: float
    BB9: float
    K9: float
    kBB: float
    HRPct: float
    KPct: float
    BBPct: float


class PitcherStatcastStats(BaseModel):
    exitVelo: float
    launchAngle: float
    hardHitPct: float
    barrelPct: float
    sweetSpotPct: float


class PitcherPercentiles(BaseModel):
    xBA: int
    xSLG: int
    xwOBA: int
    barrelPct: int
    kPct: int
    bbPct: int
    whiffPct: int
    chasePct: int
    exitVelo: int
    hardHitPct: int


class PitchUsage(BaseModel):
    FB: float | None
    SL: float | None
    CB: float | None
    CH: float | None
    SI: float | None
    FC: float | None
    ST: float | None
    SLV: float | None
    KN: float | None
    FS: float | None


class Pitcher(BaseModel):
    id: int
    player_id: int
    name: str
    team: str
    number: int
    position: str
    throw: str
    bat: str
    traditional: PitcherTraditionalStats
    statsAgainst: PitcherStatsAgainst
    expectedRate: PitcherExpectedRate
    statcastAdv: PitcherStatcastStats
    percentiles: PitcherPercentiles
    usage: PitchUsage
