from fastapi import APIRouter, HTTPException
from scrapers.player_details import PlayerDetailScraper
from services.player_service import PlayerService
from models.player import Player

router = APIRouter(prefix="/players", tags=["players"])
scraper = PlayerDetailScraper()
service = PlayerService()


@router.get("/list_new", response_model=list[Player])
async def get_player_list(season: int = 2026):
    players = service.get_new_player_details()
    return players


@router.get("/list_current", response_model=list[Player])
async def get_current_player_list():
    players = service.get_current_player_details()
    return players


@router.post("/add")
async def add_players(players: list[Player]):
    for player in players:
        service.add_players(player)
