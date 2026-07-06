from fastapi import APIRouter, HTTPException
from scrapers.player_details import PlayerDetailScraper
from services.player_service import PlayerService
from models.player import Player

router = APIRouter(prefix="/players", tags=["players"])
scraper = PlayerDetailScraper()
service = PlayerService()


@router.get("/list", response_model=list[Player])
async def get_player_list(season: int = 2026):
    return service.get_player_details()
