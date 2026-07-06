from pydantic import BaseModel


class Player(BaseModel):
    player_id: int
    name: str
    team: str
    number: int
    position: str
    throw: str
    bat: str
    type: str
