# from fastapi import APIRouter, HTTPException
# from models.pitcher import Pitcher
# from services.pitcher_service import PitcherService
#
# router = APIRouter(prefix="/pitchers", tags=["pitchers"])
# service = PitcherService()
#
#
# @router.get("/", response_model=list[Pitcher])
# async def get_pitchers():
#     return service.get_all()
#
#
# @router.get("/{player_id}", response_model=Pitcher)
# async def get_pitcher(player_id: int):
#     pitcher = service.get_by_id(player_id)
#     if not pitcher:
#         raise HTTPException(status_code=404, detail="Pitcher not found")
#     return pitcher
