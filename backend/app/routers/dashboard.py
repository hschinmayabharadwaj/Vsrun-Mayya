from fastapi import APIRouter, Query

from app.data.catalog import DEMO_CITIZEN
from app.models import ApiResponse, DashboardData
from app.services.data_store import data_store

router = APIRouter()


@router.get("")
async def get_dashboard(
    citizenId: str | None = Query(None),
) -> ApiResponse[DashboardData]:
    citizen_id = citizenId or DEMO_CITIZEN.id
    dashboard = await data_store.get_dashboard(citizen_id)
    return ApiResponse(success=True, data=dashboard)
