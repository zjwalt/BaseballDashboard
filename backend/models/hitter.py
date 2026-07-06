from pydantic import BaseModel


class HitterTraditionalStats(BaseModel):
    PA: int
    AB: int
    AVG: float
    OBP: float
    SLG: float
    OPS: float
    HITS: int
    DOUBLES: int
    TRIPLES: int
    HR: int
    RBI: int
    K: int
    BB: int
    SB: int


class HitterAdvancedStats(BaseModel):
    wOBA: float
    xBA: float
    xSLG: float
    xwOBA: float
    babip: float
    bbPct: float
    kPct: float
    wRCPlus: int
    opsPlus: int


class HitterStatcastAdvanced(BaseModel):
    exitVelo: float
    launchAngle: float
    hardHitPct: float
    barrelPct: float
    sweetSpotPct: float  # luach angle 8-32 deg


# class HitterValue(BaseModel):
#     bWAR: float
#     offense: float
#     defense: float


class HitterPercentiles(BaseModel):
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
    batSpeed: int


class Hitter(BaseModel):
    id: int
    player_id: int
    name: str
    team: str
    number: int
    position: str
    throw: str
    bat: str
    traditional: HitterTraditionalStats
    advanced: HitterAdvancedStats
    statcastAdv: HitterStatcastAdvanced
    # value: HitterValue
    percentiles: HitterPercentiles
