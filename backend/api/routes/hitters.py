from fastapi import APIRouter, HTTPException
from models.hitter import Hitter
from services.hitter_service import HitterService

router = APIRouter(prefix="/hitters", tags=["hitters"])
service = HitterService()


@router.get("/", response_model=list[Hitter])
async def get_hitters():
    return service.get_all()


@router.get("/{player_id}", response_model=Hitter)
async def get_hitter(player_id: int):
    hitter = service.get_by_id(player_id)
    if not hitter:
        raise HTTPException(status_code=404, detail="Hitter not found")
    return hitter
