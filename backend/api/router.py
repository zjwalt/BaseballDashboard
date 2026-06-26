from fastapi import APIRouter
from api.routes.hitters import router as hitters_router
# from api.routes.pitchers import router as pitchers_router

router = APIRouter()

router.include_router(hitters_router)
# router.include_router(pitchers_router)
