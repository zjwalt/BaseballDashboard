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
    # HRPct: float
    # KPct: float
    # BBPct: float
    kBB: float


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
    player_id: int
    name: str
    team: str
    number: int
    position: str
    throw: str
    bat: str
    traditional: PitcherTraditionalStats
    advanced: PitcherAdvancedStats
    # statcast: PitcherStatcastStats
    # percentiles: PitcherPercentiles
