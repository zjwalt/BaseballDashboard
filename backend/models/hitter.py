from pydantic import BaseModel


class HitterTraditionalStats(BaseModel):
    pa: int
    ab: int
    hits: int
    avg: float
    hr: int
    rbi: int
    obp: float
    slg: float
    ops: float
    doubles: int
    triples: int
    k: int
    bb: int
    sb: int


class HitterAdvancedStats(BaseModel):
    wOBA: float
    xBA: float
    xSLG: float
    xwOBA: float
    babip: float
    bbPct: float
    kPct: float
    wRCPlus: float
    opsPlus: int


class HitterStatcastAdvanced(BaseModel):
    exitVelo: float
    launchAngle: float
    hardHitPct: float
    barrelPct: float
    xwOBACon: float  # Expected wOBA on contact
    sweetSpotPct: float  # luach angle 8-32 deg


class HitterValue(BaseModel):
    bWAR: float
    offense: float
    defense: float


class HitterPercentiles(BaseModel):
    xBA: int
    xSLG: int
    xwOBA: int
    barrelPct: int
    kPct: int
    bbPct: int
    whiffPct: int
    chasPct: int
    exitVelo: int
    hardHitPct: int
    batSpeed: int


class Hitter(BaseModel):
    id: int
    name: str
    team: str
    number: str
    position: str
    traditional: HitterTraditionalStats
    advanced: HitterAdvancedStats
    statcastAdv: HitterStatcastAdvanced
    value: HitterValue
    percentiles: HitterPercentiles
