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


class PitcherAdvancedStats(BaseModel):
    BA: float
    OBP: float
    SLG: float
    OPS: float
    BAbip: float
    WHIP: float
    FIP: float
    xFIP: float
    ERAPlus: int
    H9: float
    HR9: float
    BB9: float
    SO9: float
    HRPct: float
    KPct: float
    BBPct: float
    kBB: float


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
    advanced: PitcherAdvancedStats
    statcastAdv: PitcherStatcastStats
    percentiles: PitcherPercentiles
